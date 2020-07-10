import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './globalAPI';

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


export default Vue
