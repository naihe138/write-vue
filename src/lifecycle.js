import Watcher from './observer/watcher';
import { patch } from './vdom/patch'
// 更新操作
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    const prevVnode = vm._vnode; // 保留上一次的vnode
    vm._vnode = vnode;
    if(!prevVnode){
      // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
      // 我要通过虚拟节点 渲染出真实的dom     
      vm.$el = patch(vm.$el, vnode);
    }else{
      vm.$el = patch(prevVnode, vnode); // 更新时做diff操作
    }
  }
}
// 挂载组件
export function mountComponent(vm, el) {
  vm.$el = el
  let updateComponent = () => {
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => {}, true)
}
// 调用生命周期函数
export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}
