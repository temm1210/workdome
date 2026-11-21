import { sendEventsToClient } from "@workdome/server";

process.parentPort.on("message", (event) => {
  const [port] = event.ports;
  if (!port) return;
  // Electron ports emit close only after start()
  port.start();
  sendEventsToClient(port).catch((error: unknown) => {
    console.error("Failed to send events to the client", error);
  });
});
