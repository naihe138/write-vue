import { observe } from './observer/index' 
import { bind, noop, isPlainObject } from './utils/index'
import Watcher from './observer/watcher';
import Dep from './observer/dep';
// 初始化所有配置
export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {}

function initMethod(vm) {
  let methods = vm.$options.methods;
  for (const key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      return vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm, vm)
    : data || {};
  // 数据代理
  let keys = Object.keys(data);
  let i = keys.length;
  while(i--) {
    proxy(vm, '_data', keys[i]);
  }
  observe(data);
}

function initComputed(vm) {
  const computed = vm.$options.computed
  const watchers = vm._computedWatchers = Object.create(null)
  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter, noop, { lazy: true })
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

function defineComputed(vm, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
  } else {
    sharedPropertyDefinition.get = userDef.get
  }
  Object.defineProperty(vm, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {// 给computed的属性添加订阅watchers
        watcher.evaluate()
      }
      // 把渲染watcher 添加到属性的订阅里面去，这很关键
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch
  for (let key in watch) {
    const handler = watch[key]
    createWatcher(vm, key, handler)
  }
}

export function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}

