import { arrayMethods } from './array'
import { hasOwn } from '../utils/index' 
import Dep from './dep'
class Observer{
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })
    this.dep = new Dep(); // 专门为数组设计的
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
  let childOb = observe(value);
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) { // 如果取值时有watcher
        dep.depend() // 让watcher保存dep，并且让dep 保存watcher
        if(childOb){ 
          childOb.dep.depend(); // 收集数组依赖
          if(Array.isArray(value)){ // 如果内部还是数组
            dependArray(value);// 不停的进行依赖收集
          }
        }
      }
      return value
    },
    set(newValue) {
      if (newValue == value) return
      observe(newValue)
      value = newValue
      dep.notify() // 通知渲染watcher去更新
    }
  })
}
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i];
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
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