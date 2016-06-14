(function(){
    if(typeof define !== 'undefined'){
        define([], function () {
            return Emitter;
        });
    }else if(typeof module !== 'undefined'){
        module.exports = Emitter;
    }else{
        window.Emitter = Emitter;
    }

    function Emitter(){
        this._callbacks = {};   // 回调集合
        this._fired = {};       // 已触发事件集合
    }
    Emitter.prototype = {
        addListener : fAddListener,
        removeListener : fRemoveListener,
        once: fOnce,
        fire : fEmit,
        emit: fEmit,
        on: fAddListener,
        when : fWhen,
        off: fRemoveListener,
        listeners: fListeners
    };

    //========= method =========//
    /**
     * Listen on the given `eventname` with `callback`.
     *
     * @param {String} eventname
     * @param {Function} callback
     * @return {Emitter}
     * @api public
     */
    function fAddListener(eventname, callback) {
        this._callbacks[eventname] = this._callbacks[eventname] || [];
        this._callbacks[eventname].push(callback);
        return this;
    }
    /**
     * Remove the given callback for `eventname` or all
     * registered callbacks.
     *
     * @param {String} eventname
     * @param {Function} callback
     * @api public
     */
    function fRemoveListener(eventname,callback){
        var cbs = this._callbacks,cbList,cblength;
        if(!eventname) return this;
        if(!callback){
            cbs[eventname] = [];
        }else{
            cbList = cbs[eventname];
            if (!cbList) return this;
            cblength = cbList.length;
            for (var i = 0; i < cblength; i++) {
                if (callback === cbList[i]) {
                    cbList.splice(i, 1);
                    break;
                }
            }
        }
    }

    function fOnce(eventname,callback){
        function on(){
            this.removeListener(eventname,on);
            callback.apply(this,arguments);
        }
        this.on(eventname,on);
        return this;
    }
    function fEmit(eventname){
        var cbs = this._callbacks,cbList,i, l,
            args = Array.prototype.slice.call(arguments, 1);
        if(!cbs[eventname]) return this;
        cbList = cbs[eventname];
        if (cbList) {
            for (i = 0, l = cbList.length; i < l; i++) {
                cbList[i].apply(this,args);
            }
        }
    }

    function fWhen(){
        var events,callback,i,l,that,argsLength;
        argsLength = arguments.length;
        events = Array.prototype.slice.apply(arguments, [0, argsLength - 1]);
        callback = arguments[argsLength - 1];
        if (typeof callback !== "function") {
            return this;
        }
        that = this;
        l = events.length;

        function _isOk(){
            var data = [];
            var isok = true;
            for (var i = 0; i < l; i++) {
                if(!that._fired.hasOwnProperty(events[i]) || !that._fired[events[i]].hasOwnProperty("data")){
                    isok = false;
                    break;
                }
                var d = that._fired[events[i]].data;
                data.push(d);
            }

            if(isok) {
                callback.apply(null, [data]);
                that._fired = {};
                isok = false;
            }
        }
        var _bind =function(key){
            that["addListener"](key, function(data){
                that._fired[key] = that._fired[key] || {};
                that._fired[key].data = data;
                _isOk();
            })
        };
        for(i=0;i<l;i++){
            _bind(events[i]);
        }
        return this;
    }
    /**
     * Return array of callbacks for `eventname`.
     *
     * @param {String} eventname
     * @return {Array}
     * @api public
     */
    function fListeners(eventname){
        return this._callbacks[eventname] || [];
    }
})();
