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
    this.getter()
  }
  get() {
    this.getter()
  }
}

export default Watcher