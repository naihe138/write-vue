let callbacks = []
function flushCallback() {
  callbacks.forEach(cb => cb())
}
let timerFunc = () => {
  Promise.resolve().then(flushCallback)
}
export function nextTick(cb) {
  callbacks.push(cb)
  timerFunc()
}
