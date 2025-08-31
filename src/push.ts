import fs from 'node:fs';
import * as i2c from 'i2c-bus';
import BH1750Sensor from './sensors/BH1750Sensor';
import SHT31Sensor from './sensors/SHT31Sensor';
import MoistureSensor from './sensors/CapacitiveSoilMoistureSensorV2';

import type { PromisifiedBus } from 'i2c-bus';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const exporterUrl = process.env.EXPORTER_URL || config.exporterUrl;
const exporterApiKey = process.env.EXPORTER_API_KEY || config.exporterApiKey;
const sensorInterval = parseInt(process.env.SENSOR_INTERVAL_MS || config.sensorIntervalMs || 5000);

const bh1750Address = 0x23;
const sht31Address = 0x44;
const moistureSensorAddress = 0x48;

async function main() {
  const bus: PromisifiedBus = await i2c.openPromisified(1);
  const detectedAddresses = await bus.scan();

  let bh1750: BH1750Sensor | undefined;
  let sht31: SHT31Sensor | undefined;
  let moistureSensor: MoistureSensor | undefined;
  if (detectedAddresses.includes(bh1750Address)) bh1750 = new BH1750Sensor({ bus });
  if (detectedAddresses.includes(sht31Address)) sht31 = new SHT31Sensor({ bus });
  if (detectedAddresses.includes(moistureSensorAddress)) moistureSensor = new MoistureSensor({ bus });

  setInterval(async () => {
    const { temperature, humidity } = sht31
      ? await sht31.currentValues()
      : { temperature: undefined, humidity: undefined };
    const moisture = moistureSensor ? await moistureSensor.currentValue() : undefined;
    const illuminance = bh1750 ? await bh1750.currentValue() : temperature;

    await fetch(exporterUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': exporterApiKey,
      },
      body: JSON.stringify({
        temperature,
        humidity,
        moisture,
        illuminance,
      }),
    });
  }, sensorInterval);
}

main().catch(console.error);
