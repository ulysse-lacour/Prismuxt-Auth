import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names into a single string.
 *
 * Combines the provided class values using `clsx` for conditional class rules, then resolves any conflicting Tailwind CSS classes with `twMerge`.
 *
 * @param inputs - One or more class values to merge.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Updates a Vue ref's value using either an updater function or a direct assignment.
 *
 * If the provided value is a function, it is invoked with the current ref value and its return value is assigned to the ref. Otherwise, the value is directly assigned to the ref.
 *
 * @param updaterOrValue - A function that takes the current ref value and returns an updated value, or a new value to assign directly.
 * @param ref - The Vue ref object whose value will be updated.
 */
export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}
