export function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
  ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
}
