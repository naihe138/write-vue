import { nextTick } from './utils/nextTick'
let has = {}
let queue = []
// 调度
function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run()
  }
  queue = []
  has = []
}

let pending = false
// 异步执行所有的watcher
export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}