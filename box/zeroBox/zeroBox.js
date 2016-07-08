/**
 * Created by zhenbin on 2016/6/28 0028.
 */
/*base*/
(function(window,undefined){
    var document = window.document,toString = {}.toString();

    window.base = {
        getAllChildren: function(e) {
            // Returns all children of element. Workaround required for IE5/Windows. Ugh.
            return e.all ? e.all : e.getElementsByTagName('*');
        },
        getBySelector: function(selector) {
            // Attempt to fail gracefully in lesser browsers
            if (!document.getElementsByTagName) {
                return new Array();
            }
            // Split selector in to tokens
            var tokens = selector.split(/\s+/);
            var currentContext = new Array(document);
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');;
                if (token.indexOf('#') > -1) {
                    // Token is an ID selector
                    var bits = token.split('#');
                    var tagName = bits[0];
                    var id = bits[1];
                    var element = document.getElementById(id);
                    if (tagName && element.nodeName.toLowerCase() != tagName) {
                        // tag with that ID not found, return false
                        return new Array();
                    }
                    // Set currentContext to contain just this element
                    currentContext = new Array(element);
                    continue; // Skip to next token
                }
                if (token.indexOf('.') > -1) {
                    // Token contains a class selector
                    var bits = token.split('.');
                    var tagName = bits[0];
                    var className = bits[1];
                    if (!tagName) {
                        tagName = '*';
                    }
                    // Get elements matching tag, filter them for class selector
                    var found = new Array;
                    var foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = base.getAllChildren(currentContext[h]);
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = new Array;
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('\\b'+className+'\\b'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue; // Skip to next token
                }
                // Code to deal with attribute selectors
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1;
                    var attrName = RegExp.$2;
                    var attrOperator = RegExp.$3;
                    var attrValue = RegExp.$4;
                    if (!tagName) {
                        tagName = '*';
                    }
                    // Grab all of the tagName elements within current context
                    var found = new Array;
                    var foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = getAllChildren(currentContext[h]);
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = new Array;
                    var currentContextIndex = 0;
                    var checkFunction; // This function will be used to filter the elements
                    switch (attrOperator) {
                        case '=': // Equality
                            checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue); };
                            break;
                        case '~': // Match one of space seperated words
                            checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('\\b'+attrValue+'\\b'))); };
                            break;
                        case '|': // Match start with value followed by optional hyphen
                            checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))); };
                            break;
                        case '^': // Match starts with value
                            checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
                            break;
                        case '$': // Match ends with value - fails with "Warning" in Opera 7
                            checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
                            break;
                        case '*': // Match ends with value
                            checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
                            break;
                        default :
                            // Just test for existence of attribute
                            checkFunction = function(e) { return e.getAttribute(attrName); };
                    }
                    currentContext = new Array;
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
                    continue; // Skip to next token
                }
                // If we get here, token is JUST an element (not a class or ID selector)
                tagName = token;
                var found = new Array;
                var foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            return currentContext;
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
                    for (var k in obj) elem.style[k] = obj[k];
                });
            }
        },
        // 读取设置节点内容
        html:function(value) {
            var that = this[0];
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that.innerHTML :undefined :typeof value !== "undefined" && value == true ? that && that.nodeType === 1 ? that.outerHTML :undefined :this.each(function(i, elem) {
                elem.innerHTML = value;
            });
        },
        extend : function() {
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
        }
    };
})(window);

