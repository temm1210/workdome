import { createFileRoute } from "@tanstack/react-router";

import { InboxPage } from "@/pages/inbox/inbox-page";

export const Route = createFileRoute("/")({
  component: InboxPage,
});
