export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

export function createElement(tag, data = {}, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}