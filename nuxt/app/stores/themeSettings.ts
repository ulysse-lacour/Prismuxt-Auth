import { defineStore } from "pinia";
import type { ThemeSettings } from "@prisma/client";

/**
 * Theme Settings Store
 *
 * Manages the user's theme settings throughout the application.
 * This store maintains the theme settings and provides methods
 * to update them.
 */
export const useThemeSettingsStore = defineStore("themeSettingsStore", {
  state: () => ({
    settings: null as ThemeSettings | null,
  }),
  actions: {
    /**
     * Sets the theme settings
     * Used primarily after initial data fetch
     *
     * @param settings - Theme settings to set
     */
    setSettings(settings: ThemeSettings | null) {
      this.settings = settings;
    },

    /**
     * Updates the theme settings
     * Used after updating settings on the server
     *
     * @param updatedSettings - Updated theme settings
     */
    updateSettings(updatedSettings: ThemeSettings) {
      this.settings = updatedSettings;
    },

    /**
     * Applies theme settings to the document
     * Sets CSS variables based on the current theme settings
     */
    applyThemeSettings() {
      if (!this.settings || typeof window === "undefined") return;

      const root = document.documentElement;

      if (this.settings.backgroundColor) {
        root.style.setProperty("--background-color", this.settings.backgroundColor);
      }

      if (this.settings.textColor) {
        root.style.setProperty("--text-color", this.settings.textColor);
      }

      if (this.settings.accentColor) {
        root.style.setProperty("--accent-color", this.settings.accentColor);
      }

      if (this.settings.secondaryColor) {
        root.style.setProperty("--secondary-color", this.settings.secondaryColor);
      }
    },
  },
});
