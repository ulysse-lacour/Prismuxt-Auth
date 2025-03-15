/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified wait time has elapsed since its last invocation.
 *
 * Useful for handling events that fire rapidly (like resize, scroll, input),
 * where you want to limit the rate at which a function is executed.
 *
 * @example
 * // Debounce a search input to avoid making API calls on every keystroke
 * const debouncedSearch = debounce((query) => {
 *   fetchSearchResults(query);
 * }, 300);
 *
 * // Usage
 * searchInput.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds before executing the function
 * @returns {Function} A debounced version of the original function
 */

function debounce(func, wait) {
  let timeoutId = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export default debounce;
