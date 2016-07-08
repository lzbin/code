/**
 * Created by zhenbin on 2016/7/1 0001.
 */
(function(window, undefined) {
    var document = window.document, toString = {}.toString;
    //������
    function selFind(selector, node) {
        var fors = function(arr, fun){
                for (var i = 0;i < arr.length; i++) {
                    if (fun(i, arr[i]) === false) break;
                }
            },
            getId = function(id) {
                return document.getElementById(id);
            }, //��ȡCLASS�ڵ�����
            getClass = function(cls, isNode) {
                var node = isNode != undefined ? isNode :document, temps = [];
                var clsall = node.getElementsByTagName("*");
                fors(clsall,function(i,cell){
                    //�������нڵ㣬�ж��Ƿ��а���className
                    if (new RegExp("(\\s|^)" + cls + "(\\s|$)").test(cell.className)) temps.push(cell);
                });
                return temps;
            }, //��ȡTAG�ڵ�����
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
        //����һ�����飬���������ȡ�Ľڵ��ڵ�����
        var thatElem = this.elements = [];
        //��������һ���ַ�����˵���ǳ���cssѡ����������this,����function
        if (typeof selector == "string") {
            selector = selector.replace(/(^\s*)|(\s*$)/g, "");
            //cssģ�⣬���Ǹ�CSS���ѡ����һ��
            var sj = /\s+/g, args = /\>/.test(selector) ? selector.replace(/([ \t\r\n\v\f])*>([ \t\r\n\v\f])*/g, ">").replace(/\>/g, " ").replace(sj, " ") :selector.replace(sj, " "),
                expId = /^\#/, expCls = /^\./;
            if (/\,/.test(args)) {
                var argspl = args.split(/,/g), len = argspl.length;
                for (var idx = 0; idx < len; ++idx) thatElem = thatElem.concat(selFind(argspl[idx]));
            }else if (/\s*/.test(args)) {
                //�ѽڵ��ֿ���������������
                var elements = args.split(" ");
                //�����ʱ�ڵ��������飬�������������
                var tempNode = [], node = [];
                //������Ÿ��ڵ��õ�
                fors(elements,function(i,elems){
                    //���Ĭ��û�и��ڵ㣬��ָ��document
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
                //findģ��,����˵ֻ�ǵ�һ��ѡ����
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
                    //��ǰ�����Ƿ�Ϊ����,���Ϊ��������еݹ�
                    if (dest[name] instanceof Object && source[name] instanceof Object) {
                        me(dest[name], source[name]);
                    }
                    //���������Ƿ����
                    if (source.hasOwnProperty(name)) {
                        continue;
                    } else {
                        source[name] = dest[name];
                    }
                }
            }
        };
        var _result = {}, arr = arguments;
        //�������ԣ�������ǰ
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
    // ����������ظ�������
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
        // �����ʽ��
        addClass:function(name) {
            if (!this.hasClass(name)) this[0].className = JED.trim(this[0].className + " " + name + " ");
            return this;
        },
        // �Ƴ���ʽ��
        removeClass:function(name) {
            var elem = this[0];
            if (!name) {
                elem.className = "";
            } else if (this.hasClass(name)) {
                elem.className = JED.trim((" " + elem.className + " ").replace(" " + name + " ", " "));
            }
            return this;
        },
        // ��ȡ�����ӽڵ�
        contents:function() {
            var elems, i = 0, len = this.length, rets = [];
            for (;i < len; i++) {
                rets = JED.merge(rets, this[i].childNodes);
            }
            // ����
            rets = JED.unique(rets);
            return this.pushStack(rets);
        },
        //��ȡ��ǰԪ�ص�����
        position:function() {
            if (this.size() == 0) return null;
            var elem = this[0];
            return { left:elem.offsetLeft,  top:elem.offsetTop };
        },
        // Ԫ��ȡ���
        width:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "width");
            } else {
                this.css("width", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        // Ԫ��ȡ�߶�
        height:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "height");
            } else {
                this.css("height", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        //��ȡ�����ã��Զ�������
        attr:function(name, value) {
            var that = this[0], ret;
            if (typeof value === "undefined") {
                if (that && that.nodeType === 1) {
                    ret = that.getAttribute(name);
                }
                // ���Բ����ڣ�����undefined
                return ret == null ? undefined :ret;
            }
            return this.each(function(i, elem) {
                if (elem.nodeType === 1) elem.setAttribute(name, value);
            });
        },
        // ��ȡ���ýڵ�����
        html:function(value) {
            var that = this[0];
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that.innerHTML :undefined :typeof value !== "undefined" && value == true ? that && that.nodeType === 1 ? that.outerHTML :undefined :this.each(function(i, elem) {
                elem.innerHTML = value;
            });
        },
        // ��ȡ���ýڵ��ı�����
        text:function(value) {
            var that = this[0];
            var innText = document.all ? "innerText" :"textContent";
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that[innText] :undefined :this.each(function(i, elem) {
                elem[innText] = value;
            });
        },
        // ��ȡ���ñ�Ԫ�ص�ֵ
        val:function(value) {
            var that = this[0];
            if (typeof value === "undefined") {
                return that && that.nodeType === 1 && typeof that.value !== "undefined" ? that.value :undefined;
            }
            // ��valueת��Ϊstring
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
    // ������Ե�λautoת��
    function getWidthOrHeight(elem, name) {
        // ����ʽ����תΪ�շ�ʽ
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