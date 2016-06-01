/**
 * Created by zhenbin on 2016/1/22 0022.
 */
var Observer = function(){
    this._callbacks = {};
    this._fired = {};
};
Observer.prototype = {
    addListener : function(eventname, callback) {
        this._callbacks[eventname] = this._callbacks[eventname] || [];
        this._callbacks[eventname].push(callback);
        return this;
    },
    removeListener : function(eventname,callback){
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
    },
    fire : function(eventname,data){
        var cbs = this._callbacks,cbList,i,l;
        if(!cbs[eventname]) return this;
        cbList = cbs[eventname];
        if (cbList) {
            for (i = 0, l = cbList.length; i < l; i++) {
                cbList[i].apply(this,Array.prototype.slice.call(arguments, 1));

            }

        }
    },
    when : function(){
        var events,callback,i,l,that,argsLength;
        argsLength = arguments.length;
        events = Array.prototype.slice.apply(arguments, [0, argsLength - 1]);
        callback = arguments[argsLength - 1];
        if (typeof callback !== "function") {
            return this;
        }
        that = this;
        l = events.length;
        var _isOk = function(){
            var data = [];
            var isok = true;
            for (var i = 0; i < l; i++) {

                if(!that._fired.hasOwnProperty(events[i])||!that._fired[events[i]].hasOwnProperty("data")){
                    isok = false;
                    break;
                }
                var d = that._fired[events[i]].data;
                data.push(d);
            }
            if(isok) callback.apply(null, [data]);

        };
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
};
