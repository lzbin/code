/**
 * Created by zhenbin on 2016/7/1 0001.
 */
(function(window, undefined) {
    var document = window.document, toString = {}.toString;
    //基础库
    function selFind(selector, node) {
        var fors = function(arr, fun){
                for (var i = 0;i < arr.length; i++) {
                    if (fun(i, arr[i]) === false) break;
                }
            },
            getId = function(id) {
                return document.getElementById(id);
            }, //获取CLASS节点数组
            getClass = function(cls, isNode) {
                var node = isNode != undefined ? isNode :document, temps = [];
                var clsall = node.getElementsByTagName("*");
                fors(clsall,function(i,cell){
                    //遍历所有节点，判断是否有包含className
                    if (new RegExp("(\\s|^)" + cls + "(\\s|$)").test(cell.className)) temps.push(cell);
                });
                return temps;
            }, //获取TAG节点数组
            getTagName = function(tag, isNode) {
                var node = isNode != undefined ? isNode :document, temps = [], regCls = /\./.test(tag), regTag = /\=/.test(tag),
                    tagCls = regTag ? tag.match(/\w+\[([\w\-_][^=]+)=([\'\[\]\w\-_]+)\]/) :tag.split(".");
                var tags = node.getElementsByTagName(regCls ? tagCls[0] : tagCls[0].split("[")[0]);
                if ((regCls && tagCls[1] != undefined) || regTag) {
                    var clsn = regCls ? tagCls[1] : tagCls,
                        clas = /MSIE (6|7)/i.test(navigator.userAgent) ? "className" :"class",
                        atts = regCls ? clas :clsn[1], clsof = regCls ? clsn :clsn[2];
                    fors(tags,function(i,cell){
                        if (new RegExp(clsof).test(cell.getAttribute(atts))) temps.push(cell);
                    })
                } else {
                    fors(tags,function(i,cell){ temps.push(cell); })
                }
                return temps;
            };
        //创建一个数组，用来保存获取的节点或节点数组
        var thatElem = this.elements = [];
        //当参数是一个字符串，说明是常规css选择器，不是this,或者function
        if (typeof selector == "string") {
            selector = selector.replace(/(^\s*)|(\s*$)/g, "");
            //css模拟，就是跟CSS后代选择器一样
            var sj = /\s+/g, args = /\>/.test(selector) ? selector.replace(/([ \t\r\n\v\f])*>([ \t\r\n\v\f])*/g, ">").replace(/\>/g, " ").replace(sj, " ") :selector.replace(sj, " "),
                expId = /^\#/, expCls = /^\./;
            if (/\,/.test(args)) {
                var argspl = args.split(/,/g), len = argspl.length;
                for (var idx = 0; idx < len; ++idx) thatElem = thatElem.concat(selFind(argspl[idx]));
            }else if (/\s*/.test(args)) {
                //把节点拆分开并保存在数组里
                var elements = args.split(" ");
                //存放临时节点对象的数组，解决被覆盖问题
                var tempNode = [], node = [];
                //用来存放父节点用的
                fors(elements,function(i,elems){
                    //如果默认没有父节点，就指定document
                    if (node.length == 0) node.push(document);
                    var elmSub = elems.substring(1);
                    tempNode = [];
                    if(expId.test(elems)){  //id
                        tempNode.push(getId(elmSub));
                    }else if(expCls.test(elems)){  //class
                        fors(node,function(j,nd){
                            fors(getClass(elmSub, nd),function(k,tp){ tempNode.push(tp); })
                        })
                    }else{  //tag
                        fors(node,function(j,nd){
                            fors(getTagName(elems, nd),function(k,tp){tempNode.push(tp); })
                        })
                    }
                    node = tempNode;
                });
                thatElem = tempNode;
            } else {
                //find模拟,就是说只是单一的选择器
                var argSub = args.substring(1);
                if(expId.test(args)){  //id
                    thatElem.push(getId(argSub));
                }else if(expCls.test(args)){  //class
                    thatElem = getClass(argSub);
                }else{  //tag
                    thatElem = getTagName(args);
                }
            }
        } else if (typeof args == "Object") {
            if (args != undefined) {
                thatElem[0] = args;
            }
        }
        return thatElem;
    }
    var JED = function(args, node) {
        var newJED = new JED.fn.init(args, node);
        return newJED;
    };
    JED.extend = function() {
        var _extend = function me(dest, source) {
            for (var name in dest) {
                if (dest.hasOwnProperty(name)) {
                    //当前属性是否为对象,如果为对象，则进行递归
                    if (dest[name] instanceof Object && source[name] instanceof Object) {
                        me(dest[name], source[name]);
                    }
                    //检测该属性是否存在
                    if (source.hasOwnProperty(name)) {
                        continue;
                    } else {
                        source[name] = dest[name];
                    }
                }
            }
        };
        var _result = {}, arr = arguments;
        //遍历属性，至后向前
        if (!arr.length) return {};
        for (var i = arr.length - 1; i >= 0; i--) {
            _extend(arr[i], _result);
        }
        arr[0] = _result;
        return _result;
    };
    JED.each = function(arr, fun) {
        var i = 0, len = arr.length;
        for (;i < len; i++) {
            if (fun(i, arr[i]) === false) break;
        }
    };
    JED.isType = function(obj, type) {
        var types = type.replace(/\b(\w)|\s(\w)/g, function(m) {
            return m.toUpperCase();
        });
        return Object.prototype.toString.call(obj) === "[object " + types + "]";
    };
    JED.inArray = function(elem, arr, i) {
        var core_indexOf = Array.prototype.indexOf;
        if (arr) {
            if (core_indexOf) return core_indexOf.call(arr, elem, i);
            var len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) :i :0;
            for (;i < len; i++) {
                if (i in arr && arr[i] === elem) return i;
            }
        }
        return -1;
    };
    // 清除数组中重复的数据
    JED.unique = function(arr) {
        var rets = [], i = 0, len = arr.length;
        if (JED.isType(arr, "array")) {
            for (;i < len; i++) {
                if (JED.inArray(arr[i], rets) === -1) rets.push(arr[i]);
            }
        }
        return rets;
    };
    JED.merge = function(first, second) {
        var sl = second.length, i = first.length, j = 0;
        if (JED.isType(sl, "number")) {
            for (;j < sl; j++) {
                first[i++] = second[j];
            }
        } else {
            while (second[j] !== undefined) {
                first[i++] = second[j++];
            }
        }
        first.length = i;
        return first;
    };
    JED.trim = function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    JED.fn = JED.prototype = {
        init:function(selector, node) {
            if (!selector) return this;
            if (selector.nodeType) {
                this.node = this[0] = selector;
                this.length=1;
                return this;
            }
            if(selector != null && selector == selector.window){
                this.context = this[0] = window;
                this.length=1;
                return this;
            }
            if (selector === "body" && document.body) {
                this.node = document;
                this[0] = document.body;
                this.selector = selector;
                this.length=1;
                return this;
            }
            if (typeof selector === "string") {
                node = node || document;
                var selSize = selFind(selector, node), rets = [];
                for (var i = 0; i < selSize.length; i++) {
                    rets.push(selSize[i]);
                }
                return JED(this).pushStack(rets);
            }
            return this;
        },
        find:function(selector) {
            return JED(selector, this);
        },
        size:function() {
            return this.length;
        },
        each:function(callback) {
            JED.each(this, callback);
            return this;
        },
        pushStack:function(elems) {
            var obj = JED(), i = 0, len = elems.length;
            for (;i < len; i++) {
                obj[i] = elems[i];
            }
            obj.length = len;
            return obj;
        },
        css:function(name, value) {
            var that = this, obj = arguments[0];
            if (typeof name == "string" && typeof value == "string") {
                return that.each(function(i, elem) {  elem.style[name] = value; });
            } else if (typeof name == "string" && typeof value === "undefined") {
                if (that.size() == 0) return null;
                var ele = this[0], JeS = function() {
                    var def = document.defaultView;
                    return new Function("el", "style", [ "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));", "style=='float' && (style='", def ? "cssFloat" :"styleFloat", "');return el.style[style] || ", def ? "window.getComputedStyle(el, null)[style]" :"el.currentStyle[style]", " || null;" ].join(""));
                }();
                return JeS(ele, name);
            } else {
                return that.each(function(i, elem) {
                    for(var k in obj){
                        log(elem.outerHTML,k);
                        elem.style[k] = obj[k];
                    }
                });
            }
        },
        hasClass:function(selector) {
            var className = " " + selector + " ", i = 0, len = this.length;
            for ( ; i < len; i++ ) {
                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(/[\n\t\r]/g, " ").indexOf( className ) > -1 ) return true;
            }
            return false;
        },
        // 添加样式类
        addClass:function(name) {
            if (!this.hasClass(name)) this[0].className = JED.trim(this[0].className + " " + name + " ");
            return this;
        },
        // 移除样式类
        removeClass:function(name) {
            var elem = this[0];
            if (!name) {
                elem.className = "";
            } else if (this.hasClass(name)) {
                elem.className = JED.trim((" " + elem.className + " ").replace(" " + name + " ", " "));
            }
            return this;
        },
        // 获取所有子节点
        contents:function() {
            var elems, i = 0, len = this.length, rets = [];
            for (;i < len; i++) {
                rets = JED.merge(rets, this[i].childNodes);
            }
            // 排重
            rets = JED.unique(rets);
            return this.pushStack(rets);
        },
        //获取当前元素的坐标
        position:function() {
            if (this.size() == 0) return null;
            var elem = this[0];
            return { left:elem.offsetLeft,  top:elem.offsetTop };
        },
        // 元素取宽度
        width:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "width");
            } else {
                this.css("width", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        // 元素取高度
        height:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "height");
            } else {
                this.css("height", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        //获取与设置，自定义属性
        attr:function(name, value) {
            var that = this[0], ret;
            if (typeof value === "undefined") {
                if (that && that.nodeType === 1) {
                    ret = that.getAttribute(name);
                }
                // 属性不存在，返回undefined
                return ret == null ? undefined :ret;
            }
            return this.each(function(i, elem) {
                if (elem.nodeType === 1) elem.setAttribute(name, value);
            });
        },
        // 读取设置节点内容
        html:function(value) {
            var that = this[0];
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that.innerHTML :undefined :typeof value !== "undefined" && value == true ? that && that.nodeType === 1 ? that.outerHTML :undefined :this.each(function(i, elem) {
                elem.innerHTML = value;
            });
        },
        // 读取设置节点文本内容
        text:function(value) {
            var that = this[0];
            var innText = document.all ? "innerText" :"textContent";
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that[innText] :undefined :this.each(function(i, elem) {
                elem[innText] = value;
            });
        },
        // 读取设置表单元素的值
        val:function(value) {
            var that = this[0];
            if (typeof value === "undefined") {
                return that && that.nodeType === 1 && typeof that.value !== "undefined" ? that.value :undefined;
            }
            // 将value转化为string
            value = value == null ? "" :value + "";
            return this.each(function(i, elem) {
                if (typeof elem.value !== "undefined") {
                    elem.value = value;
                }
            });
        },
        bind:function(type, fn) {
            return this.each(function(i, elem) {
                elem.attachEvent ? elem.attachEvent("on" + type, function() {
                    fn.call(elem, window.type);
                }) :elem.addEventListener(type, fn, false);
            });
        }
    };
    // 宽高属性单位auto转化
    function getWidthOrHeight(elem, name) {
        // 将样式属性转为驼峰式
        function camelCase(name) {
            return name.replace(/\-(\w)/g, function(all, letter) {
                return letter.toUpperCase();
            });
        }
        var padding = name === "width" ? [ "left", "right" ] :[ "top", "bottom" ], ret = elem[0][camelCase("offset-" + name)];
        if (ret <= 0 || ret == null) {
            ret = parseFloat(elem[0][camelCase("client-" + name)]) - parseFloat(elem.css("padding-" + padding[0]) || 0) - parseFloat(elem.css("padding-" + padding[1]) || 0);
        }
        return ret;
    }
    JED.fn.init.prototype = JED.fn;
    window.JED = $D = JED;
})(window);