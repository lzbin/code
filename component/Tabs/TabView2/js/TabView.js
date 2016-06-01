(function (oRoot, fFactory) {
    if (typeof define == 'function' && define.amd) {
        define(fFactory);
    } else {
        oRoot.TabView = fFactory();
    }
})(window, function () {
    var defaults = {
        wrapper : null,
        skin : '',
        autoplay : true,
        onChange : function(){}
    };

    function TabView(options){
        this.opts = extend(defaults,options);
    }
    TabView.prototype = {
        init : function(){
            var that = this;
            that.actIdx = 0;
            that.timer = null;
            that.render();
            that.listener();
            that.autoPlay();
        },
        render : function(){
            var that = this,tab = that.opts.tab;
            var frameEle = document.createDocumentFragment();

            that.tabWrap = that.createTag('div','w-tab-wrap '+ that.opts.skin);
            that.tabTitleWrap = that.createTag('div','w-tab-title');
            that.tabPanelWrap = that.createTag('div','w-tabview-panels');
            that.tabWrap.appendChild(that.tabTitleWrap);
            that.tabWrap.appendChild(that.tabPanelWrap);

            that.renderTitle(tab);
            that.renderPanels(tab);

            frameEle.appendChild(that.tabWrap);
            if(!that.opts.wrapper){
                document.body.appendChild(frameEle);
            }else{
                that.opts.wrapper.appendChild(frameEle);
            }
        },
        renderTitle : function(tab){
            var that = this;
            that.titItems = [];
            for(var i = 0;i < tab.length ;i++){
                var itemCls = 'tab-tit-item';
                if(i == that.actIdx){
                    itemCls += ' active';
                }
                that.titItems[i] = that.createTag('span',itemCls,tab[i].title);
                that.tabTitleWrap.appendChild(that.titItems[i]);
            }

        },
        renderPanels : function(tab){
            var that = this;
            that.panelItems = [];
            for(var i = 0;i < tab.length ;i++){
                var itemCls = 'tab-panel-item';
                if(i == that.actIdx){
                    itemCls += ' active';
                }
                that.panelItems[i] = that.createTag('div',itemCls,tab[i].content);
                that.tabPanelWrap.appendChild(that.panelItems[i]);
            }
        },
        listener : function(){
            var that = this;
            for(var i = 0; i<that.titItems.length;i++){
                (function(num){
                    that.titItems[num].onclick = function(){
                        that.actIdx = num;
                        that.change();
                        that.autoPlay();
                    };
                })(i);
            }
            that.tabWrap.onmouseover = function(){
                clearInterval(that.timer);
            };
            that.tabWrap.onmouseout = function(){
                that.autoPlay();
            }
        },
        change : function(){
            var that = this,actIdx = that.actIdx;
            for(var i = 0 ;i<that.panelItems.length;i++){
                if(i == actIdx){
                    that.titItems[i].className = 'tab-tit-item active';
                    that.panelItems[i].className = 'tab-panel-item active';
                }else{
                    that.titItems[i].className = 'tab-tit-item';
                    that.panelItems[i].className = 'tab-panel-item';
                }
            }
            that.opts.onChange && that.opts.onChange(actIdx);
        },
        autoPlay : function(){
            var that = this;
            if(!!that.opts.autoplay){
                clearInterval(that.timer);
                that.timer = setInterval(function(){
                    if(that.actIdx >= that.panelItems.length-1){
                        that.actIdx = 0;
                    }else {
                        that.actIdx++;
                    }
                    that.change();
                },3000);
            }
        },
        addItem : function(tab){
            var that = this;
            var l = that.panelItems.length;

            for(var i = 0;i < tab.length ;i++){
                that.titItems[l+i] = that.createTag('span','tab-tit-item',tab[i].title);
                that.panelItems[l+i] = that.createTag('div','tab-panel-item',tab[i].content);

                that.tabTitleWrap.appendChild(that.titItems[l+i]);
                that.tabPanelWrap.appendChild(that.panelItems[l+i]);
            }
        },
        removeItem : function(idx){
            var that = this;
            if(idx > that.panelItems.length){return false;}
            if(idx  == that.actIdx){
                that.actIdx = 0;
                that.change();
            }
            that.titItems[idx].remove();
            that.panelItems[idx].remove();
            that.titItems.splice(idx,1);
            that.panelItems.splice(idx,1);
        },
        createTag : function(tagName,cls,content){
            var obj = document.createElement(tagName);
            obj.className = cls;
            if(!!content){
                obj.innerHTML = content;
            }
            return obj;
        }
    };

    function cloneObj(oldObj) { //复制对象方法
        if (typeof(oldObj) != 'object') return oldObj;
        if (oldObj == null) return oldObj;
        var newObj = {};
        for (var i in oldObj)
            newObj[i] = cloneObj(oldObj[i]);
        return newObj;
    }
    function extend() { //扩展对象
        var args = arguments;
        if (args.length < 2) return;
        var temp = cloneObj(args[0]); //调用复制对象方法
        for (var n = 1; n < args.length; n++) {
            for (var i in args[n]) {
                temp[i] = args[n][i];
            }
        }
        return temp;
    }

    return TabView;
});