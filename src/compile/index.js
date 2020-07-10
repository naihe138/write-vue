const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
let root, currentParent, stack = []

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}
// 开始< 符号处理
function start(tagName, attrs) {
  let element = createASTElement(tagName, attrs);
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}
// 结束> 符号处理
function end(tagName) {
  let element = stack.pop()
  currentParent = stack[stack.length - 1]
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}
// 空格和{{ }} 处理
function chars(text) {
  // text = text.replace(/\s/g, '')
  if (text && text.replace(/\s/g, '')) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text
    })
  }
}

function parseHTML(html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({ name: attr[1], value: attr[3] });
      }
      if (end) {
        advance(end[0].length);
        return match
      }
    }
  }
  // 截取字符串
  function advance(n) {
    html = html.substring(n)
  }
}

// 生成代码
function gen(node) {
  if (node.type == 1) {
    return generate(node);
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    let lastIndex = defaultTagRE.lastIndex = 0
    let tokens = [];
    let match, index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`;
  }
}

function getChildren(el) { // 生成儿子节点
  const children = el.children;
  if (children) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false;
  }
}

function genProps(attrs) { // 生成属性
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
function generate(el) {
  let children = getChildren(el);
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
    children ? `,${children}` : ''
    })`;
  return code;
}

export function compileToFunctions(template) {
  // 解析template
  parseHTML(template)
  // 从解析template成ast再生成code
  let code = generate(root)
  // 封装render函数
  let render = `with(this){return ${code}}`;
  let renderFn = new Function(render);
  return renderFn
}