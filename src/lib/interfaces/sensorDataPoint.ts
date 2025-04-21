export default interface SensorDataPoint {
  time: string | number | Date;
  source: string;
  value: number;
  parameter: string;
  sensorModel: string;
}
