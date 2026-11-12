import { startServer } from "@workdome/server";

export type ServerProcessMessage = { url: string };

const url = await startServer({ port: 4310 });
process.parentPort.postMessage({ url } satisfies ServerProcessMessage);
