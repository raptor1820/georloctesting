import "./globals.css";

export const metadata = {
    title: "Live Location Tracker",
    description: "Track location using Geolocation API",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
