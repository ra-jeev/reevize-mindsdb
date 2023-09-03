// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxthq/ui", "nuxt-vuefire"],
  vuefire: {
    auth: { enabled: true, sessionCookie: true },
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      appId: process.env.APP_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
    },
  },
  runtimeConfig: {
    public: {
      extractTextUrl: process.env.EXTRACT_TEXT_URL,
    },
  },
});
