import { NextResponse } from "next/server";

// In-memory storage for demo (would use a database in production)
const locations = [];

export async function POST(request) {
    try {
        const body = await request.json();
        const { latitude, longitude, accuracy, timestamp } = body;

        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: "Missing latitude or longitude" },
                { status: 400 },
            );
        }

        const locationEntry = {
            id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            latitude,
            longitude,
            accuracy,
            timestamp: timestamp || new Date().toISOString(),
            receivedAt: new Date().toISOString(),
        };

        locations.push(locationEntry);

        // Keep only last 1000 entries to prevent memory issues
        if (locations.length > 1000) {
            locations.shift();
        }

        console.log(
            `[Location Saved] ${locationEntry.id}: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`,
        );

        return NextResponse.json(locationEntry, { status: 201 });
    } catch (error) {
        console.error("Error saving location:", error);
        return NextResponse.json(
            { error: "Failed to save location" },
            { status: 500 },
        );
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const since = searchParams.get("since");

    let filteredLocations = [...locations];

    // Filter by timestamp if 'since' is provided
    if (since) {
        const sinceDate = new Date(since);
        filteredLocations = filteredLocations.filter(
            (loc) => new Date(loc.timestamp) > sinceDate,
        );
    }

    // Return most recent first, limited
    const result = filteredLocations.slice(-limit).reverse();

    return NextResponse.json({
        count: result.length,
        total: locations.length,
        locations: result,
    });
}
