/*globals define:true, window:true, module:true*/
(function (root,factory) {
    // 保证AMD分模块可用
    if (typeof define !== 'undefined')
        define([], function () {
            return factory();
        });
    else if (typeof window !== 'undefined')
    // 保证客户端可用
        window.zero = factory();
    else
    // 保证后台可用
        module.exports = factory();
})(window,function(){
    // Namespace object
    var zero = {
        version : '1.0.0',
        Class : fClass,
        extendClass : fExtendClass,
        extend : fExtend,
        util: fUtil(),
        mixin: fMixin,
        deepCopy: fDeepCopy,
        browser: fBrowser,
        base: fBase
    };

    /**
     *  @method zero.Class
     *  @params body:Object
     *  @params SuperClass:function, ImplementClasses:function..., body:Object
     *  @return function
     */
    function fClass() {
        var len = arguments.length;
        var body = arguments[len - 1];    // 最后一个参数是指定本身的方法
        var SuperClass = len > 1 ? arguments[0] : null;     // 第一个参数是指继承的方法，实例和静态部分均继承
        var hasImplementClasses = len > 2;    // 如果有第三个参数，那么第二个就是implementClass,这里其实只继承实例对象
        var Class, SuperClassEmpty;

        // 保证构造方法
        if (body.constructor === Object) {
            Class = function() {};
        } else {
            Class = body.constructor;
            // 保证后面不覆盖constructor
            delete body.constructor;
        }
        // 处理superClass部分
        if (SuperClass) {
            // 中间件实现实例属性的继承
            SuperClassEmpty = function() {};
            SuperClassEmpty.prototype = SuperClass.prototype;
            Class.prototype = new SuperClassEmpty();    // 原型继承，解除引用
            Class.prototype.constructor = Class;    // 保证constructor
            Class.Super = SuperClass;    // 父对象访问接口
            // 静态方法继承，重载superClass方法
            fExtend(Class, SuperClass, false);
        }

        // 处理ImplementClass部分,其实只继承实例属性部分,除SuperClass #arguments[0]# 和 body #arguments[length-1]#
        if (hasImplementClasses)
            for (var i = 1; i < len - 1; i++)
                // implement是继承的实例属性部分, 重载父对象implementClass方法
                fExtend(Class.prototype, arguments[i].prototype, false);

        // 处理本身声明body部分，静态要STATIC指定,实例部分要删除STATIC部分
        fExtendClass(Class, body);

        return Class;

    }
    /**
     * @method zero.extendClass
     * @params Class:function, extension:Object, ?override:boolean=true
     */
    function fExtendClass(Class, extension, override) {
        // 静态部分继承静态部分
        if (extension.STATIC) {
            fExtend(Class, extension.STATIC, override);
            // 保证实例部分不继承静态方法
            delete extension.STATIC;
        }
        // 实例属性继继承实例部
        fExtend(Class.prototype, extension.members, override);
    }

    /**
     * @method zero.fExtend
     * @params object,extension,override
     */
    function fExtend(obj, extension, override) {
        var prop;
        // 其实这里的flase是表明，覆盖父对象的方法
        if (override === false) {
            for (prop in extension){
                if (!(prop in obj)){
                    obj[prop] = extension[prop];
                }
            }
        } else {
            // 这里其实不覆盖父对象的方法,包括toString
            for (prop in extension){
                obj[prop] = extension[prop];
            }
            if (extension.toString !== Object.prototype.toString)
                obj.toString = extension.toString;
        }
    }

    function fUtil(){
        return {
            //添加事件
            AddEvt: function(ele, evt, fn) {
                if (document.addEventListener) {
                    ele.addEventListener(evt, fn, false);
                } else if (document.attachEvent) {
                    ele.attachEvent('on' + (evt == "input" ? "propertychange" : evt), fn);
                } else {
                    ele['on' + (evt == "input" ? "propertychange" : evt)] = fn;
                }
            },
            //在某元素后面追加元素
            insertAfter: function(ele, targetELe) {
                var parentnode = targetELe.parentNode || targetELe.parentElement;
                if (parentnode.lastChild == targetELe) {
                    parentnode.appendChild(ele);
                } else {
                    parentnode.insertBefore(ele, targetELe.nextSibling);
                }
            },
            //Get请求
            get: function(url, paraobj, fn, timeout) {
                var xhr = null;
                try {
                    if (window.XMLHttpRequest) {
                        xhr = new XMLHttpRequest();
                    } else if (Window.ActiveXObject) {

                        xhr = new ActiveXObject("Msxml2.Xmlhttp");
                    }
                } catch (e) {
                    xhr = new ActiveXObject('Microsoft.Xmlhttp');
                }
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        fn.call(this, this.responseText);

                    } else {
                        setTimeout(function() {

                            xhr.abort();
                        }, timeout);
                    }
                };
                var parastr = '';
                parastr += "?";
                for (var prop in paraobj) {
                    parastr += prop + "=" + paraobj[prop] + "&";
                }
                xhr.open('get', parastr != "?" ? (url + parastr) : url, true);
                xhr.send();

            },
            getType: function(o){
                var _t;
                return (( _t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1) : _t ).toLowerCase();
            }
        }
    }
    /**
     * method mixin
     */
    function fMixin(dest/*,any number of objects*/){
        var sources = [].slice.call(arguments,1);
        var ride = (typeof sources[sources.length-1] == 'boolean') ? sources.pop() : false;

        for(var i = 0;i<sources.length;i++){
            var src = sources[i];
            for(var key in src){
                if(ride || !dest[key]){
                    dest[key] =  src[key];
                }
            }
        }
        return dest;
    }
    return zero;

    /**
     * method deepCopy
     */
    function fDeepCopy(destination,source) {
        for(var p in source)
        {
            if(getType(source[p])=="array"||getType(source[p])=="object")
            {
                destination[p]=getType(source[p])=="array"?[]:{};
                arguments.callee(destination[p],source[p]);
            }
            else
            {
                destination[p]=source[p];
            }
        }
    }

    /**
     * method fBrowser
     */
    function fBrowser(){
        var dataBrowser = [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {		// for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Internet Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {		 // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ],
            versionSearchString;


        function searchString(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        }
        function searchVersion(dataString) {
            var index = dataString.indexOf(versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + versionSearchString.length + 1));
        }

        return {
            browser : searchString(dataBrowser) || "An unknown browser",
            version : searchVersion(navigator.userAgent)
            || searchVersion(navigator.appVersion)
            || "an unknown version",
            OS : searchString(dataOS) || "an unknown OS"
        };
    }

    function fBase(){

    }
});