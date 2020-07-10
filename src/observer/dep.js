// 依赖收集
let id = 0
class Dep{
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this) // 让watcher,去存放dep
    }
  }
  notify() {
    // 触发更新
    this.subs.forEach(watcher => watcher.update())
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}

let stack = []
// push当前watcher到stack 中，并记录当前watcer
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
// 运行完之后清空当前的watcher
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
