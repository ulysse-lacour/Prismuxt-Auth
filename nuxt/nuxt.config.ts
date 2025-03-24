// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Set compatibility date for Nuxt features
  compatibilityDate: "2024-04-03",

  // Configure future compatibility options
  future: {
    compatibilityVersion: 4,
  },

  // Set the source directory for the application
  srcDir: "app",

  // Set the server directory for API routes
  serverDir: "server",

  // Enable Nuxt DevTools for development
  devtools: { enabled: true },

  // Runtime configuration accessible in both server and client
  runtimeConfig: {
    public: {
      nuxtUrl: process.env.NUXT_URL,
    },
  },

  // Nuxt modules configuration
  modules: [
    "@nuxt/eslint", // ESLint integration
    "@vueuse/nuxt", // VueUse composables
    "@nuxtjs/i18n", // Internationalization
    [
      "@pinia/nuxt",
      {
        // Auto-import Pinia's core functions for state management
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@nuxt/image", // Image optimization
    "@nuxtjs/seo", // SEO optimization
    "@nuxt/icon", // Icon system
    "@nuxt/fonts", // Font optimization
    "@nuxtjs/tailwindcss", // Tailwind CSS integration
    "@nuxtjs/color-mode", // Dark/light mode support
    "shadcn-nuxt", // Shadcn UI components
    "nuxt-security", // Security headers and protections
    "nuxt-nodemailer", // Email sending capabilities
    "@nuxt/test-utils/module", // Testing utilities
    "nuxt-color-picker", // Color picker
  ],

  // Components configuration - https://nuxt.com/docs/guide/directory-structure/components
  // Auto-imports components from the components directory
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
    vueI18n: "../i18n.config.ts",

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
