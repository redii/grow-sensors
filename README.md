# 🌱 Grow Sensors

This repo contains the logic for collecting data from multiple sensors and sending it to the prometheus [grow-exporter](https://github.com/redii/grow-exporter) and a timelapse script, which continously takes images using a Raspberry Pi Cam and the rpicam-still command.

## Project Structure

```
grow-sensors
├── src
│   ├── monitoring.ts    # Continously reads data from sensors and pushes them to the exporter
│   ├── debug.ts         # Continously reads data from sensors and logs them to console
│   ├── timelapse.ts     # Continously takes images using rpicam-still
│   ├── camera
|   |   └── index.ts
│   └── sensors
│       ├── BH1750Sensor.ts
|       ├── CapacitiveSoilMoistureSensorV2.ts
|       └── SHT31Sensor.ts
├── package.json         # npm configuration file
├── tsconfig.json        # TypeScript configuration file
└── README.md            # Project documentation
```

## Usage

The script needs a config which can be provided using a ´config.json´ file or environment variables. Take a look at the [config.example.json](https://github.com/redii/grow-sensors/blob/main/config.example.json) file or use the following environment variables:

### Monitoring using sensors

| Variable             | Required           | Default | Description                                                                                      |
| -------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `EXPORTER_URL`       | ✅ (not for debug) | –       | The full URL to the Prometheus exporter `/push` endpoint. Example: `http://localhost:3000/push`. |
| `EXPORTER_API_KEY`   | ✅ (not for debug) | -       | The API key required to access the exporter `/push` endpoint.                                    |
| `SENSOR_INTERVAL_MS` | ❌                 | `5000`  | Time between sensor readings (in milliseconds).                                                  |

You can start the script using `npm run dev` for debug mode or `npm run push` for push mode.

### Timelapse using Raspberry Pi Cam

| Variable             | Required | Default | Description                                      |
| -------------------- | -------- | ------- | ------------------------------------------------ |
| `SENSOR_INTERVAL_MS` | ❌       | `30000` | Time between timelapse images (in milliseconds). |

## License

This project is licensed under the MIT License.
