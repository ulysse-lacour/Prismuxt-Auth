// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  future: {
    compatibilityVersion: 4,
  },

  srcDir: "app",

  serverDir: "server",

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      nuxtUrl: process.env.NUXT_URL,
    },
  },

  modules: [
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    [
      "@pinia/nuxt",
      {
        // Auto-import pinia main functions
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@nuxt/image",
    "@nuxtjs/seo",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-security",
    "nuxt-nodemailer",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
  ],

  // Components configuration - https://nuxt.com/docs/guide/directory-structure/components
  components: [
    {
      path: "@/components",
      pathPrefix: false,
    },
  ],

  eslint: {
    config: {
      stylistic: false,
    },
  },

  i18n: {
    vueI18n: "./i18n.config.ts",

    strategy: "no_prefix",

    baseUrl: process.env.NUXT_URL,

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },

    langDir: "../i18n/locales",

    lazy: true,

    // Available locales
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        dir: "ltr",
        file: "en.ts",
      },
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        dir: "ltr",
        file: "fr.ts",
      },
      {
        code: "de",
        iso: "de-DE",
        name: "Deutsch",
        dir: "ltr",
        file: "de.ts",
      },
    ],
    defaultLocale: "en",
    defaultDirection: "ltr",

    // Custom route translations
    // customRoutes: "config",
    // pages: {
    //   "project/[slug]": {
    //     fr: "/projet/[slug]",
    //     en: "/project/[slug]",
    //   },
    // },
  },

  // Nuxt Security - https://nuxt-security.vercel.app/
  security: {
    headers: {
      contentSecurityPolicy: {
        "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https:"],
      },
    },
  },

  // Nuxt SEO - https://nuxtseo.com/nuxt-seo/getting-started/what-is-nuxt-seo
  site: {
    url: process.env.NUXT_URL || "http://localhost:3003",
  },

  // Og Image - https://nuxtseo.com/docs/og-image/getting-started/introduction
  ogImage: { enabled: false },

  // Link checker - https://nuxtseo.com/link-checker/guides/build-scans
  linkChecker: {
    failOnError: true,
    report: {
      html: true,
      markdown: true,
    },
  },

  // Shadcn - https://www.shadcn-vue.com/
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },

  css: ["@/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: {
    classSuffix: "",
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if no system preference found
    storage: "localStorage",
  },

  nodemailer: {
    from: `"Support" <${process.env.NUXT_MAIL_USERNAME}>`,
    host: "smtp.ionos.de",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NUXT_MAIL_USERNAME,
      pass: process.env.NUXT_MAIL_PASSWORD,
    },
  },

  // To prevent "Uncaught (in promise) ReferenceError: exports is not defined" errors
  build: {
    transpile: ["vee-validate"],
  },
});
