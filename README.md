# 🌱 Grow Sensors

This repo contains the logic for collecting data from multiple sensors and sending it to an [prometheus exporter](https://github.com/redii/grow-exporter).

## Project Structure

```
grow-sensors
├── src
│   ├── push.ts          # Continously reads data from sensors and pushes them to the exporter
│   ├── debug.ts         # Continously reads data from sensors and logs them to console
│   └── sensors
│       ├── BH1750Sensor.ts
|       ├── CapacitiveSoilMoistureSensorV2.ts
|       └── SHT31Sensor.ts
├── package.json         # npm configuration file
├── tsconfig.json        # TypeScript configuration file
└── README.md            # Project documentation
```

## Usage

The script need a config which can be provided using a ´config.json´ file or environment variables. Take a look at the [config.example.json](https://github.com/redii/grow-sensors/blob/main/config.example.json) file or use the following env variables:

| Variable             | Required           | Default | Description                                                                                      |
| -------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `EXPORTER_URL`       | ✅ (not for debug) | –       | The full URL to the Prometheus exporter `/push` endpoint. Example: `http://localhost:3000/push`. |
| `EXPORTER_API_KEY`   | ✅ (not for debug) | -       | The API key required to access the exporter `/push` endpoint.                                    |
| `SENSOR_INTERVAL_MS` | ❌                 | `5000`  | Time between sensor readings (in milliseconds).                                                  |

You can start the script using `npm run dev` for debug mode or `npm run push` for push mode.

## License

This project is licensed under the MIT License.
