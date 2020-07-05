let id = 0
class Dep{
  constructor() {
    this.id = id++
    this.sub = []
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this) // 让watcher,去存放dep
    }
  }
  notify() {
    this.sub.forEach(watcher => watcher.update())
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}

let stack = []

export function pushTarget(watch) {
  Dep.target = watch
  stack.push(watch)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
