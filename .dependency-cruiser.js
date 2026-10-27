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
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "/dist/" },
    tsPreCompilationDeps: true,
  },
};
