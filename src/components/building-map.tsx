"use client";

import Map, { Source, Layer, Marker, Popup } from "react-map-gl/maplibre";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IconWind } from "@tabler/icons-react";
import boundariesGeoJson, {
  boundaryCoords,
} from "@/app/constants/boundariesGeoJson";
import AQNodeMarkers from "@/app/constants/aqNodeMarkers";
import buildingGeoJson from "../app/constants/buildingGeoJson";

type MapComponentProps = {
  children?: React.ReactNode;
  className?: string;
};

const MapComponent = (props: MapComponentProps) => {
  const { className, children } = props;
  const [showPopup, setShowPopup] = useState<number | null>(null);

  const bounds: LngLatBounds = new maplibregl.LngLatBounds(
    [121.066649, 14.651193],
    [121.070575, 14.654053],
  );

  const maxBounds = new maplibregl.LngLatBounds(
    [121.064486, 14.649639],
    [121.072823, 14.654697],
  );

  const smallerAOI: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: null },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [121.06923178726386, 14.651760935579155],
                [121.067895009033279, 14.651771081089251],
                [121.067906508462599, 14.653207871777072],
                [121.069243295428862, 14.653197727266644],
                [121.06923178726386, 14.651760935579155],
              ],
            ],
          ],
        },
      },
    ],
  };

  return (
    <div className={cn(className, "h-full w-full")}>
      <Map
        initialViewState={{
          bounds: bounds,
          latitude: 14.652496,
          longitude: 121.068641,
          zoom: 15,
          pitch: 30,
          bearing: -30,
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        mapLib={maplibregl}
        maxBounds={maxBounds}
      >
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
                anchor="top"
              >
                {marker.name}
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
              "fill-extrusion-opacity": 0.7,
            }}
          />
        </Source>

        <Source id="boundaries" type="geojson" data={boundariesGeoJson}>
          <Layer
            id="boundary-layer"
            type="line"
            source="boundaries"
            paint={{ "line-color": "#FF0000", "line-width": 2 }}
          />
        </Source>
        <Source
          id="image-overlay"
          type="image"
          // url="/simulations/result_S02Concentrationgm3_09052025_080001_0_3.png"
          url="/simulations/NOxConcentrationgm3_09052025_100001_0_5.png"
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
              "raster-opacity": 0.7,
            }}
          />
        </Source>
        {children}
      </Map>
    </div>
  );
};

export default MapComponent;
