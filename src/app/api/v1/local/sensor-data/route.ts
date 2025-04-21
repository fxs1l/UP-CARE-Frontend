import { NextResponse } from 'next/server'
import { flux, fluxDuration, HttpError } from '@influxdata/influxdb-client'
import influxQueryApi from '@/database/influxdb'
import { influxBucket } from '@/lib/database/config'
import SensorDataPoint from '@/interfaces/sensorDataPoint'

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url)
    const startTime = searchParams.get('startTime') || "-7d";
    const stopTime = searchParams.get('stopTime');
    const range = flux`|> range(start: ${fluxDuration(startTime)}, stop: ${fluxDuration(stopTime)})`

    const fluxQuery = flux`from(bucket:${influxBucket})
    ${range}
    |> filter(fn: (r) => r._measurement == "sensor_readings")`

    console.log('fluxQuery:', fluxQuery)

    const points: SensorDataPoint[] = []
    for await (const { values, tableMeta } of influxQueryApi.iterateRows(fluxQuery)) {
      const dataPoint = tableMeta.toObject(values)
      const formattedPoint: SensorDataPoint = {
        time: dataPoint._time,
        source: dataPoint.source,
        value: dataPoint._value,
        sensorModel: dataPoint.sensor_model,
        parameter: dataPoint.parameter,
      }
      points.push(formattedPoint);
    }
    console.log('Data Points:', points[0])

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
