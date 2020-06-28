import { observe } from './observer/index' 
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

function initMethod(vm) {}

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

function initComputed(vm) {}

function initWatch(vm) {}

