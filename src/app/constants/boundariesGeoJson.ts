import { FeatureCollection } from "geojson";

export const boundaryCoords: [number, number][] = [
  [121.067091486020331, 14.651341719988014],
  [121.067108167161493, 14.653845150623949],
  [121.07074102686974, 14.653822180018956],
  [121.070724304376782, 14.651318744599028],
  [121.067091486020331, 14.651341719988014],
];


const boundariesGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "1" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[boundaryCoords]],
      },
    },
  ],
};

export default boundariesGeoJson;
