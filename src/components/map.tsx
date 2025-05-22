"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, Popup, TileLayer, Marker, GeoJSON } from "react-leaflet";
import {
  GeoJsonObject,
  Feature,
  Geometry,
  FeatureCollection,
  GeoJsonProperties,
} from "geojson";
import osmtogeojson from "osmtogeojson";
import "leaflet/dist/leaflet.css";
import { IconWind } from "@tabler/icons-react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

// Define the allowed bounds
import { LatLngBoundsLiteral } from "leaflet";
import { cn } from "../lib/utils";

const bounds: LatLngBoundsLiteral = [
  [14.651193, 121.066649],
  [14.654053, 121.070575],
];

const center: [number, number] = [40.743, -74.176]; // Center point within bounds

const BuildingMap = () => {
  // Extract building heights
  interface FeatureProperties {
    height?: number;
    levels?: number;
    id?: string;
  }

  interface Feature {
    id?: string;
    properties: FeatureProperties;
  }

  interface GeoJSONData {
    features: Feature[];
  }

  interface BuildingHeight {
    id?: string;
    height: number | null;
  }

  const getBuildingHeights = (data: GeoJSONData): BuildingHeight[] => {
    return data.features.map((feature) => {
      const props = feature.properties;
      const height =
        props.height || // direct height in meters
        (props.levels ? props.levels * 3 : null); // estimate: 1 level ≈ 3m
      return {
        id: feature.id || props.id,
        height,
      };
    });
  };
};
const AQMarkers: { name: string; position: [number, number] }[] = [
  {
    name: "AQ 1 (Nearest Gateway)",
    position: [14.652558, 121.068706],
  },
  {
    name: "AQ 2 (CAL Side)",
    position: [14.652532, 121.068599],
  },
  {
    name: "AQ 3 (NISMED Side)",
    position: [14.652439, 121.068583],
  },
  {
    name: "AQ 4 (Miranda Side)",
    position: [14.652439, 121.068693],
  },
];

type BoundedMapProps = {
  children?: React.ReactNode;
  className?: string;
};

function BuildingsMap() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/building-details.json"); // Fetch from /public
      const osmData = await response.json();
      const geojson = osmtogeojson(osmData); // Convert OSM JSON to GeoJSON
      setGeoJsonData(geojson);
    };
    fetchData();
  }, []);

  if (geoJsonData) {
    return <GeoJSON data={geoJsonData} />;
  }

  return null;
}

const BoundedMap = (props: BoundedMapProps) => {
  const { className, children } = props;
  const boundariesGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "1" },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [121.067091486020331, 14.651341719988014],
                [121.067108167161493, 14.653845150623949],
                [121.07074102686974, 14.653822180018956],
                [121.070724304376782, 14.651318744599028],
                [121.067091486020331, 14.651341719988014],
              ],
            ],
          ],
        },
      },
    ],
  };
  return (
    <MapContainer
      className={cn(className)}
      style={{ height: "500px", width: "100%" }}
      maxBounds={bounds}
      bounds={bounds}
      zoom={25}
      maxBoundsViscosity={1.0} // Prevents dragging outside bounds
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {AQMarkers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position}
          icon={L.divIcon({
            html: `${ReactDOMServer.renderToString(<IconWind className="rounded-full bg-black text-white" size={16} />)}`,
            className: "custom-icon",
          })}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
      {children}
      <GeoJSON data={boundariesGeoJson} />
      {/* <BuildingsMap /> */}
    </MapContainer>
  );
};

export default BoundedMap;
