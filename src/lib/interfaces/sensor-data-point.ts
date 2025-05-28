export default interface SensorDataPoint {
  time: number; // milliseconds since epoch
  [key: string]: number | string; // allows for dynamic properties

}
