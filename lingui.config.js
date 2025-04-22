import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "es"],
  catalogs: [
    {
      path: "locales/{locale}/messages",
      include: ["app"],
    },
  ],
  format: "po",
});
