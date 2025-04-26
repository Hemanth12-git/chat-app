const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

class SocketServer {
  static io;
  static userSocketMap = {};
  static app = express();
  static server = http.createServer(SocketServer.app);

  static initialize() {
    SocketServer.io = new Server(SocketServer.server, {
      cors: {
        origin: ["http://localhost:5173"],
      },
    });

    SocketServer.io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;
      if (userId) SocketServer.userSocketMap[userId] = socket.id;

      SocketServer.io.emit("getOnlineUsers", Object.keys(SocketServer.userSocketMap));

      socket.on("disconnect", () => {
        delete SocketServer.userSocketMap[userId];
        SocketServer.io.emit("getOnlineUsers", Object.keys(SocketServer.userSocketMap));
      });
    });
  }

  static getReceiverSocketId(userId) {
    return SocketServer.userSocketMap[userId];
  }

  static getIoInstance() {
    return SocketServer.io;
  }
}

module.exports = {
  app: SocketServer.app,
  server: SocketServer.server,
  getReceiverSocketId: SocketServer.getReceiverSocketId,
  getIoInstance: SocketServer.getIoInstance,
  SocketServer,
};
