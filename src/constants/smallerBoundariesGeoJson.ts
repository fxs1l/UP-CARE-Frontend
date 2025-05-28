import { FeatureCollection } from "geojson";

export const smallerBoundaryCoords: [number, number][] = [
  [121.06923178726386, 14.651760935579155],
  [121.067895009033279, 14.651771081089251],
  [121.067906508462599, 14.653207871777072],
  [121.069243295428862, 14.653197727266644],
  [121.06923178726386, 14.651760935579155],
]
const smallerBoundariesGeoJson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: null },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            smallerBoundaryCoords,
          ],
        ],
      },
    },
  ],
};

export default smallerBoundariesGeoJson;
