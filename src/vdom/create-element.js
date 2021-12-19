export function createTextNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
const isReservedTag = (tag) => {
  return ['a', 'div', 'p', 'button', 'ul', 'li', 'span'].includes(tag)
}
export function createElement(vm, tag, data, ...children) {
  if (data == null) {
    data = {}
  }
  let key = data.key
  if (key) {
    delete data.key
  }
  
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, key, children);
  } else {
    // 创造一个组件的虚拟节点  (包含组件的构造函数)
    let Ctor = vm.$options.components[tag]; // 组件的构造函数
    // Ctor就是组件的定义 可能是一个Sub类 还有可能是组件的obj选项
    return createComponentVnode(vm, tag, data, key, children, Ctor);
  }

}

function createComponentVnode(vm, tag, data, key, children, Ctor) {
  if (typeof Ctor === 'object') {
    Ctor = vm.$options._base.extend(Ctor)
    // Ctor = Vue.extend(Ctor)
  }
  data.hook = {
    init(vnode) { // 稍后创造真实节点的时候 如果是组件则调用此init方法
      // 保存组件的实例到虚拟节点上
      let instance = vnode.componentInstance = new vnode.componentOptions.Ctor;
      instance.$mount(); // instance.$el
    }
  }
  return vnode(vm, tag, data, key, children, null, { Ctor })
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
