# Live Location Tracker - Geolocation API Testing

A project for testing browser-based geolocation tracking to evaluate the feasibility of tracking vehicle locations using iPads for Able Alliance.

**Related Issue:** [GTBitsOfGood/able-alliance#3](https://github.com/GTBitsOfGood/able-alliance/issues/3)

## Project Structure

```
├── html-app/          # Simple Express + HTML implementation
└── nextjs-app/        # Next.js implementation with API
```

## Applications

### 1. HTML App (Simple Implementation)

A minimal Express server serving a static HTML page with geolocation tracking.

**Location:** `html-app/`

**Features:**

- Real-time location tracking using Geolocation API
- Configurable update intervals (1-10 seconds)
- Accuracy indicators (high/medium/low)
- Speed display in km/h
- Location history log (last 50 positions)
- Direct Google Maps integration
- Session statistics

**To run:**

```bash
cd html-app
bun install
bun start
```

Server runs at: http://localhost:3000

### 2. Next.js App (API Implementation)

A full-stack Next.js application with API routes for storing and retrieving location data.

**Location:** `nextjs-app/`

**Features:**

- All features from HTML app
- API endpoint for storing locations: `POST /api/location`
- API endpoint for retrieving locations: `GET /api/location`
- Automatic location data persistence
- In-memory storage (expandable to database)

**To run:**

```bash
cd nextjs-app
bun install
bun run dev
```

Server runs at: http://localhost:3000

## Testing on Mobile Devices

Both apps support testing on mobile devices (iPad, iPhone, tablets) using VS Code Dev Tunnels:

1. Start either app (see above)
2. Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Run **"Port: Forward a Port"**
4. Enter `3000`
5. Set visibility to **"Public"**
6. Copy the generated HTTPS URL
7. Open the URL on your mobile device

**Important:** Geolocation API requires HTTPS or localhost. Dev Tunnels automatically provide HTTPS, making them perfect for mobile testing.

## Field Testing Recommendations

When testing on vehicles (e.g., Stinger bus):

1. **Before boarding:**
    - Start tracking
    - Allow location permissions
    - Note initial accuracy values

2. **During movement:**
    - Monitor accuracy values (lower is better, <10m is excellent)
    - Check update frequency
    - Observe speed readings
    - Test in various conditions (urban, highway, indoor parking)

3. **What to monitor:**
    - GPS accuracy in different environments
    - Battery drain on iPad
    - Tracking consistency while moving
    - Signal quality indoors vs outdoors
    - Update reliability at various speeds

4. **Compare scenarios:**
    - Stationary vs moving
    - Urban (buildings) vs open areas
    - Indoor vs outdoor
    - Different times of day

## GPSTab Integration Research

[GPSTab](https://www.gpstab.com/) is a professional fleet tracking solution. Key findings:

### API Availability

- Offers API access for enterprise customers
- Requires contacting sales for API documentation
- Typical API endpoints:
    - Real-time vehicle location
    - Historical route data
    - Geofence alerts
    - Driver behavior analytics

### Integration Considerations

- May require dedicated hardware installation
- Subscription-based pricing model
- More reliable than browser-based tracking
- Works automatically without user interaction
- Purpose-built for fleet management

### Comparison: Browser Geolocation vs GPSTab

| Feature            | Browser Geolocation          | GPSTab                       |
| ------------------ | ---------------------------- | ---------------------------- |
| **Cost**           | Free (uses existing devices) | Subscription fee             |
| **Hardware**       | Uses iPad GPS                | May need dedicated device    |
| **Accuracy**       | Variable (5-50m typical)     | Consistent (<5m typical)     |
| **Reliability**    | Depends on browser/device    | Dedicated hardware           |
| **Battery Impact** | Can drain tablet battery     | Purpose-built, optimized     |
| **User Action**    | Requires permission prompt   | Fully automatic              |
| **Setup Time**     | Immediate                    | Hardware installation needed |
| **Maintenance**    | Software updates only        | Hardware + software          |
| **Data Ownership** | Full control                 | Vendor-dependent             |

### Browser-Based Limitations

1. **User Permission Required:** Users must approve location access each session
2. **Battery Drain:** Continuous tracking impacts device battery life
3. **Background Tracking:** Limited when browser is minimized or inactive
4. **Accuracy Variance:** Affected by device quality, environment, signal strength
5. **Internet Dependency:** Needs connection to send data to server
6. **Device Management:** Relies on users keeping app open

### GPSTab Advantages

1. **Always-On Tracking:** Works in background without user interaction
2. **Hardware Optimization:** Dedicated devices optimized for tracking
3. **Enterprise Features:** Geofencing, alerts, compliance reporting
4. **Historical Data:** Long-term storage and analytics
5. **Support:** Professional support and SLAs

## Recommendations

### For Testing/Proof-of-Concept

Use the browser-based solution:

- Quick setup
- No additional hardware costs
- Good for validating tracking accuracy
- Test if iPads' GPS is sufficient for needs

### For Production Deployment

Consider GPSTab or similar if:

- Automatic tracking needed (no user interaction)
- High reliability required
- Professional support needed
- Geofencing and alerts are important
- Long-term historical data needed

### Hybrid Approach

- Use browser-based for backup/verification
- Use GPSTab for primary tracking
- Provides redundancy and comparison data

## Technology Stack

- **Runtime:** Bun (compatible with Node.js)
- **HTML App:** Express.js
- **Next.js App:** Next.js 14 (App Router), React 18
- **Styling:** Vanilla CSS
- **APIs:** Browser Geolocation API

## Development

Both apps are configured to work with Bun, but also compatible with Node.js:

```bash
# Using Bun (recommended)
bun install
bun start

# Using Node.js
npm install
npm start
```

## License

MIT

## Contact

For questions about Able Alliance integration:

- GitHub Issue: [GTBitsOfGood/able-alliance#3](https://github.com/GTBitsOfGood/able-alliance/issues/3)
