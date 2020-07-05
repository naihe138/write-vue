export function patch(oldVnode, newVnode) {
  const isReadElement = oldVnode.nodeType
  if (isReadElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    let el = creatElm(newVnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldVnode)
    return el
  }
}

function creatElm(vnode) {
  let { tag, children, key, data, text } = vnode
  if(typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      return vnode.el.appendChild(creatElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class'){
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}