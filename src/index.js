import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './globalAPI';

//-----------分割线 以下是测试代码

import { compileToFunction } from './compile/index'
import { patch, createElm } from './vdom/patch'

//-----------分割线 以上是测试代码

function Vue(options) {
  // 执行初始化函数，并把参数传递进去
  this._init(options)
}
// 初始化全局api,和全局的koptions
initGlobalAPI(Vue)
// 初始化Mixin
initMixin(Vue)
// 初始化生命周期
lifecycleMixin(Vue)
// 初始化渲染方法
renderMixin(Vue)

//-----------分割线 以下是测试代码

// 1.创建第一个虚拟节点
let vm1 = new Vue({
  data: {
    name: 'aa'
  }
})
let render1 = compileToFunction('<div>{{name}}</div>')
let oldVnode = render1.call(vm1)


// 2.创建第二个虚拟节点
let vm2 = new Vue({
  data:{
    name:'bb'
  }
});
let render2 = compileToFunction('<p>{{name}}</p>');
let newVnode = render2.call(vm2);
// 3.通过第一个虚拟节点做首次渲染
let el = createElm(oldVnode)
document.body.appendChild(el);

// 4.调用patch方法进行对比操作
patch(oldVnode, newVnode);

export default Vue
