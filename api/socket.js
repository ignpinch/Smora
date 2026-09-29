import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  path: "/api/socket",

  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },

  transports: ["websocket", "polling"],
});

/*
  Temporary in-memory room storage.

  Example:

  rooms = {
    ABC123: Set(socket1, socket2)
  }

  Maximum: 2 users per room.
*/

const rooms = new Map();

/* ========================================
   GET / CREATE ROOM
======================================== */

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  return rooms.get(roomId);
}

/* ========================================
   REMOVE USER FROM ROOM
======================================== */

function leaveRoom(socket) {
  const roomId = socket.data.roomId;

  if (!roomId) {
    return;
  }

  const room = rooms.get(roomId);

  if (!room) {
    socket.data.roomId = null;
    return;
  }

  room.delete(socket.id);

  socket.leave(roomId);

  socket.data.roomId = null;

  console.log(
    `User ${socket.id} left room ${roomId}`
  );

  /*
    Delete completely empty rooms.
  */

  if (room.size === 0) {
    rooms.delete(roomId);

    console.log(
      `Room ${roomId} deleted`
    );

    return;
  }

  /*
    Tell remaining user that partner left.
  */

  socket.to(roomId).emit("peer-left");

  /*
    Update participant count.
  */

  io.to(roomId).emit("participant-count", {
    count: room.size,
  });
}

/* ========================================
   SOCKET CONNECTION
======================================== */

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  /* ======================================
     JOIN ROOM
  ====================================== */

  socket.on(
    "join-room",
    ({ roomId }) => {
      if (!roomId) {
        socket.emit("room-error", {
          message: "Room ID is required.",
        });

        return;
      }

      /*
        Make sure this socket isn't already
        inside another room.
      */

      if (socket.data.roomId) {
        leaveRoom(socket);
      }

      const room = getRoom(roomId);

      /*
        Only host + partner allowed.
      */

      if (room.size >= 2) {
        socket.emit("room-full", {
          roomId,
        });

        return;
      }

      /*
        Join Socket.IO room.
      */

      room.add(socket.id);

      socket.join(roomId);

      socket.data.roomId = roomId;

      console.log(
        `${socket.id} joined room ${roomId}`
      );

      /*
        Tell this specific user
        they successfully joined.
      */

      socket.emit("room-joined", {
        roomId,
        socketId: socket.id,
        count: room.size,
      });

      /*
        Tell everyone the new room count.
      */

      io.to(roomId).emit(
        "participant-count",
        {
          count: room.size,
        }
      );

      /*
        When second person joins:

        Notify the first person.

        The first person will create
        the WebRTC offer.
      */

      if (room.size === 2) {
        socket
          .to(roomId)
          .emit("peer-joined", {
            socketId: socket.id,
          });
      }
    }
  );

  /* ======================================
     WEBRTC SIGNALING
  ====================================== */

  socket.on(
    "signal",
    ({ roomId, data }) => {
      if (!roomId || !data) {
        return;
      }

      /*
        Forward WebRTC information
        to the other person.

        data can contain:

        - offer
        - answer
        - ICE candidate
      */

      socket
        .to(roomId)
        .emit("signal", data);
    }
  );

  /* ======================================
     FUTURE CURSOR SYNC
  ====================================== */

  socket.on(
    "cursor-move",
    ({ roomId, x, y }) => {
      if (!roomId) {
        return;
      }

      socket
        .to(roomId)
        .emit("cursor-move", {
          socketId: socket.id,
          x,
          y,
        });
    }
  );

  /* ======================================
     FUTURE FRAME SELECTION SYNC
  ====================================== */

  socket.on(
    "frame-selected",
    ({ roomId, frame }) => {
      if (!roomId) {
        return;
      }

      socket
        .to(roomId)
        .emit("frame-selected", {
          frame,
        });
    }
  );

  /* ======================================
     FUTURE FILTER SYNC
  ====================================== */

  socket.on(
    "filter-selected",
    ({ roomId, filter }) => {
      if (!roomId) {
        return;
      }

      socket
        .to(roomId)
        .emit("filter-selected", {
          filter,
        });
    }
  );

  /* ======================================
     FUTURE COUNTDOWN SYNC
  ====================================== */

  socket.on(
    "start-countdown",
    ({ roomId }) => {
      if (!roomId) {
        return;
      }

      io.to(roomId).emit(
        "start-countdown"
      );
    }
  );

  /* ======================================
     MANUAL LEAVE
  ====================================== */

  socket.on(
    "leave-room",
    ({ roomId }) => {
      if (
        socket.data.roomId !== roomId
      ) {
        return;
      }

      leaveRoom(socket);
    }
  );

  /* ======================================
     DISCONNECT
  ====================================== */

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );

    leaveRoom(socket);
  });
});

/* ========================================
   SIMPLE HTTP CHECK
======================================== */

app.get("/api/socket", (req, res) => {
  res.status(200).json({
    status: "ok",
    message:
      "SnapTogether realtime server is running.",
  });
});

/* ========================================
   EXPORT FOR VERCEL
======================================== */

export default server;