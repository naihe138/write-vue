export function patch(oldVnode, newVnode) {
  // 如果是第一次渲染
  if (!newVnode && oldVnode) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    let el = creatElm(newVnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldVnode)
    return el
  } else if(oldVnode.tag !== newVnode.tag){  // 如果标签不一致说明是两个不同元素
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  } else if (!oldVnode.tag) { // 如果标签一致但是不存在则是文本节点
    if(oldVnode.text !== newVnode.text){
    	oldVnode.el.textContent = newVnode.text;
    }
  } else {
    let el = newVnode.el = oldVnode.el;
    const oldChildren = oldVnode.children || []
    const newChildren = newVnode.children || []
    const oLen = oldChildren.length
    const nLen = newChildren.length

    updateProperties(newVnode, oldVnode.data);
    // 新老都有儿子，则需要对比儿子
    if (oLen > 0 && nLen > 0) {
      updateChildrens(oldChildren, newChildren, el)
    } else if (oLen > 0 && nLen === 0) { // 老的有儿子，新的没有儿子，则直接清空
      el.innerHTML = ''
    } else if (oLen === 0 && nLen > 0) { // 老得没有儿子，新的有儿子
      const fragment = document.createDocumentFragment()
      for (let i = 0; i < nLen; i++) {
        fragment.appendChild(createElm(newChildren[i]))
      }
      el.appendChild(fragment)
    }
  }
}

function updateChildrens(oldChildren, newChildren, parent) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) { // 优化向后追加逻辑
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 优化向前追加逻辑
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createElm(newChildren[i]), ele);
    }
  }
}


function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

export function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  if(typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {};
  let el = vnode.el;
  // 比对样式
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for(let key in oldStyle){
    if(!newStyle[key]){
      el.style[key] = ''
    }
  }
  // 删除多余属性
  for(let key in oldProps){
    if(!newProps[key]){
      el.removeAttribute(key);
    }
  }
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}