import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Updater } from "@tanstack/vue-table";
import type { ClassValue } from "clsx";
import type { Ref } from "vue";

/**
 * Merges class names with Tailwind CSS conflict resolution
 *
 * Combines multiple class values using `clsx` for conditional class rules,
 * then resolves any conflicting Tailwind CSS classes with `twMerge`.
 * This is particularly useful for component styling with conditional classes.
 *
 * @param inputs - One or more class values to merge
 * @returns A string of merged and optimized class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Updates a Vue ref value using either an updater function or direct value
 *
 * This utility simplifies updating ref values in a functional way.
 * If the provided value is a function, it is invoked with the current ref value
 * and its return value is assigned to the ref. Otherwise, the value is directly
 * assigned to the ref.
 *
 * @param updaterOrValue - A function that computes a new value based on the current one, or a direct value
 * @param ref - The Vue ref object to update
 */
export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
}
