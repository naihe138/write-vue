import { createTextNode, createElement } from './vdom/create-element'

export function renderMixin(Vue) {
  // 创建文本
  Vue.prototype._v = function(text) {
    return createTextNode(text)
  }
  // 创建元素
  Vue.prototype._c = function () {
    return createElement(...arguments)
  }

  // 拿到数据
  Vue.prototype._s = function (val) {
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }
  // 挂载render函数
  Vue.prototype._render = function() {
    const vm = this
    const { render } = this.$options
    let vnode = render.call(vm)
    return vnode
  }
}