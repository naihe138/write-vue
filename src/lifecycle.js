import Watcher from './observer/watcher';

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log(vnode)
  }
}

export function mountComponent(vm, el) {
  vm.$el = el
  let updateComponent = () => {
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => {}, true)
}
