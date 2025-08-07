export function throttle(func, delay, alert = null) {
  let lastCallTime = 0

  return function (...args) {
    const now = Date.now()
    if (now - lastCallTime >= delay) {
      func.apply(this, args)
      lastCallTime = now
    } else {
      if (alert) {
        alert()
      }
    }
  }
}
