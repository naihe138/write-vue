import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "../scheduler";

let id = 0;
class Watcher{
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    if (options) {
      this.lazy = !!options.lazy
    } else {
      this.lazy = false
    }
    this.cb = cb
    this.options = options
    this.dirty = this.lazy
    this.id = id++
    this.deps = []
    this.depsId = new Set()
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
    this.get()
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
}

export default Watcher