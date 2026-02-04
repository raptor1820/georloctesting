"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function Home() {
    const [isTracking, setIsTracking] = useState(false);
    const [status, setStatus] = useState({
        type: "waiting",
        message: "Ready to start tracking",
    });
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        accuracy: null,
        speed: null,
    });
    const [lastUpdate, setLastUpdate] = useState(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [avgAccuracy, setAvgAccuracy] = useState(null);
    const [sessionStart, setSessionStart] = useState(null);
    const [duration, setDuration] = useState("0:00");
    const [history, setHistory] = useState([]);
    const [interval, setInterval] = useState(3000);
    const [apiStatus, setApiStatus] = useState(null);

    const watchIdRef = useRef(null);
    const intervalIdRef = useRef(null);
    const durationIntervalRef = useRef(null);
    const accuracySumRef = useRef(0);

    const sendToApi = async (lat, lng, accuracy) => {
        try {
            const res = await fetch("/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    accuracy,
                    timestamp: new Date().toISOString(),
                }),
            });
            const data = await res.json();
            setApiStatus({ success: true, message: `Saved: ${data.id}` });
        } catch (err) {
            setApiStatus({ success: false, message: "API error" });
        }
    };

    const handlePosition = useCallback(
        (position) => {
            const { latitude, longitude, accuracy, speed } = position.coords;
            const timestamp = new Date();

            setUpdateCount((prev) => prev + 1);
            accuracySumRef.current += accuracy;

            setLocation({ latitude, longitude, accuracy, speed });
            setLastUpdate(timestamp.toLocaleTimeString());
            setAvgAccuracy(accuracySumRef.current / (updateCount + 1));

            setHistory((prev) => {
                const newEntry = {
                    lat: latitude.toFixed(6),
                    lng: longitude.toFixed(6),
                    time: timestamp.toLocaleTimeString(),
                };
                return [newEntry, ...prev.slice(0, 49)];
            });

            setStatus({
                type: "active",
                message: `Tracking active - ${updateCount + 1} updates`,
            });

            // Send to API
            sendToApi(latitude, longitude, accuracy);

            console.log(
                `[${timestamp.toLocaleTimeString()}] Lat: ${latitude}, Lng: ${longitude}, Accuracy: ${accuracy}m`,
            );
        },
        [updateCount],
    );

    const handleError = useCallback((error) => {
        let message = "";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Location permission denied";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location unavailable";
                break;
            case error.TIMEOUT:
                message = "Request timed out";
                break;
            default:
                message = "Unknown error";
        }
        setStatus({ type: "error", message });
    }, []);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus({ type: "error", message: "Geolocation not supported" });
            return;
        }

        setIsTracking(true);
        setSessionStart(Date.now());
        setUpdateCount(0);
        accuracySumRef.current = 0;
        setHistory([]);
        setStatus({ type: "active", message: "Acquiring location..." });

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            handleError,
            options,
        );

        intervalIdRef.current = window.setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                handlePosition,
                handleError,
                options,
            );
        }, interval);
    }, [handlePosition, handleError, interval]);

    const stopTracking = useCallback(() => {
        setIsTracking(false);

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        setStatus({ type: "waiting", message: "Tracking stopped" });
    }, []);

    // Duration timer
    useEffect(() => {
        if (isTracking && sessionStart) {
            durationIntervalRef.current = window.setInterval(() => {
                const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                setDuration(
                    `${minutes}:${seconds.toString().padStart(2, "0")}`,
                );
            }, 1000);
        }

        return () => {
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
        };
    }, [isTracking, sessionStart]);

    const getAccuracyClass = (acc) => {
        if (acc < 10) return "high";
        if (acc < 50) return "medium";
        return "low";
    };

    const googleMapsUrl =
        location.latitude && location.longitude
            ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
            : null;

    return (
        <div className="container">
            <h1>📍 Live Location Tracker (Next.js)</h1>

            {/* Status Card */}
            <div className="card">
                <div className={`status ${status.type}`}>
                    <div className={`pulse ${status.type}`}></div>
                    <span>{status.message}</span>
                </div>

                <div className="settings">
                    <label>Update interval:</label>
                    <select
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        disabled={isTracking}>
                        <option value={1000}>1 second</option>
                        <option value={2000}>2 seconds</option>
                        <option value={3000}>3 seconds</option>
                        <option value={5000}>5 seconds</option>
                        <option value={10000}>10 seconds</option>
                    </select>
                </div>

                <button
                    className={isTracking ? "btn-stop" : "btn-start"}
                    onClick={isTracking ? stopTracking : startTracking}>
                    {isTracking ? "Stop Tracking" : "Start Tracking"}
                </button>

                {apiStatus && (
                    <div
                        className={`api-status ${apiStatus.success ? "success" : "error"}`}>
                        API: {apiStatus.message}
                    </div>
                )}
            </div>

            {/* Current Location Card */}
            <div className="card">
                <h2>📌 Current Location</h2>
                <div className="data-grid">
                    <div className="data-item">
                        <div className="data-label">Latitude</div>
                        <div className="data-value">
                            {location.latitude?.toFixed(6) ?? "--"}
                        </div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">Longitude</div>
                        <div className="data-value">
                            {location.longitude?.toFixed(6) ?? "--"}
                        </div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">Accuracy</div>
                        <div className="data-value">
                            {location.accuracy ? (
                                <>
                                    {location.accuracy.toFixed(1)}m
                                    <span
                                        className={`accuracy-indicator accuracy-${getAccuracyClass(location.accuracy)}`}>
                                        {getAccuracyClass(location.accuracy)}
                                    </span>
                                </>
                            ) : (
                                "--"
                            )}
                        </div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">Last Update</div>
                        <div className="data-value small">
                            {lastUpdate ?? "--"}
                        </div>
                    </div>
                    <div className="data-item full-width">
                        <div className="data-label">Speed</div>
                        <div className="data-value">
                            {location.speed !== null && !isNaN(location.speed)
                                ? `${(location.speed * 3.6).toFixed(1)} km/h`
                                : "Not available"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="card">
                <h2>📊 Session Stats</h2>
                <div className="data-grid">
                    <div className="data-item">
                        <div className="data-label">Updates Received</div>
                        <div className="data-value">{updateCount}</div>
                    </div>
                    <div className="data-item">
                        <div className="data-label">Session Duration</div>
                        <div className="data-value">{duration}</div>
                    </div>
                    <div className="data-item full-width">
                        <div className="data-label">Avg Accuracy</div>
                        <div className="data-value">
                            {avgAccuracy ? `${avgAccuracy.toFixed(1)}m` : "--"}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Card */}
            <div className="card">
                <h2>📜 Location History</h2>
                <div className="history">
                    {history.length === 0 ? (
                        <div
                            className="history-item"
                            style={{ justifyContent: "center", color: "#666" }}>
                            No location updates yet
                        </div>
                    ) : (
                        history.map((h, i) => (
                            <div key={i} className="history-item">
                                <span className="history-time">{h.time}</span>
                                <span className="history-coords">
                                    {h.lat}, {h.lng}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Link Card */}
            <div className="card">
                <h2>🗺️ View on Map</h2>
                <div className="map-link">
                    {googleMapsUrl ? (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer">
                            Open in Google Maps
                            <small>
                                {location.latitude?.toFixed(6)},{" "}
                                {location.longitude?.toFixed(6)}
                            </small>
                        </a>
                    ) : (
                        <span style={{ color: "#666" }}>
                            Start tracking to get a map link
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
