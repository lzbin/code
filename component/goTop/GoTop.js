/**
 * Created by zhenbin on 2016/4/26 0026.
 */
function goTop(options) {
    var defaults = {
        acc: 0.3,                   //加速度
        time: 16,                   //时间间隔
        cls:'',                     //自定义样式
        content:'',
        width: '45px',
        height: '45px',
        bottom:'100px',
        right:'100px',
        anim: true,                 //是否开启动画
        distance: 800
    };

    var common = {
        mix: function(){
            var arg, prop, child = {};
            for (arg = 0; arg < arguments.length; arg += 1) {
                for (prop in arguments[arg]) {
                    if (arguments[arg].hasOwnProperty(prop)) {
                        child[prop] = arguments[arg][prop];
                    }
                }
            }
            return child;
        },
        throttle: function(func, wait) {
            var timer = null;
            return function () {
                var self = this, args = arguments;
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    return typeof func === 'function' && func.apply(self, args);
                }, wait);
            }
        },
        hasClass: function(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function(obj, cls) {
            var sp = !obj.className ? '' : ' ';
            if (!this.hasClass(obj, cls)) obj.className += sp + cls;
        },
        removeClass: function(obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, '');
            }
        },
        getScrollPos: function(){
            var x,y;
            if (document.documentElement) {
                x = document.documentElement.scrollLeft || 0;
                y = document.documentElement.scrollTop || 0;
            }else if (document.body) {
                x = document.body.scrollLeft || 0;
                y = document.body.scrollTop || 0;
            }
            return {x:x,y:y};
        }
    };

    GoTop = function (options){
        var that = this;
        that.opts = common.mix(defaults,options);
        that.domE = document.getElementById('goTop');
    };

    GoTop.prototype.init = function(){
        var that = this;
        if (!that.domE){
            that.renderEle();
        }
        that.listener();
        return that;
    };

    GoTop.prototype.renderEle = function(){
        var that = this;
        that.domE = document.createElement('div');
        that.domE.id = 'goTop';
        if(that.opts.cls){
            that.domE.className += 'w-backtop '+ that.opts.cls;
        }
        if(that.opts.content){
            that.domE.innerHTML = that.opts.content;
        }
        that.domE.style = 'height: '+ that.opts.height +';width: '+ that.opts.width +';position: fixed;right: '+ that.opts.right +';bottom: '+ that.opts.bottom +';background: #e0e0e0;display:none;';
        document.body.appendChild(that.domE);
    };

    GoTop.prototype.listener = function(){
        var that = this,_onscroll = window.onscroll,_onclick = that.domE.onclick;
        window.onscroll = common.throttle(function () {
            typeof _onscroll === 'function' && _onscroll.apply(that, arguments);
            that.toggleDomE();
        }, 100);

        that.domE.onclick = function () {
            typeof _onclick === 'function' && _onclick.apply(that, arguments);
            that.move();
        };
    };

    GoTop.prototype.move = function(acc, time){
        var that = this;
            scollPos = common.getScrollPos(),
            x1 = window.scrollX || 0,
            y1 = window.scrollY || 0,
            x = Math.max(scollPos.x,x1),
            y = Math.max(scollPos.y,y1);

        acc = acc || that.opts.acc;
        time = time || that.opts.time;

        var speed = 1 + acc;

        if(that.opts.anim){
            window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
        }else{
            window.scrollTo(0, 0);
        }

        if(x > 0 || y > 0) {
            window.setTimeout(function(){that.move(acc,time)}, time);
        }
    };

    GoTop.prototype.showDomE = function(){
        common.addClass(this.domE,'w-backtop-show');
    };

    GoTop.prototype.hideDomE = function(){
        common.removeClass(this.domE,'w-backtop-show');
    };

    GoTop.prototype.toggleDomE = function() {
        this.domE.style.display = (document.documentElement.scrollTop || document.body.scrollTop) > (this.opts.distance || 500) ? this.showDomE() : this.hideDomE();
    };

    return new GoTop(options).init();
}