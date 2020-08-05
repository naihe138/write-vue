import { initState, createWatcher } from './state'
import { compileToFunction } from './compile/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils/mergeOptions'
import { isPlainObject } from './utils/index'
import Watcher from './observer/watcher'

// 初始化函数
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // 合并全局对象到和配置对象到vm.$options中
    vm.$options = mergeOptions(vm.constructor.options, options)
    // 执行berforCreate 生命钩子函数
    callHook(vm, 'berforCreate')
    // 初始化数据
    initState(vm)
    // 执行created 生命钩子函数
    callHook(vm, 'created')
    if (vm.$options.el) {
      // 执行beforeMount生命钩子函数
      callHook(vm, 'beforeMount')
      // 执行组件挂载
      vm.$mount(vm.$options.el)
      // 执行mounted生命钩子函数
      callHook(vm, 'mounted')
    }
  }
  // 挂载方法
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el);
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      // 解析template成，返回renderh函数
      const render = compileToFunction(template)
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