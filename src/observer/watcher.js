import { pushTarget, popTarget } from "./dep";

let id = 0;
class Watcher{
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    this.get()
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
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update(){
    this.get();
  }
}

export default Watcher