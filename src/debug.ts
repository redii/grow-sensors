import fs from 'node:fs';
import * as i2c from 'i2c-bus';
import BH1750Sensor from './sensors/BH1750Sensor';
import SHT31Sensor from './sensors/SHT31Sensor';
import MoistureSensor from './sensors/CapacitiveSoilMoistureSensorV2';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const sensorInterval = parseInt(process.env.SENSOR_INTERVAL_MS || config.sensorIntervalMs || 500);

const bh1750Address = 0x23;
const sht31Address = 0x44;
const moistureSensorAddress = 0x48;

async function main() {
  const bus = await i2c.openPromisified(1);
  const detectedAddresses = await bus.scan();

  let bh1750: BH1750Sensor | undefined;
  let sht31: SHT31Sensor | undefined;
  let moistureSensor: MoistureSensor | undefined;
  if (detectedAddresses.includes(bh1750Address)) bh1750 = new BH1750Sensor({ bus });
  if (detectedAddresses.includes(sht31Address)) sht31 = new SHT31Sensor({ bus });
  if (detectedAddresses.includes(moistureSensorAddress)) moistureSensor = new MoistureSensor({ bus });

  setInterval(async () => {
    const { temperature: temperatureRaw, humidity: humidityRaw } = sht31
      ? await sht31.currentRawValues()
      : { temperature: undefined, humidity: undefined };
    const temperature = sht31 && temperatureRaw ? sht31.convertToCelsius(temperatureRaw) : undefined;
    const humidity = sht31 && humidityRaw ? sht31.convertToCelsius(humidityRaw) : undefined;
    const moistureRaw = moistureSensor ? await moistureSensor.currentRawValue() : undefined;
    const moisture = moistureSensor && moistureRaw ? moistureSensor.convertToPercent(moistureRaw) : undefined;
    const illuminanceRaw = bh1750 ? await bh1750.currentRawValue() : undefined;
    const illuminance = bh1750 && illuminanceRaw ? bh1750.convertToLux(illuminanceRaw) : undefined;

    console.log('Sensor'.padEnd(13) + 'Unit'.padEnd(9) + 'Value'.padEnd(7) + 'Raw');
    console.log(
      'Temperature'.padEnd(13) + 'Celsius'.padEnd(9) + String(rountToTwo(temperature)).padEnd(7) + temperatureRaw
    );
    console.log('Humidity'.padEnd(13) + '%'.padEnd(9) + String(rountToTwo(humidity)).padEnd(7) + humidityRaw);
    console.log('Moisture'.padEnd(13) + '%'.padEnd(9) + String(rountToTwo(moisture)).padEnd(7) + moistureRaw);
    console.log(
      'Illuminance'.padEnd(13) + 'Lux'.padEnd(9) + String(rountToTwo(illuminance)).padEnd(7) + illuminanceRaw,
      '\n'
    );
  }, sensorInterval);
}

function rountToTwo(number: number | undefined): number | undefined {
  if (number === undefined) return undefined;
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

main().catch(console.error);
