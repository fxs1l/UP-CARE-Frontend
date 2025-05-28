"use client";

import {
  Map,
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconWind } from "@tabler/icons-react";
import boundariesGeoJson, {
  boundaryCoords,
} from "@/constants/boundariesGeoJson";
import AQNodeMarkers from "@/constants/aqNodeMarkers";
import buildingGeoJson from "@/constants/buildingGeoJson";
import useDateRangeStore from "@/hooks/use-date";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SensorDataPoint from "@/interfaces/sensor-data-point";
import { useIsMobile } from "@/hooks/use-mobile";
import usePollutantStore from "@/hooks/use-pollutant";

type MapComponentProps = {
  className?: string;
};

const MapComponent = (props: MapComponentProps) => {
  const { dateRange } = useDateRangeStore();
  const isMobile = useIsMobile();
  const { className } = props;
  const [showPopup, setShowPopup] = useState<number | null>(null);
  const [frames, setFrames] = useState<
    { date: string; hour: number; url: string }[]
  >([]);
  const [currentFrame, setcurrentFrame] = useState<number>(0);
  const { pollutant, setPollutant } = usePollutantStore();
  const [markerValues, setMarkerValues] = useState<SensorDataPoint[]>([]);
  const availablePollutants = ["NO2", "PM25", "SO2"];

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(
        `/api/v1/simulations/ENVI-met?pollutant=${pollutant}&from=${dateRange.from?.toISOString()}&to=${dateRange.to?.toISOString()}`,
      );
      const frames = await res.json();

      setFrames(frames);
    };

    if (dateRange) {
      fetchImages();
    }
  }, [pollutant, dateRange]);

  useEffect(() => {
    const fetchPollutant = async () => {
      if (!frames[currentFrame]) return;

      const { date, hour } = frames[currentFrame];
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);

      const stopTime = new Date(startTime);
      stopTime.setHours(startTime.getHours() + 1);

      const res = await fetch(
        `/api/v1/local/sensor-data?pollutant=${pollutant}&startTime=${startTime.toISOString()}&stopTime=${stopTime.toISOString()}`,
      );

      const points: SensorDataPoint[] = await res.json();

      setMarkerValues(points);
    };
    if (frames.length > 0) {
      fetchPollutant();
    }
  }, [pollutant, frames, currentFrame]);

  const bounds: LngLatBounds = new maplibregl.LngLatBounds(
    [121.066649, 14.651193],
    [121.070575, 14.654053],
  );

  const maxBounds = new maplibregl.LngLatBounds(
    [121.064486, 14.649639],
    [121.072823, 14.654697],
  );

  return (
    <div className={cn(className, "h-full w-full")}>
      <Map
        initialViewState={{
          bounds: bounds,
          latitude: bounds.getCenter().lat,
          longitude: bounds.getCenter().lng,
          zoom: 15,
          pitch: 30,
          bearing: 0,
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        mapLib={maplibregl}
        maxBounds={maxBounds}
      >
        <NavigationControl />
        <FullscreenControl />
        <ScaleControl />
        {AQNodeMarkers.map((marker, idx) => (
          <Marker
            key={idx}
            longitude={marker.position[1]}
            latitude={marker.position[0]}
          >
            <IconWind
              onClick={() => setShowPopup(idx)}
              className="rounded-full bg-black text-white"
              size={16}
            />
            {showPopup === idx && (
              <Popup
                longitude={marker.position[1]}
                latitude={marker.position[0]}
                onClose={() => setShowPopup(null)}
                closeOnClick={false}
                anchor="bottom"
              >
                <span className="self-start p-2 pb-0 leading-none font-semibold">
                  {marker.name}
                </span>
                <br />
                <span className="text-muted-foreground p-2 pt-0 text-sm">
                  From sensor value
                </span>
                <br />
                <span className="text-md p-2 pt-0">
                  {markerValues
                    .filter((m) => m.source === marker.name)
                    .map((m) =>
                      m.value !== undefined && m.value !== null
                        ? Number(m.value).toFixed(2)
                        : "None",
                    )}
                </span>
              </Popup>
            )}
          </Marker>
        ))}

        <Source id="buildings" type="geojson" data={buildingGeoJson}>
          <Layer
            id="3d-buildings"
            type="fill-extrusion"
            source="buildings"
            paint={{
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 1,
            }}
          />
        </Source>
        {frames.length > 0 && (
          <Source
            key={frames[currentFrame].url}
            id="image-overlay"
            type="image"
            url={frames[currentFrame].url}
            coordinates={[
              boundaryCoords[1],
              boundaryCoords[2],
              boundaryCoords[3],
              boundaryCoords[0],
            ]}
          >
            <Layer
              id="image-layer"
              type="raster"
              paint={{
                "raster-opacity": 0.8,
                "raster-fade-duration": 1500,
              }}
            />
          </Source>
        )}

        <Source id="boundaries" type="geojson" data={boundariesGeoJson}>
          <Layer
            id="boundary-layer"
            type="line"
            source="boundaries"
            paint={{ "line-color": "#FF0000", "line-width": 2 }}
          />
        </Source>
        <div className="absolute top-0 left-0 flex w-[90%] bg-transparent p-4">
          <div className="w-full">
            {frames.length > 0 && (
              <Slider
                defaultValue={[0]}
                max={frames.length - 1}
                step={1}
                className="w-[95%] pb-2"
                onValueChange={(v) => setcurrentFrame(v[0])}
                value={[currentFrame]}
                aria-label="Hour Slider"
                aria-valuetext={`${frames[currentFrame]?.hour ?? 0}:00`}
              />
            )}
            <div className="flex items-center gap-2">
              <Select value={pollutant} onValueChange={setPollutant}>
                <SelectTrigger className="w-auto !bg-white">
                  <SelectValue placeholder="Select pollutant" />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  <SelectGroup>
                    {availablePollutants.map((pollutant) => (
                      <SelectItem key={pollutant} value={pollutant}>
                        {pollutant}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="w-fit rounded-md !bg-white px-3 py-2 text-sm whitespace-nowrap shadow-xs">
                {frames.length > 0
                  ? `${frames[currentFrame].date} ${String(frames[currentFrame].hour).padStart(2, "0")}:00`
                  : isMobile
                    ? "No simulations available!"
                    : "No simulations available. Choose a different date range."}
              </span>
            </div>
          </div>
        </div>
      </Map>
    </div>
  );
};

export default MapComponent;
