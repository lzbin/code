function isType(obj,type){
    var types = type.replace(/\b(\w)|\s(\w)/g, function(m) {
        return m.toLowerCase();
    });
    return Object.prototype.toString.call(obj).toLowerCase() === "[object " + types + "]";
}