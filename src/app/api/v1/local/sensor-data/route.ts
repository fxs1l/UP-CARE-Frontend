import { NextResponse } from 'next/server'
import { flux, fluxDuration, HttpError } from '@influxdata/influxdb-client'
import influxQueryApi from '@/database/influxdb'
import { influxBucket } from '@/lib/database/config'
import SensorDataPoint from '@/lib/interfaces/sensor-data-point'
import { subDays } from 'date-fns'

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url)

    const defaultStartTime = subDays(new Date(), 90).toISOString(); // 90 days ago
    const defaultStopTime = new Date().toISOString(); // now
    const startTime = searchParams.get('startTime') || defaultStartTime;
    const stopTime = searchParams.get('stopTime') || defaultStopTime;
    const range = flux`|> range(start: time(v: ${startTime}), stop: time(v: ${stopTime}))`

    const parameter = searchParams.get('parameter')
    const parameterFilter = flux`|> filter(fn: (r) => r.parameter == ${parameter})`

    const fluxQuery = flux`from(bucket:${influxBucket})
    ${range}
    |> filter(fn: (r) => r._measurement == "sensor_readings")
    |> filter(fn: (r) => r["_field"] == "value")
    |> filter(fn: (r) =>
      r["source"] == "AQ NODE 1" or
      r["source"] == "AQ NODE 2" or
      r["source"] == "AQ NODE 3" or
      r["source"] == "AQ NODE 4"
    )
    ${parameter ? parameterFilter : ''}`

    const rows = await influxQueryApi.collectRows(fluxQuery)
    const points: SensorDataPoint[] = rows.map((row) => {
      const dataPoint = row as Record<string, never>;
      return {
        time: Date.parse(dataPoint._time),
        source: dataPoint.source,
        value: dataPoint._value,
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
