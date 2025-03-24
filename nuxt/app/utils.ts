import type { Ref } from "vue";

export function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
  ref.value =
    typeof updaterOrValue === "function"
      ? (updaterOrValue as (old: T) => T)(ref.value)
      : updaterOrValue;
}
