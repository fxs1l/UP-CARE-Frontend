import { NextResponse } from 'next/server'
import { flux, fluxDuration, HttpError } from '@influxdata/influxdb-client'
import influxQueryApi from '@/database/influxdb'
import TrafficDataPoint from '@/interfaces/traffic-data-point'
import { influxBucket } from '@/lib/database/config'
import { subDays } from 'date-fns'

export async function GET(request: Request) {
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

    const fluxQuery = flux`from(bucket:${influxBucket})
    ${range}
    |> filter(fn: (r) =>
      r._measurement == "traffic_readings" and
      r._field == "vehicle_id"
    )
    |> group(columns: ["vehicle_type"])
    |> window(every: 15s, period: 1m)
    |> distinct(column: "_value")
    |> group(columns: ["vehicle_type", "_start"])
    |> count(column: "_value")
    |> map(fn: (r) => ({
        _time: r._start,
        _value: r._value,
        _field: "unique_vehicle_count",
        vehicle_type: r.vehicle_type,
        _measurement: "traffic_summary"
    }))
    ${aggregateWindow}
    `
    const rows = await influxQueryApi.collectRows(fluxQuery)
    const points: TrafficDataPoint[] = rows.map((row) => {
      const dataPoint = row as Record<string, never>;
      return {
        time: Date.parse(dataPoint._time),
        source: "Vehicle Count",
        value: Math.ceil(dataPoint._value),
        vehicleType: dataPoint.vehicle_type,
      } as TrafficDataPoint;
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
