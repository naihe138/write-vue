(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 数组方法拦截

  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[method].apply(this, args);
      var ob = this.__ob__;
      var inserted = null;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  });

  var emptyObject = Object.freeze({});
  var _toString = Object.prototype.toString;
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
  }
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return expectsLowerCase ? function (val) {
      return map[val.toLowerCase()];
    } : function (val) {
      return map[val];
    };
  }
  /**
   * Check if a tag is a built-in tag.
   */

  var isBuiltInTag = makeMap('slot,component', true);
  /**
   * Check if an attribute is a reserved attribute.
   */

  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
  /**
   * Check whether an object has the property.
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */

  function polyfillBind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    }

    boundFn._length = fn.length;
    return boundFn;
  }

  function nativeBind(fn, ctx) {
    return fn.bind(ctx);
  }

  var bind = Function.prototype.bind ? nativeBind : polyfillBind;
  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */

  function noop() {}
  function parsePath(path) {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }

      return obj;
    };
  }

  // 依赖收集
  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this); // 让watcher,去存放dep
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        // 触发更新
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }]);

    return Dep;
  }();

  var stack = []; // push当前watcher到stack 中，并记录当前watcer

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  } // 运行完之后清空当前的watcher

  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 给每个响应式对象添加一个__ob__属性。方便数组拦截方法使用，和以后监听过了，就直接返回监听过的对象
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });
      this.dep = new Dep(); // 专门为数组设计的

      if (Array.isArray(value)) {
        // 拦截数组方法，这么做提升了很多性能
        value.__proto__ = arrayMethods; // 给数组的每一个值设置监听

        this.observeArray(value);
      } else {
        // 递归监听
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0, len = keys.length; i < len; i++) {
          var key = keys[i];
          var value = data[key]; // 给对象设置get set

          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0, len = value.length; i < len; i++) {
          observe(value[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var childOb = observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          // 如果取值时有watcher
          dep.depend(); // 让watcher保存dep，并且让dep 保存watcher

          if (childOb) {
            childOb.dep.depend(); // 收集数组依赖

            if (Array.isArray(value)) {
              // 如果内部还是数组
              dependArray(value); // 不停的进行依赖收集
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue == value) return;
        observe(newValue); // 监听新的值

        value = newValue;
        dep.notify(); // 通知渲染watcher去更新
      }
    });
  } // 数组的每一项进行收集


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  } // 数据监听


  function observe(data) {
    if (_typeof(data) !== 'object' && data != null) {
      return;
    } // 如果被监听过就返回监听过的对象


    if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
      return data.__ob__;
    } else {
      return new Observer(data);
    }
  }

  var callbacks = [];

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
  }

  var timerFunc = function timerFunc() {
    Promise.resolve().then(flushCallback);
  };

  function nextTick(cb) {
    callbacks.push(cb);
    timerFunc();
  }

  var has = {};
  var queue = []; // 调度

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      queue[i].run();
    }

    queue = [];
    has = [];
  }

  var pending = false; // 异步执行所有的watcher

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      has[id] = true;
      queue.push(watcher);

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  var id$1 = 0; // 渲染watcher  computer user wather

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        this.getter = parsePath(exprOrFn); // user watcher 
      }

      if (options) {
        this.lazy = !!options.lazy; // 为computed 设计的

        this.user = !!options.user; // 为user wather设计的
      } else {
        this.user = this.lazy = false;
      }

      this.cb = cb;
      this.options = options;
      this.dirty = this.lazy;
      this.id = id$1++;
      this.deps = [];
      this.depsId = new Set(); // dep 已经收集过相同的watcher 就不要重复收集了

      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        var vm = this.vm;
        pushTarget(this); // 执行函数

        var value = this.getter.call(vm, vm);
        popTarget();
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var value = this.get();
        var oldValue = this.value;
        this.value = value; // 执行cb

        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (error) {
            console.error(error);
          }
        } else {
          this.cb && this.cb.call(this.vm, oldValue, value);
        }
      } // 执行get，并且 this.dirty = false

    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      } // 所有的属性收集当前的watcer

    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }();

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) {
      initMethod(vm);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initMethod(vm) {
    var methods = vm.$options.methods;

    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        return vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {}; // 数据代理

    var keys = Object.keys(data);
    var i = keys.length;

    while (i--) {
      proxy(vm, '_data', keys[i]);
    }

    observe(data);
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = Object.create(null);

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, noop, {
        lazy: true
      });

      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function defineComputed(vm, key, userDef) {
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
      sharedPropertyDefinition.get = userDef.get;
    }

    Object.defineProperty(vm, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers[key];

      if (watcher) {
        if (watcher.dirty) {
          // 给computed的属性添加订阅watchers
          watcher.evaluate();
        } // 把渲染watcher 添加到属性的订阅里面去，这很关键


        if (Dep.target) {
          watcher.depend();
        }

        return watcher.value;
      }
    };
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;

    for (var key in watch) {
      var handler = watch[key];
      createWatcher(vm, key, handler);
    }
  }

  function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(expOrFn, handler, options);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;
  var root,
      currentParent,
      stack$1 = [];

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  } // 开始< 符号处理


  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element;
    stack$1.push(element);
  } // 结束> 符号处理


  function end(tagName) {
    var element = stack$1.pop();
    currentParent = stack$1[stack$1.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  } // 空格和{{ }} 处理


  function chars(text) {
    // text = text.replace(/\s/g, '')
    if (text && text.replace(/\s/g, '')) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text: text
      });
    }
  }

  function parseHTML(html) {
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    } // 截取字符串


    function advance(n) {
      html = html.substring(n);
    }
  } // 生成代码


  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var lastIndex = defaultTagRE.lastIndex = 0;
      var tokens = [];
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function getChildren(el) {
    // 生成儿子节点
    var children = el.children;

    if (children) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function genProps(attrs) {
    // 生成属性
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    root = undefined;
    currentParent = undefined;
    stack$1 = []; // 解析template

    parseHTML(template); // 从解析template成ast再生成code

    var code = generate(root); // 封装render函数

    var render = "with(this){return ".concat(code, "}");
    var renderFn = new Function(render);
    return renderFn;
  }

  function patch(oldVnode, newVnode) {
    // 如果是第一次渲染
    if (!newVnode && oldVnode) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode;
      var el = creatElm(newVnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldVnode);
      return el;
    } else if (oldVnode.tag !== newVnode.tag) {
      // 如果标签不一致说明是两个不同元素
      oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
    } else if (!oldVnode.tag) {
      // 如果标签一致但是不存在则是文本节点
      if (oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text;
      }
    } else {
      var _el = newVnode.el = oldVnode.el;

      var oldChildren = oldVnode.children || [];
      var newChildren = newVnode.children || [];
      var oLen = oldChildren.length;
      var nLen = newChildren.length;
      updateProperties(newVnode, oldVnode.data); // 新老都有儿子，则需要对比儿子

      if (oLen > 0 && nLen > 0) {
        updateChildrens(oldChildren, newChildren, _el);
      } else if (oLen > 0 && nLen === 0) {
        // 老的有儿子，新的没有儿子，则直接清空
        _el.innerHTML = '';
      } else if (oLen === 0 && nLen > 0) {
        // 老得没有儿子，新的有儿子
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < nLen; i++) {
          fragment.appendChild(createElm(newChildren[i]));
        }

        _el.appendChild(fragment);
      }
    }
  }

  function updateChildrens(oldChildren, newChildren, parent) {
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 优化向后追加逻辑
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 优化向前追加逻辑
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), ele);
      }
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 比对样式

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    } // 删除多余属性


    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  } // 挂载组件

  function mountComponent(vm, el) {
    vm.$el = el;

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, function () {}, true);
  } // 调用生命周期函数

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  var LIFECYCLE_HOOKS = ['beforeCteate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strate = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strate[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strate[key]) {
        options[key] = strate[key](parent[key], child[key]);
      } else {
        if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
          options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
        } else {
          options[key] = child[key];
        }
      }
    }

    return options;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 合并全局对象到和配置对象到vm.$options中

      vm.$options = mergeOptions(vm.constructor.options, options); // 执行berforCreate 生命钩子函数

      callHook(vm, 'berforCreate'); // 初始化数据

      initState(vm); // 执行created 生命钩子函数

      callHook(vm, 'created');

      if (vm.$options.el) {
        // 执行beforeMount生命钩子函数
        callHook(vm, 'beforeMount'); // 执行组件挂载

        vm.$mount(vm.$options.el); // 执行mounted生命钩子函数

        callHook(vm, 'mounted');
      }
    }; // 挂载方法


    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // 解析template成，返回renderh函数


        var render = compileToFunction(template);
        options.render = render;
      }

      mountComponent(vm, el);
    };

    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;

      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options);
      }

      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);

      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (err) {
          console.error('options.immediate error');
        }
      }
    };
  }

  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    // 创建文本
    Vue.prototype._v = function (text) {
      return createTextNode(text);
    }; // 创建元素


    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    }; // 拿到数据


    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    }; // 挂载render函数


    Vue.prototype._render = function () {
      var vm = this;
      var render = this.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function Vue(options) {
    // 执行初始化函数，并把参数传递进去
    this._init(options);
  } // 初始化全局api,和全局的koptions


  initGlobalAPI(Vue); // 初始化Mixin

  initMixin(Vue); // 初始化生命周期

  lifecycleMixin(Vue); // 初始化渲染方法

  renderMixin(Vue); //-----------分割线 以下是测试代码
  // 1.创建第一个虚拟节点

  var vm1 = new Vue({
    data: {
      name: 'aa'
    }
  });
  var render1 = compileToFunction("\n  <div>\n    <p key=\"A\">A</p>\n    <p key=\"B\">B</p>\n    <p key=\"C\">C</p>\n  </div>");
  var oldVnode = render1.call(vm1); // 2.创建第二个虚拟节点

  var vm2 = new Vue({
    data: {
      name: 'bb'
    }
  });
  var render2 = compileToFunction("\n  <div>\n    <p key=\"A\">A</p>\n    <p key=\"B\">B</p>\n    <p key=\"C\">C</p>\n    <p key=\"D\">D</p>\n  </div>");
  var newVnode = render2.call(vm1); // // 3.通过第一个虚拟节点做首次渲染

  var el = createElm(oldVnode);
  document.body.appendChild(el); // 4.调用patch方法进行对比操作

  patch(oldVnode, newVnode);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
