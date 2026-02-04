const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Main route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Open this URL in your browser to start tracking");
    console.log("");
    console.log("To expose via Dev Tunnels:");
    console.log("1. In VS Code, open Command Palette (Ctrl+Shift+P)");
    console.log('2. Run "Forward a Port"');
    console.log(`3. Enter port ${PORT}`);
    console.log('4. Set visibility to "Public" for mobile testing');
});
