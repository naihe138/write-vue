let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].apply(this, args);
    const ob = this.__ob__;
    let inserted = null;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default: 
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  }
})