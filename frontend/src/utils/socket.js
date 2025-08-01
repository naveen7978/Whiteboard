import { io } from "socket.io-client";

// Singleton socket instance
let socketInstance = null;

export const getSocket = () => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const token = localStorage.getItem("whiteboard_user_token") || "";

  socketInstance = io(process.env.REACT_APP_API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    transports: ["websocket"],
    query: { token }, // Send token as query parameter
  });

  // Debugging events
  socketInstance.on("connect", () => {
    console.log("Socket connected:", socketInstance.id);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      // Reconnect manually
      socketInstance.connect();
    }
  });

  socketInstance.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socketInstance;
};

// Export the singleton instance
const socket = getSocket();
export default socket;
