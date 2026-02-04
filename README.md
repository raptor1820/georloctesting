# Live Location Tracker

A simple web application for testing browser-based geolocation tracking, specifically designed to evaluate the feasibility of tracking vehicle locations using iPads.

## Running the App

```bash
npm install
npm start
```

Server runs at: **http://localhost:3000**

## Features

- Real-time location tracking using the browser's Geolocation API
- Configurable update intervals (1-10 seconds)
- Accuracy indicators (high/medium/low)
- Speed display (km/h)
- Location history log
- Direct Google Maps link
- Session statistics

## Testing on Mobile Devices with Dev Tunnels

To test on an iPad or phone:

1. In VS Code, open Command Palette (`Ctrl+Shift+P`)
2. Run **"Forward a Port"**
3. Enter port `3000`
4. Set visibility to **"Public"**
5. Copy the generated URL and open it on your mobile device

**Important**: Geolocation requires HTTPS or localhost. Dev Tunnels provide HTTPS, making them perfect for mobile testing.

## Testing Recommendations

When testing on a Stinger bus or vehicle:

1. Start tracking before boarding
2. Note the accuracy values - lower is better (<10m is excellent)
3. Check how frequently updates are received while moving
4. Test in areas with varying GPS signal quality
5. Compare indoor vs outdoor accuracy

## GPSTab Integration Research

[GPSTab](https://www.gpstab.com/) is a fleet tracking solution. Key findings:

### API Availability

- GPSTab offers API access for enterprise customers
- Contact their sales team for API documentation
- Typical endpoints include:
    - Real-time vehicle location
    - Historical route data
    - Geofence alerts
    - Driver behavior data

### Integration Considerations

- May require hardware installation in vehicles
- Subscription-based pricing
- More reliable than browser-based tracking
- Works without user interaction

### Browser Geolocation vs GPSTab

| Feature     | Browser Geolocation    | GPSTab             |
| ----------- | ---------------------- | ------------------ |
| Cost        | Free                   | Subscription       |
| Hardware    | Uses existing iPad     | May need device    |
| Accuracy    | Variable (5-50m)       | Typically <5m      |
| Reliability | Depends on browser/GPS | Dedicated hardware |
| Battery     | Can drain device       | Purpose-built      |
| User Action | Requires approval      | Automatic          |

## Conclusion

Browser-based geolocation can work for basic tracking but has limitations:

- Requires user permission each session
- Accuracy varies by device and conditions
- Battery drain on tablets
- May lose tracking if browser closes

For production vehicle tracking, GPSTab or similar dedicated solutions may be more reliable.
