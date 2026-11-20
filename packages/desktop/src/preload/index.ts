import type { WorkdomeApi } from "@workdome/shared";
import { contextBridge, ipcRenderer } from "electron";

import { COLOR_MODE_CHOICE_CHANNEL } from "../shared/ipc-channels";

contextBridge.exposeInMainWorld("workdome", {
  setColorModeChoice(choice) {
    ipcRenderer.send(COLOR_MODE_CHOICE_CHANNEL, choice);
  },
} satisfies WorkdomeApi);
