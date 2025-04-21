export default interface SensorDataPoint {
  time: number; // milliseconds since epoch
  source: string;
  value: number;
  parameter: string;
  sensorModel: string;
}
