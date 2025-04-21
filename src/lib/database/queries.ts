import { flux } from '@influxdata/influxdb-client'
import { influxBucket } from '@/database/config';

const sensorDataBaseQuery = flux`
  from(bucket: "${influxBucket}")
    |> filter(fn: (r) => r._measurement == "sensor_readings")`;

const trafficDataBaseQuery = flux`
  from(bucket: "${influxBucket}")
    |> filter(fn: (r) => r._measurement == "traffic_readings")`;

export { sensorDataBaseQuery, trafficDataBaseQuery }
