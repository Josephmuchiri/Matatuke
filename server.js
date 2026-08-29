const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.send('MatatuLive KE Backend is running successfully!');
});

// Real-time WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for Tout fare or status updates and broadcast to all connected users
    socket.on('update_vehicle_status', (data) => {
        console.log("Vehicle update received:", data);
        // Broadcast the live update to commuters and owners
        io.emit('live_radar_update', data);
    });

    // Listen for ride searches or general tracking events
    socket.on('search_rides', (criteria) => {
        console.log("Ride search query:", criteria);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`MatatuLive backend server is live and listening on port ${PORT}`);
});
