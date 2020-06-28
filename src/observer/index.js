class Observer{
  constructor(value) {
    this.walk(value)
  }
  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
}
function defineReactive(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue == value) return
      observe(newValue)
      value = newValue
    }
  })
}
export function observe(data) {
  if (typeof data !== 'object' && data != null) {
    return;
  }
  return new Observer(data)
}