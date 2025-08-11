import type { PromisifiedBus } from "i2c-bus";

// sensor datasheet: https://www.mouser.com/datasheet/2/348/bh1750fvi-e-186247.pdf

export interface BH1750SensorOptions {
  bus: PromisifiedBus;
  address?: number;
  command?: 0x10 | 0x11 | 0x13;
  bufferLength?: number;
}

export default class BH1750Sensor {
  private bus: PromisifiedBus;
  private address: number;
  private command: 0x10 | 0x11 | 0x13;
  private bufferLength: number;

  constructor(options: BH1750SensorOptions) {
    this.bus = options.bus;
    this.address = options.address || 0x23;
    this.command = options.command || 0x10;
    this.bufferLength = options.bufferLength || 2;
    this.initialize();
  }

  initialize(): void {
    console.log("Initializing BH1750 Sensor (light)");
    this.bus.sendByte(this.address, this.command);
  }

  convertToLux(raw: number): number {
    return raw / 1.2;
  }

  async currentRawValue(): Promise<number> {
    const buffer = Buffer.alloc(this.bufferLength);
    await this.bus.readI2cBlock(
      this.address,
      this.command,
      this.bufferLength,
      buffer
    );
    return (buffer[0] << 8) | buffer[1];
  }

  async currentValue(): Promise<number> {
    const raw = await this.currentRawValue();
    if (isNaN(raw)) return NaN;
    return this.convertToLux(raw);
  }
}
