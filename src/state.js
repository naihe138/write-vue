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

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function'
   ? data.call(vm, vm)
   : data || {};
  // let keys = Object.keys(data);
  // let i = keys.length;
  observe(data);
}

function initComputed(vm) {}

function initWatch(vm) {}

