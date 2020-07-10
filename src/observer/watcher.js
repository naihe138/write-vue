import { pushTarget, popTarget } from './dep'
import { queueWatcher } from '../scheduler'
import { parsePath } from '../utils/index'

let id = 0;
// 渲染watcher  computer user wather
class Watcher{
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = parsePath(exprOrFn) // user watcher 
    }
    if (options) {
      this.lazy = !!options.lazy // 为computed 设计的
      this.user = !!options.user // 为user wather设计的
    } else {
      this.user = this.lazy = false
    }
    this.cb = cb
    this.options = options
    this.dirty = this.lazy
    this.id = id++
    this.deps = []
    this.depsId = new Set() // dep 已经收集过相同的watcher 就不要重复收集了
    this.value = this.lazy ? undefined : this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this);
    }
  }
  get() {
    const vm = this.vm
    pushTarget(this)
    // 执行函数
    let value = this.getter.call(vm, vm)
    popTarget()
    return value
  }
  update(){
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run () {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    // 执行cb
    if (this.user) {
      try{
        this.cb.call(this.vm, value, oldValue)
      } catch(error) {
        console.error(error)
      }
    } else {
      this.cb && this.cb.call(this.vm, oldValue, value)
    }
  }
  // 执行get，并且 this.dirty = false
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  // 所有的属性收集当前的watcer
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
}

export default Watcher