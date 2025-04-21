import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { influxUrl, influxOrg, influxBucket, influxToken } from "./config";
import { Agent } from "http";


const keepAliveAgent = new Agent({
  keepAlive: true, // reuse existing connections
  keepAliveMsecs: 20 * 1000, // 20 seconds keep alive
});

process.on("exit", () => keepAliveAgent.destroy());

const influxQueryApi = new InfluxDB(
  {
    url: influxUrl,
    token: influxToken,
    // transportOptions: { agent: keepAliveAgent },
  }).getQueryApi(influxOrg);

export default influxQueryApi;
