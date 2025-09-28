import fs from 'node:fs';
import moment from 'moment';
import Cam from './camera';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const timelapsePath = process.env.TIMELAPSE_PATH || config.timelapsePath;
const interval = parseInt(process.env.TIMELAPSE_INTERVAL_MS || config.timelapseIntervalMs || 30000);
const apiKey = process.env.IMGBB_API_KEY || config.imgbbApiKey;

async function main() {
  const cam = new Cam({
    path: timelapsePath,
  });

  setInterval(async () => {
    const imagePath = await cam.captureImage();
    console.info(moment().format('yyyy-MM-DD_HH:mm:ss'), '- Image taken -', imagePath);
    if (apiKey) await uploadImage(imagePath);
  }, interval);
}

main().catch(console.error);

async function uploadImage(imagePath: string) {
  if (!apiKey) return;
  const form = new FormData();
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  form.append('image', base64Image);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: form,
  });

  const result = await response.json();
  return result;
}
