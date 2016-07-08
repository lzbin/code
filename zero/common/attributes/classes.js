var getClass = function(ele){
    return ele.className.replace(/\s+/," ").split(" ");
};
var hasClass = function(ele,cls){
    return -1 < (" " + ele.className + " ").indexOf(" "+ cls + " ");
};
var addClass = function(ele,cls){
    if(!this.hasClass(ele,cls))
        ele.className += " " + cls;
};

var rmoveClass = function(ele,cls){
    if(hasClass(ele,cls)){
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, " ");
    }
};

var clearClass = function(ele,cls){
    ele.className = "";
};