import { arrayMethods } from './array'
import { hasOwn } from '../utils/index' 
class Observer{
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
  observeArray(value) {
    for (let i = 0, len = value.length; i < len; i++) {
      observe(value[i])
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
  // 如果被监听过就返回监听过的对象
  if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
    return data.__ob__
  } else {
    return new Observer(data)
  }
}