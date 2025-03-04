// Inspired of https://blog.logrocket.com/debounce-throttle-vue/

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
