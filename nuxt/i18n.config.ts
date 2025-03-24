/**
 * Vue I18n Configuration
 *
 * This file configures the Vue I18n integration for internationalization.
 * - legacy: false - Uses Vue I18n Composition API instead of legacy API
 * - Locale messages are loaded from the i18n/locales directory
 * - Default locale and available locales are configured in nuxt.config.ts
 */
export default defineI18nConfig(() => ({
  legacy: false, // Use Vue I18n Composition API
}));
