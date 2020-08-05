export function patch(oldVnode, newVnode) {
  console.log(oldVnode, newVnode)
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
    let el = vnode.el = oldVnode.el;
    updateProperties(newVnode, oldVnode.data);
  }
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