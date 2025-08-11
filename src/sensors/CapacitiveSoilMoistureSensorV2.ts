import type { PromisifiedBus } from "i2c-bus";

export interface MoistureSensorOptions {
  bus: PromisifiedBus;
  address?: number;
  bufferLength?: number;
  thresholds?: {
    min: number;
    max: number;
  };
}

export default class MoistureSensor {
  private bus: PromisifiedBus;
  private address: number;
  private bufferLength: number;
  private thresholds: {
    min: number;
    max: number;
  };

  constructor(options: MoistureSensorOptions) {
    this.bus = options.bus;
    this.address = options.address || 0x48;
    this.bufferLength = options.bufferLength || 2;
    this.thresholds = options.thresholds || {
      min: 7660,
      max: 18900,
    };
    this.initialize();
  }

  initialize(): void {
    console.log("Initializing Capacitive Soil Moisture Sensor V2.0");
  }

  private swapBytes(word: number): number {
    return ((word << 8) & 0xff00) | (word >> 8);
  }

  convertToPercent(raw: number): number {
    let normalized =
      (raw - this.thresholds.min) / (this.thresholds.max - this.thresholds.min);
    normalized = Math.max(0, Math.min(1, normalized));
    return (1 - normalized) * 100;
  }

  async currentRawValue(): Promise<number> {
    this.bus.writeWord(this.address, 0x01, this.swapBytes(0xc383));
    const buffer = Buffer.alloc(this.bufferLength);
    await this.bus.readI2cBlock(this.address, 0x00, this.bufferLength, buffer);
    const raw = buffer.readInt16BE(0);
    return raw;
  }

  async currentValue(): Promise<number> {
    const raw = await this.currentRawValue();
    if (isNaN(raw)) return NaN;
    return this.convertToPercent(raw);
  }
}
