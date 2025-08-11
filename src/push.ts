import fs from "node:fs";
import * as i2c from "i2c-bus";
import BH1750Sensor from "./sensors/BH1750Sensor";
import SHT31Sensor from "./sensors/SHT31Sensor";
import MoistureSensor from "./sensors/CapacitiveSoilMoistureSensorV2";

import type { PromisifiedBus } from "i2c-bus";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const exporterUrl = process.env.EXPORTER_URL || config.exporterUrl;
const exporterApiKey = process.env.EXPORTER_API_KEY || config.exporterApiKey;
const sensorInterval = parseInt(
  process.env.SENSOR_INTERVAL_MS || config.sensorIntervalMs || 5000
);

async function main() {
  const bus: PromisifiedBus = await i2c.openPromisified(1);

  const bh1750 = new BH1750Sensor({ bus });
  const sht31 = new SHT31Sensor({ bus });
  const moistureSensor = new MoistureSensor({ bus });

  setInterval(async () => {
    const { temperature, humidity } = await sht31.currentValues();
    const moisture = await moistureSensor.currentValue();
    const illuminance = await bh1750.currentValue();

    await fetch(exporterUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": exporterApiKey,
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
