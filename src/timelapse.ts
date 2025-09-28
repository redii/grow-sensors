import fs from 'node:fs';
import Cam from './camera';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const exporterUrl = process.env.EXPORTER_URL || config.exporterUrl;
const exporterApiKey = process.env.EXPORTER_API_KEY || config.exporterApiKey;
const sensorInterval = parseInt(process.env.SENSOR_INTERVAL_MS || config.sensorIntervalMs || 5000);

async function main() {
  const cam = new Cam({
    path: './images',
  });

  console.log(await cam.captureImage());

  // setInterval(async () => {
  //   console.info(new Date(), 'Image taken');
  // }, sensorInterval);
}

main().catch(console.error);
