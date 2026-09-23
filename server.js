import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  return rooms.get(roomId);
}

function leaveCurrentRoom(socket) {
  const roomId = socket.data.roomId;

  if (!roomId) return;

  const room = rooms.get(roomId);

  if (!room) return;

  room.delete(socket.id);

  socket.leave(roomId);

  socket.data.roomId = null;

  if (room.size === 0) {
    rooms.delete(roomId);
  } else {
    io.to(roomId).emit("participant-count", {
      count: room.size,
    });

    socket.to(roomId).emit("peer-left");
  }
}

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;

    leaveCurrentRoom(socket);

    const room = getRoom(roomId);

    if (room.size >= 2) {
      socket.emit("room-full");

      return;
    }

    room.add(socket.id);

    socket.join(roomId);

    socket.data.roomId = roomId;

    console.log(
      `${socket.id} joined ${roomId}`
    );

    socket.emit("room-joined", {
      roomId,
      count: room.size,
    });

    io.to(roomId).emit("participant-count", {
      count: room.size,
    });

    if (room.size === 2) {
      socket
        .to(roomId)
        .emit("peer-joined");
    }
  });

  socket.on(
    "signal",
    ({ roomId, data }) => {
      if (!roomId || !data) return;

      socket
        .to(roomId)
        .emit("signal", data);
    }
  );

  socket.on(
    "leave-room",
    ({ roomId }) => {
      if (
        socket.data.roomId !== roomId
      ) {
        return;
      }

      leaveCurrentRoom(socket);
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );

    leaveCurrentRoom(socket);
  });
});

app.get("/", (req, res) => {
  res.send(
    "SnapTogether realtime server is running."
  );
});

const PORT =
  process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(
    `SnapTogether server running on port ${PORT}`
  );
});