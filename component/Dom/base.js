/**
 * Created by zhenbin on 2016/2/16 0016.
 */
/**
 * 查找dom
 * @ignore
 */


function css(obj, attr, value) {
    switch (arguments.length) {
        case 2:
            if (typeof arguments[1] == "object") {
                for (var i in attr) obj.style[i] = attr[i]
            }
            else {
                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
            }
            break;
        case 3:
            obj.style[attr] = value;
            break;
        default:
            return "";
    }
}

function getId(id){
    return document.getElementById(id);
}

function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    var sp = !obj.className ? '' : ' ';
    if (!this.hasClass(obj, cls)) obj.className += sp + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, '');
    }
}