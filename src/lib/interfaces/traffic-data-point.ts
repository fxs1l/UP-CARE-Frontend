export default interface TrafficDataPoint {
  time: number; // milliseconds since epoch
  source: string;
  value: number;
  vehicleType?: string;
}
