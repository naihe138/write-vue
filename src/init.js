import { initState, createWatcher } from './state'
import { compileToFunctions } from './compile/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils/mergeOptions'
import { isPlainObject } from './utils/index'
import Watcher from './observer/watcher'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    callHook(vm, 'berforCreate')
    initState(vm)
    callHook(vm, 'created')
    if (vm.$options.el) {
      callHook(vm, 'beforeMount')
      vm.$mount(vm.$options.el)
      callHook(vm, 'mounted')
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el);
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }
    mountComponent(vm, el);
  }
  Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch(err) {
        console.error('options.immediate error')
      }
    }
  }
}