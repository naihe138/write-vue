import { parseHTML } from "./parse";

function genProps(attrs) {
  let str = ''// {name,value}
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      // color:red;background:red => {color:'red'}
      let obj = {};
      attr.value.split(';').forEach(item => { // qs 库
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj
    }
    if (attr.name === '@click') {
      str += `on:{"click":${attr.value}},`
    } else {
      str += `${attr.name}:${JSON.stringify(attr.value)},` // a:b,c:d,
    }
  }
  return `{${str.slice(0, -1)}}`
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    // 文本
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      //_v( _s(name)+'hello' + _s(name))
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      // split
      while (match = defaultTagRE.exec(text)) {
        let index = match.index; // 匹配的位置  {{name}} hello  {{name}} hello 
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}
function genChildren(children) {
  return children.map(child => gen(child)).join(',')
}
function codegen(ast) {
  let children = genChildren(ast.children);
  let code = (`_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
    }${ast.children.length ? `,${children}` : ''
    })`)

  return code;
}
export function compileToFunction(template) {

  // 1.就是将template 转化成ast语法树
  let ast = parseHTML(template);

  // 2.生成render方法 (render方法执行后的返回的结果就是 虚拟DOM)

  // 模板引擎的实现原理 就是 with  + new Function

  let code = codegen(ast);
  code = `with(this){return ${code}}`;


  let render = new Function(code); // 根据代码生成render函数

  //  _c('div',{id:'app'},_c('div',{style:{color:'red'}},  _v(_s(vm.name)+'hello'),_c('span',undefined,  _v(_s(age))))

  return render;
}


// <xxx
// <namepsace:xxx
// color   =   "asdsada"     c= 'asdasd'  d=  asdasdsa