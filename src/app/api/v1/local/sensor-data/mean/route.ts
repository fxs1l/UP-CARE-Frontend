import { NextResponse, NextRequest } from 'next/server'
import { flux, fluxDuration, HttpError } from '@influxdata/influxdb-client'
import influxQueryApi from '@/database/influxdb'
import { influxBucket } from '@/lib/database/config'
import SensorDataPoint from '@/lib/interfaces/sensor-data-point'
import { subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)

    const defaultStartTime = subDays(new Date(), 1).toISOString(); // 1 week ago
    const defaultStopTime = new Date().toISOString(); // now
    const startTimeParam = searchParams.get('startTime');
    const startTime = startTimeParam ? new Date(startTimeParam).toISOString() : defaultStartTime;
    const stopTimeParam = searchParams.get('stopTime');
    const stopTime = stopTimeParam ? new Date(stopTimeParam).toISOString() : defaultStopTime;
    const source = searchParams.get('source')
    const parameter = searchParams.get('pollutant') || searchParams.get('parameter')
    const bucketSizeParam = searchParams.get('bucketSize');

    // Calculate time difference in milliseconds to automatically determine bucketSize
    const diffMs = new Date(stopTime).getTime() - new Date(startTime).getTime();
    let defaultBucketSize: string;
    if (diffMs < 60 * 60 * 1000) { // less than 1 hour
      defaultBucketSize = '1m';
    } else if (diffMs < 30 * 24 * 60 * 60 * 1000) { // less than 1 month (30 days)
      defaultBucketSize = '1h';
    } else if (diffMs < 365 * 24 * 60 * 60 * 1000) { // less than 1 year
      defaultBucketSize = '1d';
    } else {
      defaultBucketSize = '1w'; // default for longer ranges
    }
    const bucketSize = bucketSizeParam ? bucketSizeParam : defaultBucketSize;
    const aggregateWindow = flux`|> aggregateWindow(every: ${fluxDuration(bucketSize)}, fn: mean, createEmpty: false)`
    const range = flux`|> range(start: time(v: ${startTime}), stop: time(v: ${stopTime}))`
    const parameterFilter = parameter
      ? flux`|> filter(fn: (r) => r.parameter == ${parameter})`
      : flux``
    const sourceFilter = source
      ? flux`|> filter(fn: (r) => r["source"] == ${source})`
      : flux`|> filter(fn: (r) =>
          r["source"] == "AQ NODE 1" or
          r["source"] == "AQ NODE 2" or
          r["source"] == "AQ NODE 3" or
          r["source"] == "AQ NODE 4"
        )`

    const fluxQuery = flux`from(bucket:${influxBucket})
    ${range}
    |> filter(fn: (r) => r._measurement == "sensor_readings")
    |> filter(fn: (r) => r["_field"] == "value")
    |> filter(fn: (r) => r.source != "lat" or r.source != "long")
    ${sourceFilter}
    ${parameterFilter}
    ${aggregateWindow}
    |> group(columns: ["_time"])
    |> mean()
    |> group()
    `

    const rows = await influxQueryApi.collectRows(fluxQuery)
    const points: SensorDataPoint[] = rows.map((row) => {
      const dataPoint = row as Record<string, never>;
      return {
        time: Date.parse(dataPoint._time),
        mean: dataPoint._value,
        sensorModel: dataPoint.sensor_model,
        parameter: dataPoint.parameter,
      };
    });

    return NextResponse.json(points)
  } catch (e: unknown) {
    if (e instanceof HttpError) {
      console.error('Error in API route:', e.body)
    } else {
      console.error('Error in API route:', e)
    }
    return NextResponse.error()
  }
}
