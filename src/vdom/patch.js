
export function patch(oldVnode, newVnode) {
  // 如果是第一次渲染
  if (oldVnode.nodeType && oldVnode) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    let el = createElm(newVnode)
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
  return newVnode.el
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

  let map = makeIndexByKey(oldChildren)

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode){ // 在比对过程中，可能出现空值情况则直接跳过
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if(!oldEndVnode){
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 优化向后追加逻辑
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 优化向前追加逻辑
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      path(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode, oldEndVnode.el.nextSibling)
      oldStartVnode = oldVnode[++oldStartIndex]
      newEndVnode = newVnode[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)){
      path(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldVnode[--oldEndIndex]
      newStartVnode = newVnode[++newStartIndex]
    } else { // 暴力对比
      let moveIndex = map[newStartVnode.key];
      if (moveIndex == undefined) { // 老的中没有将新元素插入
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else { // 有的话做移动操作
        let moveVnode = oldChildren[moveIndex]; 
        oldChildren[moveIndex] = undefined;
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
        patch(moveVnode, newStartVnode);
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  // 如果有剩余则直接删除
  if(oldStartIndex <= oldEndIndex){
    for(let i = oldStartIndex; i<=oldEndIndex;i++){
      let child = oldChildren[i];
      if(child != undefined){
        parent.removeChild(child.el)
      }
    }
  }
  // 如果有剩余的直接添加
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

function makeIndexByKey(children) {
  let map = {}
  children.forEach((item, index) => {
    map[item.key] = index
  })
  return map
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