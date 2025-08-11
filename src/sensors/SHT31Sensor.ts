import type { PromisifiedBus } from "i2c-bus";

export interface SHT31SensorOptions {
  bus: PromisifiedBus;
  address?: number;
  bufferLength?: number;
}

export default class SHT31Sensor {
  private bus: PromisifiedBus;
  private address: number;
  private instructions: {
    REGISTER_RESET: number;
    REQUEST_MEASUREMENT: number;
    REGISTER_ALL_DATA: number;
  };
  private bufferLength: number;

  constructor(options: SHT31SensorOptions) {
    this.bus = options.bus;
    this.address = options.address || 0x44;
    this.instructions = {
      REGISTER_RESET: 0x30,
      REQUEST_MEASUREMENT: 0x2c,
      REGISTER_ALL_DATA: 0x00,
    };
    this.bufferLength = options.bufferLength || 6;
    this.initialize();
  }

  initialize(): void {
    console.log("Initializing SHT31 Sensor (temperature and humidity)");
  }

  convertToCelsius(raw: number): number {
    return -45 + (175 * raw) / 65535.0;
  }

  convertToPercent(raw: number): number {
    const humidity = (100 * raw) / 65535.0;
    return humidity > 100 ? 100 : humidity < 0 ? 0 : humidity;
  }

  async currentRawValues(): Promise<{ temperature: number; humidity: number }> {
    await this.bus.writeByte(
      this.address,
      this.instructions.REQUEST_MEASUREMENT,
      0x06
    );
    const buffer = Buffer.alloc(this.bufferLength);
    await this.bus.readI2cBlock(
      this.address,
      this.instructions.REQUEST_MEASUREMENT,
      this.bufferLength,
      buffer
    );
    const temperature = (buffer[0] << 8) | buffer[1];
    const humidity = (buffer[3] << 8) | buffer[4];

    return {
      temperature,
      humidity,
    };
  }

  async currentValues(): Promise<{ temperature: number; humidity: number }> {
    let { temperature, humidity } = await this.currentRawValues();

    return {
      temperature: this.convertToCelsius(temperature),
      humidity: this.convertToPercent(humidity),
    };
  }
}
