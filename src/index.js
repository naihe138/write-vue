import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './globalAPI';

function Vue(options) {
  this._init(options)
}

initGlobalAPI(Vue)
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)


export default Vue
