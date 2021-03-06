(function (context) {
    var _$ = function (selector) {
        return new _$.prototype.Init(selector);
    };
    _$.prototype = {
        Init: function () {
            var arr = Array.prototype.slice.call(arguments);
            if (arr.length > 0)
            {
                if (typeof arr[0] == "string") {
                    this.element = document.getElementById(arr[0]);
                }
                else if (Object.prototype.toString.call(arr[0])=="object Object") {
                    this.element = arr[0];
                }
            }

        },
        bind: function (type, fn) {
            if (this.element) {
                if (document.addEventListener) {
                    this.element.addEventListener(type, fn, false);
                }
                else if (document.attachEvent) {
                    this.element.attachEvent('on' + type, fn);
                }
                else {
                    this.element['on' + type] = fn;
                }
            }
        },
        unbind: function (type, fn) {
            if (this.element) {
                if (document.removeEventListener) {
                    this.element.removeEventListener(type, fn, false);
                }
                else if (document.attachEvent) {
                    this.element.detachEvent('on' + type, fn);
                }
                else {
                    this.element['on' + type] = null;
                }
            }
        },
        one: function (type, fn) {
            var self = this;
            if (this.element) {
                if (document.addEventListener) {
                    this.element.addEventListener(type, function () {
                        self.element.removeEventListener(type, arguments.callee, false);
                        fn();
                    }, false);
                }
                else if (document.attachEvent) {
                    this.element.attachEvent('on' + type, function () {
                        self.element.detachEvent('on' + type, arguments.callee);
                        fn();
                    });
                }
                else {
                    this.element['on' + type] = function () {
                        self.element['on' + type] = null;
                        fn();
                    };
                }
            }

        },
        live: function (type, fn) {
            var self = this;
            if (document.addEventListener) {
                document.addEventListener(type, function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.id == self.element.id) {
                        fn();
                    }
                }, false);
            }
            else if (document.attachEvent) {
                document.attachEvent('on' + type, function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.id == self.element.id) {
                        fn();
                    }
                });
            }
            else {
                document['on' + type] = function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.id == self.element.id) {
                        document['on' + type] = null;
                        fn();
                    }
                };
            }
        },
        delegate: function (flag, type, fn) {
            var self = this;
            if (document.addEventListener) {
                self.element.addEventListener(type, function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.tagName.toLowerCase() == flag) {
                        fn();
                    }
                }, false);
            }
            else if (document.attachEvent) {
                self.element.attachEvent('on' + type, function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.tagName.toLowerCase() == flag) {
                        fn();
                    }
                });
            }
            else {
                self.element['on' + type] = function (e) {
                    var evt = e || window.event;
                    var target = evt.srcElement || evt.target;
                    if (target.tagName.toLowerCase() == flag) {
                        fn();
                    }
                };
            }



        }

    }
    _$.prototype.Init.prototype = _$.prototype;

    context.$ = _$;
})(window);