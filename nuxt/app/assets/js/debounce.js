/**
 * Creates a debounced version of a function that delays its execution until after a specified wait time has elapsed since its last invocation.
 *
 * This function returns a new function which, when called repeatedly, clears the previous timeout and sets a new one. The original function is executed with the last provided context and arguments after the delay.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds before {@link func} is executed.
 * @returns {Function} A debounced version of {@link func}.
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