/*core*/
(function(window){
    var zeroBox = {},zeroLayer = {},
        regPxe = /\px|em/g, isIE = !-[ 1 ], isIE6 = /msie 6/.test(navigator.userAgent.toLowerCase());
    zeroBox.index = Math.floor(Math.random() * 9e3);

    var doms = ["zeroBox",".zeroBox-wrap",".zeroBox-header",".zeroBox-content",".zeroBox-footer",".zeroBox-close",".zeroBox-maxbtn"];     //缓存常用字符

    var config = {
        area:"auto",                        // 参数一：弹层宽度，参数二： 弹层高度
        boxStyle:{},                        // 设置弹层的样式
        button:[],                          // 各按钮
        cell:"",                            // 独立ID,用于控制弹层唯一标识
        content:"暂无内容！",               // 内容
        closeBtn:true,                     // 标题上的关闭按钮
        endfun:null,
        fixed:true,                        // 是否静止定位
        icon:0,                             // 图标,信息框和加载层的私有参数
        isDrag:true,                       // 是否可以拖拽
        maxBtn:false,                      // 是否开启最大化按钮
        maskClose:false,                   // 点击遮罩层是否可以关闭
        maskColor:[ "#000", .5 ],           // 参数一：遮罩层颜色，参数二：遮罩层透明度
        masklock:true,                     // 是否开启遮罩层
        nofunc:null,                       // 取消和关闭按钮触发的回调
        offset:[ "auto", "auto" ],          // 坐标轴
        padding:"5px",                      // 自定义边距
        scrollbar:true,                    // 是否允许浏览器出现滚动条
        shadow:true,                       // 拖拽风格
        success:null,                      // 层弹出后的成功回调方法
        time:0,                             // 自动关闭时间(秒),0表示不自动关闭
        title:"提示信息",                   // 标题,参数一：提示文字，参数二：提示条样式  ["提示信息",{color:"#ff0000"}]
        type:1,                             // 显示基本层类型
        yesfunc:null,                      // 确定按钮回调方法
        zIndex:9999                         // 弹层层级关系
    };

    var zeroConCell,ZeroBox = function(options){
        var that = this;
        that.opts = base.extend(config,options || {});
        that.index = that.opts.cell != "" ? that.opts.cell :++zeroBox.index;        // 弹层标识ID
        zeroConCell = that.opts.content;                                            // 弹层内容
        that.initView();                                                            // 初始化弹层视图
    };

    ZeroBox.prototype = {
        initView: function(){
            var that = this,opts = that.opts;
            zeroLayer.scrollbar = opts.scrollbar;                                   // 是否禁止页面滚动条

            if(opts.cell != "" && base.getBySelector('#' + doms[0]+opts.index))return;           // 判断opts.cell是否已经存在

            //创建按钮模板
            var btnHtml = function() {
                var btnStrA = opts.button ? function() {
                    var butArr = [];
                    typeof opts.button === "array" && (opts.button = [ opts.button ]);
                    for (var i = 0; i < opts.button.length; i++) {
                        var isDisabled = opts.button[i].hasOwnProperty("disabled") && opts.button[i].disabled == true ? "disabled" :"";
                        butArr.push('<button type="button" class="zeroBox-btn' + i + '" btn="' + i + '" ' + isDisabled + ">" + opts.button[i].name + "</button>");
                    }
                    return butArr.reverse().join("");
                }() :"";
                return '<div class="zeroBox-footer">' + btnStrA + "</div>";
            }();

            //创建默认的弹出层内容模板
            var templates = '<span class="zeroBox-headbtn">' +
                    '<a href="javascript:;" class="zeroBox-maxbtn"></a>' +
                    '<a href="javascript:;" class="zeroBox-close" title="&#20851;&#38381;">&times;</a>' +
                '</span>' +
                '<div class="zeroBox-header"></div>' + '<div class="zeroBox-content" style="padding:' + (opts.padding != "" ? opts.padding :0) + ';"></div>' + btnHtml;

            //创建弹窗外部DIV
            var getZindex = function(elem) {
                var maxZindex = 0;
                for (var z = 0; z < elem.length; z++) {
                    maxZindex = Math.max(maxZindex, elem[z].style.zIndex);
                }
                return maxZindex;
            }, WarpCls = base.getBySelector('#' + doms[1]);

            //计算层级并置顶
            var Zwarp = WarpCls[0] ? getZindex(WarpCls) + 5 :opts.zIndex + 5, Zmask = WarpCls[0] ? getZindex(WarpCls) + 2 :opts.zIndex,
                divBox = document.createElement("div"), maskBox = document.createElement("div");
            that.id = divBox.id = doms[0] + that.index;
            divBox.className = doms[1].replace(/\./g,"");
            divBox.style.position = opts.fixed ? "fixed" :"absolute";
            divBox.style.zIndex = Zwarp;
            divBox.innerHTML = templates;
            divBox.setAttribute("zero", that.index);
            base.getBySelector("body")[0].appendChild(divBox);
            //是否开启遮罩层
            if (opts.masklock) {
                that.mask = maskBox.id = "zeromask" + that.index;
                maskBox.className = "zeroBox-mask";
                maskBox.style.cssText = "left:0;top:0;background-color:" + opts.maskColor[0] + ";z-index:" + Zmask + ";opacity:" + opts.maskColor[1] + ";filter:alpha(opacity=" + opts.maskColor[1] * 100 + ");";
                base.getBySelector("body")[0].appendChild(maskBox);
            }

            var thatID = "#" + that.id, isTitle = opts.title == false || opts.title == "false",
                titType = typeof opts.title === "object", msgTitle = titType ? opts.title :[ opts.title, {} ],
                isBtn = opts.btn == "" && opts.btn == null;
            console.log(base.getBySelector(thatID + ' ' + doms[2]));

            base.getBySelector(thatID + " "+ doms[2]).html(isTitle ? "" :msgTitle[0]).css({ display:isTitle ? "none" :"",  height:isTitle ? "0px" :"" }).css(msgTitle[1]);
            base.getBySelector(thatID + " "+ doms[4]).css({ display:isBtn ? "none" :"", height:isBtn ? "0px" :"" });
            base.getBySelector(thatID + " "+ doms[5]).css("display", opts.closeBtn ? "" :"none");
            base.getBySelector(thatID + " "+ doms[6]).css("display", opts.maxBtn ? "" :"none");
            !opts.scrollbar && base.getBySelector("body").css("overflow", "hidden");
            that.content(opts).layerSize(opts).position(opts).btnCallback(opts);
            if (opts.isDrag) {
                var wrapCell = base.getBySelector(thatID), titCell = base.getBySelector(thatID + " "+ doms[2]);
                that.dragLayer(wrapCell, titCell, .4, opts.shadow);
            }
            setTimeout(function() {
                opts.success && opts.success(base.getBySelector(thatID),that.index);
            }, 1);
        }
    };

    new ZeroBox({});
})(window);
