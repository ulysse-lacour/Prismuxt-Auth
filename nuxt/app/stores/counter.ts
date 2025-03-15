/**
 * Counter State Interface
 *
 * Defines the shape of the counter store state.
 */
export interface CounterState {
  count: number;
}

/**
 * Counter Store
 *
 * A simple counter store that demonstrates Pinia setup with the Composition API.
 * This store provides basic counter functionality (increment/decrement)
 * and serves as a template for more complex stores.
 */
export const useCounterStore = defineStore("counter", () => {
  // Internal reactive state
  const state = ref<CounterState>({
    count: 0,
  });

  // Computed property to access the count
  const count = computed(() => state.value.count);

  /**
   * Increments the counter by 1
   */
  const increment = () => {
    state.value.count += 1;
  };

  /**
   * Decrements the counter by 1
   */
  const decrement = () => {
    state.value.count -= 1;
  };

  // Expose state and methods
  return {
    count,
    increment,
    decrement,
  };
});
