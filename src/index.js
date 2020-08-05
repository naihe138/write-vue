import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './globalAPI';

//-----------分割线 以下是测试代码

// import { compileToFunction } from './compile/index'
// import { patch, createElm } from './vdom/patch'

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


// let vm1 = new Vue({
//   data: {
//     name: 'aa'
//   }
// })
// let render1 = compileToFunction(`
//   <div>
//     <p key="A">A</p>
//     <p key="B">B</p>
//     <p key="C">C</p>
//   </div>`
// )
// let oldVnode = render1.call(vm1)

// let vm2 = new Vue({
//   data:{
//     name:'bb'
//   }
// });
// let render2 = compileToFunction(`
//   <div>
//     <p key="A">A</p>
//     <p key="B">B</p>
//     <p key="C">C</p>
//     <p key="D">D</p>
//   </div>`
// )
// let newVnode = render2.call(vm1)
// let el = createElm(oldVnode)
// document.body.appendChild(el);

// patch(oldVnode, newVnode);

//-----------分割线 以上是测试代码

export default Vue
