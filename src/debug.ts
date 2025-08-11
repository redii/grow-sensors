import fs from "node:fs";
import * as i2c from "i2c-bus";
import BH1750Sensor from "./sensors/BH1750Sensor";
import SHT31Sensor from "./sensors/SHT31Sensor";
import MoistureSensor from "./sensors/CapacitiveSoilMoistureSensorV2";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const sensorInterval = parseInt(
  process.env.SENSOR_INTERVAL_MS || config.sensorIntervalMs
);

async function main() {
  const bus = await i2c.openPromisified(1);

  const bh1750 = new BH1750Sensor({ bus });
  const sht31 = new SHT31Sensor({ bus });
  const moistureSensor = new MoistureSensor({ bus });

  setInterval(async () => {
    const { temperature: temperatureRaw, humidity: humidityRaw } =
      await sht31.currentRawValues();
    const temperature = sht31.convertToCelsius(temperatureRaw);
    const humidity = sht31.convertToCelsius(humidityRaw);
    const moistureRaw = await moistureSensor.currentRawValue();
    const moisture = moistureSensor.convertToPercent(moistureRaw);
    const illuminanceRaw = await bh1750.currentRawValue();
    const illuminance = bh1750.convertToLux(illuminanceRaw);

    console.log(
      "Sensor".padEnd(13) + "Unit".padEnd(9) + "Value".padEnd(7) + "Raw"
    );
    console.log(
      "Temperature".padEnd(13) +
        "Celsius".padEnd(9) +
        String(rountToTwo(temperature)).padEnd(7) +
        temperatureRaw
    );
    console.log(
      "Humidity".padEnd(13) +
        "%".padEnd(9) +
        String(rountToTwo(humidity)).padEnd(7) +
        humidityRaw
    );
    console.log(
      "Moisture".padEnd(13) +
        "%".padEnd(9) +
        String(rountToTwo(moisture)).padEnd(7) +
        moistureRaw
    );
    console.log(
      "Illuminance".padEnd(13) +
        "Lux".padEnd(9) +
        String(rountToTwo(illuminance)).padEnd(7) +
        illuminanceRaw,
      "\n"
    );
  }, sensorInterval);
}

function rountToTwo(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

main().catch(console.error);
