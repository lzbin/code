(function(){

	var Utils = {
        addClass            : fAddClass,            // 添加class
        removeClass         : fRemoveClass,         // 删除class
        addEvent            : fAddEvent,            // 监听dom事件
        removeEvent         : fRemoveEvent,         // 取消监听dom事件
        indexOfArray        : fIndexOfArray,        // 获取index
        parseJSON           : fParseJSON,           // json字符串转对象
        toJSON              : fToJSON,              // 对象转json字符串
        each                : fEach,                // 遍历数组或对象
        delay               : fDelay,               // 延迟执行
        cancelDelay         : fCancelDelay,         // 取消延迟执行
        loop                : fLoop,                // 循环执行
        cancelLoop          : fCancelLoop,          // 取消循环执行
        encodeHTML          : fEncodeHTML,          // html编码，替换<>等为html编码
        stringLen           : fStringLen,           // 获取文字符串长度
        format              : fFormat,              // 格式化数字或字符串，补齐为0000类的格式
        trim                : fTrim,                // 删除首尾空格
        stripScript         : fStripScript,         // 防xss注入，过滤非法字符
        byteSubstr          : fByteSubstr,          // 按字节长度截取字符串
        getParamsByAttrs    : fGetParamsByAttrs,    // 通过属性获取参数
        getParamsByScript   : fGetParamsByScript,   // 通过script获取参数
        mix                 : fMix,                 // 合并对象
        removeDom           : fRemoveDom,           // 删除dom
        cancelBubble        : fCancelBubble,
        formatDate          : fFormatDate,
        $                   : fProDollar,           // 通过id获取dom
        bind                : fProBind,             // 函数绑定
        clone               : fProClone             // 复制对象
	};

    /**
     * 复制对象
     * @param  {Object} o       要复制的对象
     * @param  {Function} fFilter 过滤方法
     * @return {Object}         复制后的对象
     */
    function fProClone(o, fFilter){
        return F.clone(o, fFilter);
    }

    /**
     * 函数绑定
     * @method bind
     * @param  {Function} fFunc 要绑定的函数
     * @param  {Object} oThis  绑定的对象
     */
    function fProBind(fFunc, oThis){
        return F.bind(fFunc, oThis);
    }

    /**
     * 通过id获取dom
     * @method $
     * @param  {String} sId id
     * @return {Object}     dom
     */
    function fProDollar(sId) {
        return F.$(sId);
    }

    function fFormatDate(oDate){
        var sYeah = oDate.getFullYear();
        var sMonth = this.format(oDate.getMonth() + 1, 2);
        var sDate = this.format(oDate.getDate(), 2);
        var sHours = this.format(oDate.getHours(), 2);
        var sMinutes = this.format(oDate.getMinutes(), 2);
        var sSeconds = this.format(oDate.getSeconds(), 2);

        return [sYeah, sMonth, sDate].join('-') + ' ' + [sHours, sMinutes, sSeconds].join(':');
    }

    /**
     * @method cancelBubble
     */
    function fCancelBubble(oEvt){
        F.cancelBubble(oEvt);
    }

    /**
     * @method mix
     * 合并对象
     * @param {Object|Array} a
     * @param {Object|Array} b
     * @returns {a}
     */
    function fMix(a, b){

        this.each(b, function(o, s){
            a[s] = o;
        });

        return a;
    }

    /**
     * 删除dom
     * @param {HTMLElement} oDom
     */
    function fRemoveDom(oDom){
        oDom && oDom.parentNode && oDom.parentNode.removeChild(oDom);
    }

    /**
     * 通过script获取参数
     * @param oDom
     * @return {Object}
     */
    function fGetParamsByScript(oDom){
        var oParams = {};
        var aChildren = oDom.childNodes;
        for(var i=0, l=aChildren.length; i<l; i++){
            var oNode = aChildren[i];

            if(oNode.nodeType == 1 && oNode.tagName.toUpperCase() == 'SCRIPT') {
                if (oNode.getAttribute('type') == 'text/params') {
                    try {
                        var sParams = oNode.innerHTML;

                        if (sParams.indexOf('(') >= 0) {
                            sParams = sParams.replace(/[\(]/g, '\\(');
                        }

                        var oScriptParams = new Function('return(' + sParams + ')')();
                        if (oScriptParams && oScriptParams.constructor === Object) {
                            oParams = oScriptParams;
                        }

                        this.removeDom(oNode);

                        break;
                    } catch (e) {
                        app.error(e);
                    }
                }
            }
        }
        return oParams;
    }

    /**
     * 通过属性获取参数
     * @param {HTMLElement} oDom
     * @return {Object}
     */
    function fGetParamsByAttrs(oDom){
        var oParams = {};
        var aAttrs = oDom.attributes;

        for(var i=0, l=aAttrs.length; i<l; i++){
            var o = aAttrs[i];
            var sKey = o.name;
            var v = o.nodeValue;

            if(v){
                var a = sKey.split('-');
                if(a.length > 1){
                    sKey = a.shift();
                    while(a.length){
                        var s = a.shift();
                        sKey += s.substring(0, 1).toUpperCase() + s.substring(1, s.length);
                    }
                }

                if(/^[\{\[\/]/.test(v) && /(?:[\}\]]|\/[ig]?)$/.test(v)){
                    try{
                        if(v.indexOf('(') >= 0 && !/^\/[^\/]+\/[ig]?$/.test(v)){
                            v = v.replace(/[\(]/g, '\\(');
                        }
                        v = (new Function('return(' + v +')'))();
                    }catch(e){
                        app.error(e);
                    }
                }else if(v == 'true'){
                    v = true;
                }else if(v == 'false'){
                    v = false;
                }

                oParams[sKey] = v;
            }
        }

        return oParams;
    }

    /**
     * 监听dom事件
     * @method addEvent
     * @author Bob
     * @param {Object}   oDom  dom对象
     * @param {String}   sType 事件类型
     * @param {Function} fFunc 回调函数
     */
    function fAddEvent(oDom, sType, fFunc){
        var sType = sType || 'click';

        if(oDom && fFunc){
            F.addEvent(oDom, sType, fFunc);
        }
    }

    /**
     * 取消监听dom事件
     * @method removeEvent
     * @author Bob
     * @param {Object}   oDom  dom对象
     * @param {String}   sType 事件类型
     * @param {Function} fFunc 回调函数
     */
    function fRemoveEvent(oDom, sType, fFunc){
        if(oDom && sType && fFunc){
            F.removeEvent(oDom, sType, fFunc);
        }
    }

    /**
     * 添加class
     * @method addClass
     * @author Bob
     * @param {Object} oDom dom对象
     * @param {String} sClass class名
     */
    function fAddClass(oDom, sClass){
        if(oDom && sClass){
           F.addClass(oDom, sClass); 
       }
    }

    /**
     * 删除class
     * @method removeClass
     * @author Bob
     * @param {Object} oDom dom对象
     * @param {String} sClass class名
     */
    function fRemoveClass(oDom, sClass){
        if(oDom && sClass){
           F.removeClass(oDom, sClass); 
       }
    }

    /**
     * 获取index
     * @method indexOfArray
     * @author jsun
     * @param {Array} aArr 数组
     * @param {Object} oItem 值
     * @return {Number} 如果item在arr内反回index，否则反回-1
     */
    function fIndexOfArray(aArr, oItem){
        var nIndex = -1;
        if(aArr instanceof Array){
            if(aArr.indexOf){
                nIndex = aArr.indexOf(oItem);
            }else{
                this.each(aArr, function(o, n){
                    if(o === oItem){
                        nIndex = n;
                    }
                });
            }
        }

        return n;
    }

    /**
     * @method each
     * 遍历数组或对象
     * @param  {Object} o 数组或对象
     * @param  {Function} f 回调函数
     * @param  {Object} t this指向
     */
    function fEach(o, f, t){
        t = t || o;
        if(o instanceof Array){
            for(var i=0; i<o.length; i++){
                if(f.call(t, o[i], i) === F.BREAK){
                    break;
                }
            }
        }else if(typeof o == 'object'){
            for(var s in o){
                if(f.call(t, o[s], s) === F.BREAK){
                    break;
                }
            }
        }
    }

    /**
     * @method parseJSON
     * json字符串转对象
     * @param  {String} str json字符串
     * @return {Object}     对象键值对
     */
    function fParseJSON(str){
        return F.JSON.parse(str);
    }

    /**
     * @method toJSON
     * 对象转json字符串
     * @param  {Object} obj 对象键值对
     * @return {String}     json字符串
     */
    function fToJSON(obj){
        return F.JSON.stringify(obj);
    }

    /**
     * 取消延迟执行
     * @method cancelDelay
     * @param  {Number} n 延迟id
     */
    function fCancelDelay(n){
        F.cancelDelay(n);
    }

    /**
     * 取消循环执行
     * @method cancelLoop
     * @param  {Number} n 循环id
     */
    function fCancelLoop(n){
        F.cancelLoop(n);
    }

    /**
     * 延迟执行
     * @method delay
     * @param  {Function} fFunc 延迟执行的函数
     * @param  {Object} [oObj=window] 函数的this对象
     * @param  {Number} [nTime=0] 延迟时间
     * @return {Number} 延迟id
     */
    function fDelay(fFunc, oObj, nTime){
        return F.delay(fFunc, oObj, nTime);
    }

    /**
     * 循环执行
     * @method loop
     * @param  {Function} fFunc 循环执行的函数
     * @param  {Object} [oObj=window] 函数的this对象
     * @param  {Number} [nTime=0] 循环间隔时间
     * @param  {Boolean} [bDoFirst=false] 是否循环前先执行一次
     * @return {Number} 循环id
     */
    function fLoop(fFunc, oObj, nTime, bDoFirst){
        bDoFirst && fFunc.call(oObj);
        return F.loop(fFunc, oObj, nTime);
    }

    /**
     * html编码，替换<>等为html编码
     * @method  encodeHTML
     * @param  {string} s   需要操作的字符串
     * @return {string}     编码后的html代码
     * @for String
     */
    function fEncodeHTML(s) {
        s = s.replace(/</gi, "&lt;");
        s = s.replace(/>/gi, "&gt;");
        s = s.replace(/\"/gi, "&quot;");
        s = s.replace(/\'/gi, "&apos;");
        return s;
    }

    /**
    * 获取文字符串长度
    * @method stringLen
    * @param {String} sStr 字符串
    * @return {Number} nLength 字符串长度
    * @for String
    */
    function fStringLen(sStr){
        var nLength=0;
        for (var i = 0; i < sStr.length; i++){
            if ((sStr.charCodeAt(i) < 0) || (sStr.charCodeAt(i) > 255))
                // 中文 +2
                nLength += 2;
            else
                // 否则 +1
                nLength += 1;
        }
        return nLength;
    }

    /**
     * 格式化数字或字符串，补齐为0000类的格式
     * @param  {Number} nNum 原始数字
     * @param  {Number} nLen 字符长度
     * @return {String} sNum 格式化后的字符串
     */
    function fFormat(nNum, nLen){
        var sNum = nNum + '';
        if(sNum.length < nLen){
            for(var i = 0, l = nLen - sNum.length; i < l; i++){
                sNum = '0' + sNum;
            }
        }
        return sNum;
    }

    /**
     * 删除首尾空格
     * @param  {String} s 原始字符串
     * @return {String}
     */
    function fTrim(s){
        return s.replace(/(^\s*)|(\s*$)/g, "").replace(/(^　*)|(　*$)/g, "");
    }

    /**
     * 过滤非法字符，防止xss
     * @param  {String} s 原始字符串
     * @return {String} sResult 过滤后的字符
     */
    function fStripScript(s){
        var rPattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var sResult = "";
        for (var i = 0; i < s.length; i++) {
            sResult = sResult + s.substr(i, 1).replace(rPattern, '');
        }
        return sResult;
    }

    /**
     * @method byteSubstr
     * 按字节截取字符串
     * @author zhenbin
     * @param  {String} str 字符串
     * @param {Number} len    字符串长度
     * @return {String} 字符串
     */
    function fByteSubstr(str,len){
        return str.replace(/([\u0391-\uffe5])/ig,'$1a').substring(0,len).replace(/([\u0391-\uffe5])a/ig,'$1');
    }


    return window.Utils = Utils;
});
