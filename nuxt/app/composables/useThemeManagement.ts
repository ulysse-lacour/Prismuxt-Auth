import { useThemeSettingsStore } from "~/stores/themeSettings";
import { useSession } from "~/utils/auth-client";
import type { ThemeSettings } from "@prisma/client";

import { useJsonToDate } from "./useJsonDateConverter";

/**
 * Theme Management Composable
 *
 * Provides a set of functions for managing theme settings, including:
 * - Fetching and updating theme settings
 *
 * This composable integrates with the theme settings store to keep UI state
 * in sync with server-side changes.
 *
 * @returns Object containing theme management functions
 */
export function useThemeManagement() {
  const themeStore = useThemeSettingsStore();
  const { processData } = useJsonToDate();

  /**
   * Fetches the current user's theme settings
   *
   * @returns Object containing the fetched theme settings
   */
  const fetchThemeSettings = async () => {
    try {
      // Get the current session to ensure we're authenticated
      const { data: session } = await useSession(useFetch);

      // Only fetch if we have an authenticated session
      if (session.value) {
        const settings = await $fetch(`/api/theme-settings`);

        if (settings) {
          themeStore.setSettings(processData(settings));
          themeStore.applyThemeSettings();
        }

        return { settings };
      } else {
        // Return empty settings if not authenticated
        return { settings: null };
      }
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      return { settings: null };
    }
  };

  /**
   * Creates or updates theme settings
   *
   * @param data - Theme settings data
   * @returns Object containing the created/updated theme settings
   */
  const saveThemeSettings = async (data: Partial<ThemeSettings>) => {
    try {
      // Get the current session to ensure we're authenticated
      const { data: session } = await useSession(useFetch);

      // Only save if we have an authenticated session
      if (session.value) {
        const settings = await $fetch(`/api/theme-settings`, {
          method: "PUT",
          body: data,
        });

        if (settings) {
          themeStore.setSettings(processData(settings));
          themeStore.applyThemeSettings();
        }

        return { settings };
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error("Error saving theme settings:", error);
      throw error;
    }
  };

  return {
    fetchThemeSettings,
    saveThemeSettings,
  };
}
