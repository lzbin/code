/**
 * Created by zhenbin on 2016/4/20 0020.
 */
;!function(window){
    'use strict'
    var defaults = {
        id : 0,
        type: 0,                     //
        title:false,                //是否显示标题
        shade: true,                //遮罩
        shadeClose: true,           //点击遮罩关闭
        fixed: true,                //
        anim: true                  //
    };

    var index = 0,bd = document.getElementsByTagName('body')[0];

    var common = {
        extend : function (from,to){
            var i, obj = {};
            for(i in from){
                obj[i] = to[i] ? to[i] : from[i];
            }
            return obj;
        },
        /**
         * @description 添加事件
         * @method  addEvent
         * @param {target} 事件触发对象
         * @param {type} 事件
         * @param {func} 事件处理函数
         */
        bind: function(){
            var element=typeof element=="string"?d.getElementById(element):element;
            var regHandler = handler;
            if(param)
            {
                regHandler = function(e)
                {
                    handler.call(this, param);//继承监听函数,并传入参数以初始化;
                }
            }
            if(element.addEventListener){
                element.addEventListener(event,regHandler,false)
            }else if(element.attachEvent){
                element.attachEvent("on"+event,regHandler);
            }else{
                element["on"+event]=regHandler;
            }
        },
        /**
         * @description 事件移除
         * @method  removeEvent
         * @param {target} 事件触发对象
         * @param {type} 事件
         * @param {func} 事件处理函数
         */
        unbind : function(target, type, func){
            if (target.removeEventListener)
                target.removeEventListener(type, func, false);
            else if (target.detachEvent)
                target.detachEvent("on" + type, func);
            else target["on" + type] = null;
        },
        each : function(obj,fn){
            if(!fn) return;
            if(obj instanceof Array){//数组
                var i = 0, len = obj.length;
                for(;i<len;i++){
                    if(fn.call(obj[i],i) == false)//函数中的this指向obj[i],i为索引
                        break;
                }
            }else if(typeof obj === 'object'){//对象
                var j = null;
                for(j in obj){
                    if(fn.call(obj[j],j) == false)//函数中的this指向obj[j],j为属性名称
                        break;
                }
            }
        },
        insertAfter : function(newChild,refChild){
            var parElem=refChild.parentNode;
            if(parElem.lastChild==refChild){
                refChild.appendChild(newChild);
            }else{
                parElem.insertBefore(newChild,refChild.nextSibling);
            }
        },
        /**
         * 删除dom
         * @param {HTMLElement} oDom
         */
        removeDom : function (oDom){
            oDom && oDom.parentNode && oDom.parentNode.removeChild(oDom);
        }

    };

    var MsgBox = function(options){
        var that = this;
        that.opts = common.extend(defaults,options);
    };
    MsgBox.prototype={
        init : function(){
            var that = this;
            that.render();
        },
        render : function(){
            var that = this;
            that.renderMask();
            that.boxEle = document.createElement('div');
            that.boxEle.className = 'w-msgbox-layer';
            that.boxEle.style = 'width: 400px;height:200px;background:rgba(0,0,0,.5)';

            bd.appendChild(that.boxEle);

            that.center();
            index++;
        },
        renderMask : function(){
            var that = this;
            if(that.opts.shade){
                that.maskEle = document.createElement('div');
                that.maskEle.className = 'w-msgbox-mask';
                bd.appendChild(that.maskEle);
            }
        },
        close : function(){

        },
        center: function() {
            var oDom = this.boxEle;
            var oParent = document.documentElement;
            var nWidth = oDom.offsetWidth;
            var nHeight = oDom.offsetHeight;
            var nParentWidth = oParent.clientWidth;
            var nParentHeight = oParent.clientHeight;
            var nParentTop = oParent.scrollTop;
            var nParentLeft = oParent.scrollLeft;
            oDom.style.left = (nParentWidth - nWidth) / 2 + 'px';
            oDom.style.top = (nParentHeight - nHeight) / 2 + 'px';

            // ie6遮罩宽高计算
            var oMask = this.maskEle;
            if(oMask && oMask.offsetHeight < nParentHeight){
                var oMaskDom = oMask;
                var nBodyHeight = oParent.scrollHeight;
                oMaskDom.style.height = nBodyHeight + 'px';
                oDom.style.top = oDom.offsetTop + oParent.scrollTop + 'px';
            }else if(oDom.offsetTop < 0){
                // 超过浏览器窗口的情况
                oDom.style.position = 'absolute';
                oDom.style.top = (oParent.scrollTop || document.body.scrollTop) + 'px';
            }else{
                oDom.style.position = '';
            }
        },
        destory : function(){

        }
    };

    window.MsgBox = MsgBox;
}(window);

var msgBox = new MsgBox({title:1});
msgBox.init();