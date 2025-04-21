import { NextResponse } from 'next/server'
import { flux, fluxDuration, HttpError } from '@influxdata/influxdb-client'
import influxQueryApi from '@/database/influxdb'
import { influxBucket } from '@/lib/database/config'
import SensorDataPoint from '@/lib/interfaces/sensor-data-point'

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url)
    const startTime = searchParams.get('startTime') || "-90d";
    const stopTime = searchParams.get('stopTime');
    const range = flux`|> range(start: ${fluxDuration(startTime)}, stop: ${fluxDuration(stopTime)})`

    const fluxQuery = flux`from(bucket:${influxBucket})
    ${range}
    |> filter(fn: (r) => r._measurement == "sensor_readings")`

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
      console.log('Error in API route:', e.body)
    } else {
      console.log('Error in API route:', e)
    }
    return NextResponse.error()
  }
}
