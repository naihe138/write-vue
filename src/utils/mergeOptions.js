export const LIFECYCLE_HOOKS = [
  'beforeCteate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
const strate = {}
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strate[hook] = mergeHook
})

strate.components = function (parentValue, childValue) {
  const res = Object.create(parentValue)
  if (childValue) {
    for (let key in childValue) {
      res[key] = childValue[key]
    }
  }
  return res
}

export function mergeOptions(parent, child) {
  const options = {}

  for (let key in parent) { // 循环老的 {}
    mergeField(key)
  }

  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (strate[key]) {
      options[key] = strate[key](parent[key], child[key])
    } else {
      if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
        options[key] = {
          ...parent[key],
          ...child[key]
        }
      } else {
        options[key] = child[key] || parent[key]; // 优先采用儿子，在采用父亲
      }
    }
  }
  return options
}