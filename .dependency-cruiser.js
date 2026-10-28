/** @type {import("dependency-cruiser").IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-circular-folder",
      severity: "error",
      scope: "folder",
      from: {},
      to: { circular: true },
    },
    {
      // Engine stays HTTP-agnostic (no Fastify/tRPC, no imports from the rest of server)
      name: "framework-agnostic",
      severity: "error",
      from: { path: "^packages/server/src/engine/" },
      to: {
        path: [
          "^packages/server/src/(?!engine/)",
          "node_modules/(fastify|@fastify|@trpc)/",
        ],
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "^packages/[^/]+/dist/" },
    tsPreCompilationDeps: true,
  },
};
