import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import moment from 'moment';

const execAsync = promisify(exec);

export interface CamOptions {
  path: string;
  width?: number;
  height?: number;
  quality?: number;
  timeout?: number;
}

export default class Cam {
  private path: string;
  private width: number;
  private height: number;
  private quality: number;
  private timeout: number;

  constructor(options: CamOptions) {
    this.path = options.path;
    this.width = options.width || 1900;
    this.height = options.height || 1080;
    this.quality = options.quality || 100;
    this.timeout = options.timeout || 0;
    this.initialize();
  }

  initialize(): void {
    console.log('Initializing 5MP Raspberry Pi Cam (1080p)');
  }

  async captureImage(path?: string): Promise<string> {
    try {
      const timestamp = moment().format('yyyy-MM-DD_HH:mm:ss');
      const imagePath = `${this.path}/${timestamp}.jpg`.replace('//', '/');
      await execAsync(
        `rpicam-still --output ${imagePath} --width ${this.width} --height ${this.height} --quality ${this.quality} --timeout ${this.timeout} --immediate --nopreview`
      );
      return imagePath;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
