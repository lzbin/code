(function (oRoot, fFactory) {
    if (typeof define == 'function' && define.amd) {
        define(fFactory);
    } else {
        oRoot.pro = fFactory();
    }
})(window, function () {
    /* pro对象 */
    var pro = {
        version: '2.0.0', // 版本号
        $: fProDollar, // 通过id查找dom
        addEvent: fProAddEvent, // 监听dom事件
        removeEvent: fProRemoveEvent, // 取消监听dom事件
        addClass: fProAddClass, // 增加class
        removeClass: fProRemoveClass, // 删除class
        getTemplate: fProGetTemplate, // 通过id获得模板
        template: fProTemplate, // 模板生成html
        delay: fProDelay, // 延迟执行
        is: fProIs, // 判断类型
        mix: fProMix, // 合并对象
        bind: fProBind, // 绑定函数
        clone: fProClone, // 复制对象
        cancelBubble: fProCancelBubble, // 阻止事件冒泡
        insertCss: fProInsertCss, // 插入css代码
        contains: fProContains, // 判断dom是否包含另一个dom
        browser: fProBrowser, // 判断浏览器
        ajax: fProAjax, // ajax请求
        Base: fBaseConstructor, // base类
        // Mustache: fProMustache(), // Mustache
        Simplate: fProSimplate(),
        __inactiveViews: [], // 未激活view对象数组

        // 常量
        CLICK: 'click',
        MOUSE_DOWN: 'mousedown',
        MOUSE_UP: 'mouseup',
        KEY_DOWN: 'keydown',
        KEY_UP: 'keyup',
        KEY_PRESS: 'keypress',
        PREVENT: false,
        BREAK: false,
        CONTINUE: true
    };

    /**
     * @class pro.Base
     * 基类
     */
    var Base = pro.Base;
    var oBaseDef = Base.__definition = {
        /**
         * @constructor
         */
        constructor: fBaseConstructor,
        statics: {
            /**
             * @property {Object} listeners 默认监听器，实例化时做事件监听
             * @static
             */
            listeners: null,
            /**
             * @method extend
             * 继承
             * @static
             * @param {Object} oDef 子类定义
             * @param {Function} oDef.constructor 子类构造函数
             * @param {Object} oDef.statics 子类静态成员
             * @param {Object} oDef.members 子类实例成员
             * @param {Object} oDef.overrides 覆盖父类的成员，自动匹配静态或实例成员
             * @return {Class} 子类
             */
            extend: fBaseExtendStatic,
            /**
             * @method merge
             * @static
             */
            merge: fBaseMergeStatic,
            /**
             * @method callSuper
             * 执行父类静态方法
             * @static
             * @param {String} [sMethod="constructor"] 方法名
             * @param {Mixed...} 参数
             * @return {Mixed} 父类方法的返回值
             */
            callSuper: fBaseCallSuperStatic,
            /**
             * @method applySuper
             * 执行父类静态方法
             * @static
             * @param {String} [sMethod="constructor"] 方法名
             * @param {Array} [aArgs] 参数
             * @return {Mixed} 父类方法的返回值
             */
            applySuper: fBaseApplySuperStatic,
            _execSuper: fBaseExecSuperStaticProtected,
            __constructor: fBaseConstructor,
            __id: 0
        },
        members: {
            /**
             * @property {Class} Class
             * 该实例的类
             */
            Class: null,
            /**
             * @method callSuper
             * 执行父类实例方法
             * @param {String} [sMethod="constructor"] 方法名
             * @param {Mixed...} 参数
             * @return {Mixed} 父类方法的返回值
             */
            callSuper: fBaseCallSuper,
            /**
             * @method applySuper
             * 执行父类实例方法
             * @param {String} [sMethod="constructor"] 方法名
             * @param {Array} [aArgs] 参数
             * @return {Mixed} 父类方法的返回值
             */
            applySuper: fBaseApplySuper,
            /**
             * @method include
             * 增加子对象
             * @param {pro.Base} oChild 子对象
             * @param {Number} nIndex 添加到子对象列表中的位置
             * @return {pro.Base} this
             */
            include: fBaseInclude,
            /**
             * @method exclude
             * 移除子对象
             * @param {pro.Base} oChild 子对象
             * @return {pro.Base} this
             */
            exclude: fBaseExclude,
            /**
             * @method join
             * 添加到父对象中
             * @param {pro.Base} oParent 父对象
             * @param {Number} nIndex 位置
             * @return {pro.Base} this
             */
            join: fBaseJoin,
            /**
             * @method quit
             * 从父对象移除
             * @param {pro.Base} oParent 父对象
             * @return {pro.Base} this
             */
            quit: fBaseQuit,
            /**
             * @method each
             * 遍历子对象
             * @param {Function} fFunc 遍历回调函数
             * @param {pro.Base} fFunc.oChild 子对象
             * @param {Number} fFunc.nIndex 索引值
             * @return {pro.Base} this
             */
            each: fBaseEach,
            /**
             * @method eachParent
             * 遍历父对象
             * @param {Function} fFunc 遍历回调函数
             * @param {pro.Base} fFunc.oParent 父对象
             * @param {Number} fFunc.nIndex 索引值
             * @return {pro.Base} this
             */
            eachParent: fBaseEachParent,
            /**
             * @method isParent
             * 是否是某个对象的父对象
             * @param {pro.Base} oChild 对象
             * @return {Boolean}
             */
            isParent: fBaseIsParent,
            /**
             * @method isChild
             * 是否是某个对象的子对象
             * @param {pro.Base} oParent 对象
             * @return {Boolean}
             */
            isChild: fBaseIsChild,
            /**
             * @method listen
             * 监听事件
             * @param {pro.Base} [oObj=this] 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             */
            listen: fBaseListen,
            /**
             * @method listenTo
             * 监听某个对象的事件
             * @param {pro.Base} oObj 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             * @deprecated
             */
            listenTo: fBaseListenTo,
            /**
             * @method unlisten
             * 停止监听事件
             * @param {pro.Base} [oObj=this] 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             */
            unlisten: fBaseUnlisten,
            /**
             * @method unlistenTo
             * 停止监听某个对象的事件
             * @param {pro.Base} oObj 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             * @deprecated
             */
            unlistenTo: fBaseUnlistenTo,
            /**
             * @method listenOnce
             * 监听一次事件
             * @param {pro.Base} [oObj=this] 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             */
            listenOnce: fBaseListenOnce,
            /**
             * @method listenOnceTo
             * 监听某个对象的事件一次
             * @param {pro.Base} oObj 监听对象
             * @param {String} sName 事件名称
             * @param {Function} fHandler 事件处理函数
             * @return {pro.Base} this
             * @deprecated
             */
            listenOnceTo: fBaseListenOnceTo,
            /**
             * @method trigger
             * 触发事件
             * @param {String} sName
             * @param {Mixed...} 事件传递参数
             */
            fire: fBaseTrigger, // 兼容fire
            trigger: fBaseTrigger,
            /**
             * @method silently
             * 不触发事件的执行
             * @param {Function} fDo 执行函数
             * @return {Mixed} fDo函数的返回值
             * @deprecated
             */
            silently: fBaseSilently,
            /**
             * @method disable
             * 禁用
             * @return {pro.Base} this
             */
            disable: fBaseDisable,
            /**
             * @method enable
             * 可用
             * @return {pro.Base} this
             */
            enable: fBaseEnable,
            /**
             * @method destroy
             * 销毁对象
             */
            destroy: fBaseDestroy,
            /**
             * @method destroyChildren
             * 销毁所有子对象
             * @return {pro.Base} this
             */
            destroyChildren: fBaseDestroyChildren,
            /**
             * @method getParent
             * 获取父对象
             * @param {String/Number} [sId=最后一个父对象] 父对象id或索引值
             * @return {pro.Base} 父对象
             */
            getParent: fBaseGetParent,
            /**
             * @method getParentsCount
             * 获取父对象个数
             * @return {Number} 父对象个数
             */
            getParentsCount: fBaseGetParentsCount,
            /**
             * @method getChild
             * 获取子对象
             * @param {String/Number} sId 子对象id或索引值
             * @return {pro.Base}
             */
            getChild: fBaseGetChild,
            /**
             * @method getIndex
             * 获取索引值
             * @param {pro.Base} [oTarget] 子对象
             * @return {Number} 返回子对象索引值，如果不传参数则返回在父对象中的索引值
             */
            getIndex: fBaseGetIndex,
            /**
             * @method getChildrenCount
             * 获取子对象数量
             * @return {Number}
             */
            getChildrenCount: fBaseGetChildrenCount,
            /**
             * @method isDestroyed
             * 是否已销毁
             * @return {Boolean}
             */
            isDestroyed: fBaseIsDestroyed,
            _pro: pro.version,
            _type: 'base'
        }
    };
    pro.mix(Base, oBaseDef.statics);
    pro.mix(Base.prototype, oBaseDef.members);
    Base.__inherit = {};
    Base.prototype.__inherit = {};
    for (var s in oBaseDef.statics) {
        var f = oBaseDef.statics[s];
        if (typeof f == 'function') {
            Base.__inherit[s] = 0;
        }
    }
    for (var s in oBaseDef.members) {
        var f = oBaseDef.members[s];
        if (typeof f == 'function') {
            Base.prototype.__inherit[s] = 0;
        }
    }

    /**
     * @class pro.Model
     * 数据模型类
     * @extends pro.Base
     */
    var Model = pro.Model = Base.extend({
        /**
         * @constructor
         * @param {Object} oData 数据键值对
         * @param {Object} oValidators 数据验证
         */
        constructor: fModelConstructor,
        statics: {
            /**
             * @property {Object} apis 接口定义
             * @static
             */
            apis: {},
            /**
             * @property {Object} data 默认数据
             * @static
             */
            data: {},
            /**
             * @property {Object} validators 数据验证
             * @static
             */
            validators: {},
            /**
             * @method from
             * @param {Object} oData 键值对对象
             * @return {pro.Model} model对象
             * @static
             */
            from: fModelFromStatic
        },
        members: {
            /**
             * @method reset
             * 恢复默认数据
             * @param {String} [sKey] 字段名，默认恢复全部数据
             * @return {pro.Base} this
             */
            reset: fModelReset,
            /**
             * @method destroy
             * 销毁对象
             */
            destroy: fModelDestroy,
            /**
             * @method validate
             * 验证数据
             * @param {Object} [oKeyValues] 要验证的数据键值对，默认验证已保存的所有数据
             * @param {String} [sKey] 要验证的字段
             * @param {Mixed} [oValue] 要验证的数据
             * @return {Boolean}
             */
            validate: fModelValidate,
            /**
             * @method set
             * 设置数据
             * @param {Object} [oKeyValues] 数据键值对，如果不传则须传sKey和oValue
             * @param {String} [sKey] 字段名
             * @param {Mixed} [oValue] 数据
             * @return {Boolean} 是否设置成功
             */
            set: fModelSet,
            /**
             * @method get
             * 获取数据
             * @param {String} [sKey] 字段名，默认获取全部键值对
             * @return {Mixed}
             */
            get: fModelGet,
            /**
             * @method toData
             * 将model对象转换为键值对对象
             * @return {Object}
             */
            toData: fModelToData,
            /**
             * @method getRaw
             * 获取原始数据，和get的区别在于，get返回一份拷贝数据，getRaw返回未拷贝的原始数据引用
             * @param {String} [sKey] 字段名，默认获取全部原始数据
             * @return {Mixed}
             * @deprecated
             */
            getRaw: fModelGetRaw,
            /**
             * @method has
             * 是否有字段
             * @param {String} sKey 字段名
             * @return {Boolean}
             */
            has: fModelHas,
            /**
             * @method save
             * 验证并保存数据，验证失败则不保存
             * @param {Object} [oKeyValues] 数据键值对，如果不传则须传sKey和oValue
             * @param {String} [sKey] 字段名
             * @param {Mixed} [oValue] 数据
             * @return {Boolean}
             */
            save: fModelSave,
            /**
             * @method getNest
             * 获取嵌套的model或list
             * @param {String} [sKey] 字段名，如果不传则返回全部
             * @return {pro.Model/pro.List/Object}
             */
            getNest: fModelGetNest,
            /**
             * @method request
             * 发起请求
             * @param {Object} oConf 请求配置
             * @param {String} oConf.api 请求接口
             * @param {Object} [oConf.data] 请求数据
             * @param {Function} [oConf.success] 请求成功回调
             * @param {Function} [oConf.error] 请求失败回调
             * @param {Function} [oConf.complete] 请求完成回调
             */
            request: fModelRequest,

            _getApi: fModelGetApiProtected,
            _nest: {},
            _type: 'model'
        }
    });

    /**
     * @class pro.List
     * 数据列表类
     * @extends pro.Base
     */
    var List = pro.List = Base.extend({
        /**
         * @constructor
         * @param {pro.Model[]/Object[]} aList model数组或键值对数组
         * @param {Class} 默认model类
         */
        constructor: fListConstructor,
        statics: {
            /**
             * @property {Object} apis 接口定义
             * @static
             */
            apis: {},
            /**
             * @property {Class} Model 默认model类
             * @static
             */
            Model: null,
            /**
             * @method from
             * @param {Array} aArr 数组
             * @return {pro.List} list对象
             * @static
             */
            from: fListFromStatic
        },
        members: {
            /**
             * @method has
             * 是否有某个model对象
             * @param {pro.Model} oModel model对象
             * @return {Boolean}
             */
            has: fListHas,
            /**
             * @method find
             * 查找匹配的model
             * @param {pro.Model} oModel model对象
             * @return {pro.Model[]}
             */
            find: fListFind,
            /**
             * @method remove
             * 移除model
             * @param {pro.Model/Number} oModel 要移除的model或索引值
             * @return {pro.Model} 被移除的model
             */
            remove: fListRemove,
            /**
             * @method push
             * 增加数据到列表末尾
             * @param {pro.Model/pro.Model[]/Object/Object[]} oModel model对象或数组，或键值对对象或数组
             * @return {pro.Model} 增加的model
             */
            push: fListPush,
            /**
             * @method unshift
             * 增加数据到列表头部
             * @param {pro.Model/pro.Model[]/Object/Object[]} oModel model对象或数组，或键值对对象或数组
             * @return {pro.Model} 增加的model
             */
            unshift: fListUnshift,
            /**
             * @method pop
             * 移除列表中最后一个数据
             * @return {pro.Model} 移除的model
             */
            pop: fListPop,
            /**
             * @method shift
             * 移除列表中第一个数据
             * @return {pro.Model} 移除的model
             */
            shift: fListShift,
            /**
             * @method add
             * 增加一条或几条数据
             * @param {pro.Model/pro.Model[]/Object/Object[]} oModel model对象或数组，或键值对对象或数组
             * @param {Number} [nIndex=列表最后] 增加位置
             * @deprecated
             */
            add: fListInsert,
            /**
             * @method insert
             * 增加一条或几条数据
             * @param {pro.Model/pro.Model[]/Object/Object[]} oModel model对象或数组，或键值对对象或数组
             * @param {Number} [nIndex=列表最后] 增加位置
             * @return {pro.Model} 增加的model
             */
            insert: fListInsert,
            /**
             * @method sort
             * 列表排序
             * @param {Function} [fSort] 排序处理函数，和array.sort()类似
             * @param {pro.Model} fSort.oModel
             * @param {pro.Model} fSort.oNext
             * @return {pro.Base} this
             */
            sort: fListSort,
            /**
             * @method reverse
             * 列表反序
             * @return {pro.Base} this
             */
            reverse: fListReverse,
            /**
             * @method set
             * 设置列表数据
             * @param {pro.Model[]/Object[]} model数组或键值对数组
             * @return {pro.Base} this
             */
            set: fListSet,
            /**
             * @method get
             * 获取model
             * @param {Number} [nIndex] 索引值，默认返回全部model数组
             * @return {pro.Model/pro.Model[]}
             */
            get: fListGet,
            /**
             * @method getCount
             * 获取列表数量
             * @return {Number}
             */
            getCount: fListGetCount,
            /**
             * @method clear
             * 清空列表数据
             * @return {pro.Base} this
             */
            clear: fListClear,
            /**
             * @method getData
             * 获取数据键值对
             * @param {Number} [nIndex] 索引值，默认返回全部键值对数组
             * @return {Object/Object[]}
             */
            getData: fListGetData,
            /**
             * @method toArray
             * 将list对象转换为数组
             * @return {Object[]}
             */
            toArray: fListToArray,
            /**
             * @method cut
             * 分离出另一个list
             * @param {Number} nIndex
             * @param {Number} nCount
             * @return {pro.List}
             */
            cut: fListCut,
            /**
             * @method merge
             * 合并另一个list
             * @param {pro.List} oList
             * @return {pro.Base} this
             */
            merge: fListMerge,
            /**
             * @method request
             * 发起请求
             * @param {Object} oConf 请求配置
             * @param {String} oConf.api 请求接口
             * @param {Object} [oConf.data] 请求数据
             * @param {Function} [oConf.success] 请求成功回调
             * @param {Function} [oConf.error] 请求失败回调
             * @param {Function} [oConf.complete] 请求完成回调
             */
            request: fModelRequest,

            _getApi: fModelGetApiProtected,
            _type: 'list'
        }
    });

    /**
     * @class pro.View
     * 视图类
     * @extends pro.Base
     */
    var View = pro.View = Base.extend({
        /**
         * @constructor
         * @param {Object} [oConf] 配置对象
         * @param {HTMLElement} [oConf.dom] 根节点
         * @param {String} [oConf.template] 模板
         * @param {Object} [oConf.data] 数据键值对
         * @param {pro.Model} [oConf.model] 数据源model
         * @param {Object} [oConf.listeners] 事件监听配置对象
         * @param {Boolean} [oConf.bind] 绑定数据和视图
         */
        constructor: fViewConstructor,
        statics: {
            /**
             * @property {String} template 默认模板
             * @static
             */
            template: '',
            /**
             * @property {Object} events 默认dom事件监听
             * @static
             */
            events: null,
            /**
             * @property {Object} doms 默认保存dom节点
             * @static
             */
            doms: null,
            /**
             * @property {Boolean} bind 绑定数据和视图
             * @static
             */
            bind: false,
            /**
             * @property {String/Function} css 需要动态插入的css，可以为css代码/url或函数返回css字符串
             * @static
             */
            css: null,
            /**
             * @property {Boolean} useBuffer
             * @static
             * 使用缓冲，适合需要连续addView的view
             */
            useBuffer: false,
            /**
             * @method activate
             * 将以getHtml方式生成的静态view激活，通常会自动调用此方法
             * @static
             */
            activate: fViewActivateStatic,
            /**
             * @method from
             * 以某个节点作为根节点创建view
             * @param {HTMLElement} oDom 根节点
             * @param {Object} [oConf] 配置对象，同构造函数参数
             * @return {pro.View}
             * @static
             */
            from: fViewFromStatic,
            /**
             * @method parse
             * 将页面中的html作为模板创建view
             * @param {HTMLElement} oDom 模板根节点
             * @param {Object} [oConf] 配置对象，同构造函数参数
             * @return {pro.View}
             * @static
             */
            parse: fViewParseStatic,
            /**
             * @method fill
             * 模板填充数据，默认使用Simplate模板引擎
             * @param {String} sTemplate 模板
             * @param {Object} oData 数据键值对
             * @static
             */
            fill: pro.template,
            __id: 0 // 用来生成dom id的自增id
        },
        members: {
            /**
             * @method isCreated
             * 是否已生成dom
             * @return {Boolean}
             */
            isCreated: fViewIsCreated,
            /**
             * @method isRendered
             * 是否已渲染
             * @return {Boolean}
             */
            isRendered: fViewIsRendered,
            /**
             * @method update
             * 使用新数据更新dom
             * @param {Object} [oConf] 配置对象，或数据键值对
             * @return {pro.Base} this
             */
            update: fViewUpdate,
            /**
             * @method create
             * 生成dom，通常会自动调用此方法
             * @param {Boolean} [bHtml=false] 只生成html
             * @return {HTMLElement/String} bHtml为true时返回html字符串
             */
            create: fViewCreate,
            /**
             * @method getHtml
             * 获取html
             * @param {Boolean} [bUpdate=false] 重新生成字符串，默认返回已生成的html字符串
             * @return {String}
             */
            getHtml: fViewGetHtml,
            /**
             * @method getDom
             * 获取dom
             * @return {HTMLElement}
             */
            getDom: fViewGetDom,
            /**
             * @method activate
             * 将以getHtml方式生成的静态view激活，通常会自动调用此方法
             * @param {HTMLElement} [oDom]
             * @return {pro.Base} this
             */
            activate: fViewActivate,
            /**
             * @method render
             * 渲染view到某个节点内
             * @param {HTMLElement} oDom 节点
             * @return {pro.Base} this
             */
            render: fViewRender,
            /**
             * @method listenDoms
             * 监听dom事件
             * @param {Object} oEvents 事件监听配置对象
             * @return {pro.Base} this
             */
            listenDoms: fViewListenDoms,
            /**
             * @method find
             * 查找匹配的dom
             * @param {String} sQuery 节点选择器
             * @return {HTMLElement}
             */
            find: fViewFind,
            /**
             * @method findAll
             * 查找全部匹配的dom
             * @param {String} sQuery 节点选择器
             * @return {HTMLElement[]}
             */
            findAll: fViewFindAll,
            /**
             * @method flush
             * 渲染缓冲区中的内容，通常会自动调用此方法
             * @return {pro.Base} this
             */
            flush: fViewFlush,
            /**
             * @method getBuffer
             * 获取缓冲区内容，通常会自动调用此方法
             * @return {HTMLElement}
             */
            getBuffer: fViewGetBuffer,
            /**
             * @method clearBuffer
             * 清空缓冲区内容，通常会自动调用此方法
             * @return {HTMLElement} 返回空的缓冲区内容
             */
            clearBuffer: fViewClearBuffer,
            /**
             * @method renderBefore
             * 渲染view到某个节点前
             * @param {HTMLElement} oDom 节点
             * @return {pro.Base} this
             */
            renderBefore: fViewRenderBefore,
            /**
             * @method renderAfter
             * 渲染view到某个节点后
             * @param {HTMLElement} oDom 节点
             * @return {pro.Base} this
             */
            renderAfter: fViewRenderAfter,
            /**
             * @method renderBy
             * 渲染view到某个节点上，替换节点
             * @param {HTMLElement} oDom 节点
             * @return {pro.Base} this
             */
            renderBy: fViewRenderBy,
            /**
             * @method show
             * 显示
             * @return {pro.Base} this
             */
            show: fViewShow,
            /**
             * @method hide
             * 隐藏
             * @return {pro.Base} this
             */
            hide: fViewHide,
            /**
             * @method addClass
             * 增加css class
             * @param {String} sClass className
             * @param {String} [sQuery=根节点] 节点选择器
             */
            addClass: fViewAddClass,
            /**
             * @method removeClass
             * 移除class
             * @param {String} sClass className
             * @param {String} [sQuery=根节点] 节点选择器
             */
            removeClass: fViewRemoveClass,
            /**
             * @method destroy
             * 销毁view对象
             */
            destroy: fViewDestroy,
            /**
             * @method addView
             * 增加子视图
             * @param {pro.View} oView 子视图
             * @param {Number} nIndex 位置
             * @return {pro.Base} this
             */
            addView: fViewAddView,
            /**
             * @method getData
             * 获取view使用的数据
             * @param {String} sKey 字段名，如果不传则返回全部键值对对象
             * @return {Mixed}
             */
            getData: fViewGetData,
            _type: 'view'
        }
    });

    /**
     * @class pro.AdapterView
     * 列表视图类
     * @extends pro.View
     */
    var AdapterView = pro.AdapterView = View.extend({
        /**
         * @constructor
         * @param {Object} oConf 配置对象
         * @param {pro.List} oConf.list 数据源
         * @param {Boolean} [oConf.bind] 绑定数据，动态更新view
         */
        constructor: fAdapterViewConstructor,
        overrides: {
            /**
             * @property {Boolean} useBuffer
             * 使用缓冲
             */
            // useBuffer: true
        },
        statics: {
            /**
             * @property {Boolean} bind 绑定数据和视图
             * @static
             */
            bind: false
        },
        members: {
            /**
             * @method adapter
             * 适配器
             * @abstract
             * @param {pro.Model} oModel 当前项的数据模型
             * @param {Number} nIndex 当前项的位置
             * @return {pro.View} 当前项的view
             */
            adapter: null,
            __init: fAdapterViewInitPrivate
        }
    });

    /**
     * @class pro.Broadcast
     * 广播静态类
     * @static
     */
    var Broadcast = pro.Broadcast = {};
    /**
     * @method receive 监听广播
     * @param {String} sName 广播名
     * @param {Function} fHandler 事件处理函数
     * @static
     */
    Broadcast.receive = fBroadcastReceiveStatic;
    /**
     * @method unreceive 取消监听广播
     * @param {String} sName 广播名
     * @param {Function} fHandler 事件处理函数，需要和receive时传入的是同一个function引用
     * @static
     */
    Broadcast.unreceive = fBroadcastUnreceiveStatic;
    /**
     * @method send 发送广播
     * @param {String} sName 广播名
     * @param {Mixed...} 广播参数
     * @static
     */
    Broadcast.send = fBroadcastSendStatic;
    Broadcast._getInstance = fBroadcastGetInstanceStaticProtected;

    /**
     * 发送广播
     * @ignore
     */
    function fBroadcastSendStatic(sName) {
        var obj = this._getInstance();
        var aArgs = [sName];
        for (var i = 1, l = arguments.length; i < l; i++) {
            aArgs.push(arguments[i]);
        }
        return obj.trigger.apply(obj, aArgs);
    }

    /**
     * 接收广播
     * @ignore
     */
    function fBroadcastReceiveStatic(sName, fHandler) {
        var obj = this._getInstance();
        return obj.listen(sName, fHandler);
    }

    /**
     * 取消接收广播
     * @ignore
     */
    function fBroadcastUnreceiveStatic(sName, fHandler){
        var obj = this._getInstance();
        return obj.unlisten(sName, fHandler);
    }

    /**
     * 获取实例
     * @ignore
     */
    function fBroadcastGetInstanceStaticProtected() {
        this.__instance = this.__instance || new pro.Base();
        return this.__instance;
    }

    /**
     * Base类构造函数
     * @ignore
     */
    function fBaseConstructor() {
        var Class = this.constructor;
        this.__listeners = {};
        this.id = (pro.Base.__id++) + '';

        var oListeners = Class.listeners;
        for (var s in oListeners) {
            var oListener = oListeners[s];
            this.listen(s, oListener);
        }
    }

    /**
     * call方式执行父类静态方法
     * @ignore
     */
    function fBaseCallSuperStatic(sMethod) {
        var aArgs = [];
        var i = 1;
        var s = sMethod;
        if (typeof s != 'string') {
            s = 'constructor';
            i = 0;
        }
        for (l = arguments.length; i < l; i++) {
            aArgs.push(arguments[i]);
        }
        return this._execSuper(s, aArgs);
    }

    /**
     * apply方式执行父类静态方法
     * @ignore
     */
    function fBaseApplySuperStatic(sMethod, aArgs) {
        if (typeof sMethod != 'string') {
            aArgs = sMethod;
            sMethod = 'constructor';
        }
        return this._execSuper(sMethod, aArgs);
    }

    /**
     * call方式执行父类方法
     * @ignore
     */
    function fBaseCallSuper(sMethod) {
        var aArgs = [];
        var i = 1;
        var s = sMethod;
        if (typeof s != 'string') {
            s = 'constructor';
            i = 0;
        }
        for (l = arguments.length; i < l; i++) {
            aArgs.push(arguments[i]);
        }
        return this.Class._execSuper(s, aArgs, this);
    }

    /**
     * apply方式执行父类方法
     * @ignore
     */
    function fBaseApplySuper(sMethod, aArgs) {
        // 不传方法名时执行构造函数
        if (typeof sMethod != 'string') {
            aArgs = sMethod;
            sMethod = 'constructor';
        }
        return this.Class._execSuper(sMethod, aArgs, this);
    }

    /**
     * 执行父类方法
     * @ignore
     */
    function fBaseExecSuperStaticProtected(sMethod, aArgs, oInstance) {
        var Class = oInstance ? oInstance.Class : this;
        var sConstructor = 'constructor';

        // 构造函数特殊处理
        if (sMethod == sConstructor) {
            sMethod = sConstructor = '__' + sConstructor;
        }


        var oInherit = oInstance && sMethod != sConstructor ? oInstance.__inherit : Class.__inherit;

        var nInheritLevel = oInherit[sMethod];

        nInheritLevel = nInheritLevel > 0 ? nInheritLevel : 0;

        this.__calledSuper = this.__calledSuper || 0;

        var Super = Class;
        var nMax = this.__calledSuper + nInheritLevel;

        // if (nMax == 0) {
        //    Super = Super.__super;
        // } else {
        while (Super.__super && nMax >= 0) {
            Super = Super.__super;
            nMax--;
        }
        // }

        this.__calledSuper++;

        var fMethod = oInstance && sMethod != sConstructor ? Super.prototype[sMethod] : Super[sMethod];
        var oReturn = fMethod && fMethod.apply(oInstance || this, aArgs);

        delete this.__calledSuper;

        return oReturn;
    }

    /**
     * 是否已销毁
     * @ignore
     */
    function fBaseIsDestroyed() {
        return false;
    }

    /**
     * 是否是父对象
     * @ignore
     */
    function fBaseIsParent(oChild) {
        if (oChild) {
            return !!(this.child && this.child[oChild.id]);
        } else {
            return this.getChildrenCount() == 0;
        }
    }

    /**
     * 获取父对象
     * @ignore
     */
    function fBaseGetParent(sId) {
        if (typeof sId == 'string' && this.parent) {
            return this.parent[sId];
        } else if (this.parents) {
            var n = this.parents.length - 1;
            return this.parents[sId || n];
        }
    }

    /**
     * 获取父对象数量
     * @ignore
     */
    function fBaseGetParentsCount() {
        return this.parents ? this.parents.length : 0;
    }


    /**
     * 是否是子对象
     * @ignore
     */
    function fBaseIsChild(oParent) {
        if (oParent) {
            return !!(this.parent && this.parent[oParent.id]);
        } else {
            return this.getParentsCount() == 0;
        }
    }

    /**
     * 获取子对象
     * @ignore
     */
    function fBaseGetChild(sId) {
        if (typeof sId == 'string') {
            return this.child && this.child[sId];
        } else {
            return this.children && this.children[sId];
        }
    }

    /**
     * 获取子对象数量
     * @ignore
     */
    function fBaseGetChildrenCount() {
        return this.children ? this.children.length : 0;
    }

    /**
     * 获取子对象索引
     * @ignore
     */
    function fBaseGetIndex(oTarget) {
        var nIndex = -1;
        if (oTarget) {
            this.each(function (o, n) {
                if (oTarget === o) {
                    nIndex = n;
                    return false;
                }
            });
        } else if (this.getParent()) {
            var that = this;
            this.getParent().each(function (o, n) {
                if (that === o) {
                    nIndex = n;
                    return false;
                }
            });
        }
        return nIndex;
    }

    /**
     * 不触发自身事件的执行
     * @ignore
     */
    function fBaseSilently(fDo) {
        var oReturn;
        this.silent = true;
        if (fDo) {
            oReturn = fDo.call(this);
        }
        this.silent = false;
        return oReturn;
    }

    /**
     * 禁用
     * @ignore
     */
    function fBaseDisable() {
        if (!this.__disabled) {
            this.trigger('!!disable');
        }
        this.__disabled = true;
        return this;
    }

    /**
     * 恢复
     * @ignore
     */
    function fBaseEnable() {
        var bFire = this.__disabled;
        this.__disabled = false;
        if (bFire) {
            this.trigger('!!enable');
        }
        return this;
    }

    /**
     * 遍历子对象
     * @ignore
     */
    function fBaseEach(fFunc, bParent) {
        var arr = bParent ? this.parents : this.children;
        if (arr) {
            for (var i = 0, l = arr.length; i < l; i++) {
                var oReturn = fFunc.call(this, arr[i], i);
                if (oReturn === pro.BREAK) {
                    break;
                } else if (typeof oReturn == 'number') {
                    // 如果返回一个数值，则改变当前的索引值
                    l = arr.length;
                    i += oReturn;
                } else if (arr.length != l) {
                    // 如果长度减小则重新遍历
                    l = arr.length;
                    i--;
                    continue;
                }
            }
        }
        return this;
    }

    /**
     * 遍历父对象
     * @ignore
     */
    function fBaseEachParent(fFunc) {
        return this.each(fFunc, true);
    }

    /**
     * 增加子对象
     * @ignore
     */
    function fBaseInclude(oChild, nIndex) {
        oChild && oChild.join(this, nIndex);
        return this;
    }

    /**
     * 删除子对象
     * @ignore
     */
    function fBaseExclude(oChild) {
        if (oChild) {
            oChild.quit(this);
        } else {
            while (this.children && this.children.length > 0) {
                this.children.pop().quit(this);
            }
        }
        return this;
    }

    /**
     * 不作为某对象的子对象
     * @ignore
     */
    function fBaseQuit(oParent) {

        var bEach = oParent == undefined;

        if (bEach) {
            while (this.parents && this.parents.length > 0) {
                __fQuit.call(this, this.parents.pop());
            }
        } else {
            oParent = this.parent && this.parent[oParent.id];
            if (oParent) {
                __fQuit.call(this, oParent);
            }
        }

        return this;

        function __fQuit(oParent) {
            var nChildIndex = 0;
            if (oParent.children) {
                for (var i = 0; i < oParent.children.length; i++) {
                    if (this === oParent.children[i]) {
                        nChildIndex = i;
                        oParent.children[i] = null;
                        oParent.children.splice(i, 1);
                        break;
                    }
                }
                oParent.child[this.id] = null;
                delete oParent.child[this.id];
            }
            this.parent[oParent.id] = null;
            delete this.parent[oParent.id];

            for (var i = 0; i < this.parents.length; i++) {
                if (oParent === this.parents[i]) {
                    this.parents[i] = null;
                    this.parents.splice(i, 1);
                    break;
                }
            }

            this.trigger('!!quit', oParent);
            oParent.trigger('!!childrenchange', nChildIndex, this);
            oParent.trigger('!!exclude', nChildIndex, this);
        }

    }

    /**
     * 作为某对象的子对象
     * @ignore
     */
    function fBaseJoin(oParent, nIndex) {

        // 引用父级对象
        this.parent = this.parent || {};
        this.parents = this.parents || [];

        // 保存到父级对象
        oParent.child = oParent.child || {};
        oParent.children = oParent.children || [];

        var bUnshift = nIndex <= 0;
        var bInsert = !!(nIndex && oParent.children[nIndex]);
        var bPush = !bUnshift && !bInsert;

        // 检查是否重复join
        if (!(oParent.id in this.parent)) {

            this.parent[oParent.id] = oParent;
            this.parents.push(oParent);
            oParent.child[this.id] = this;

            if (bPush) {
                oParent.children.push(this);
                nIndex = oParent.children.length - 1;
            } else if (bUnshift) {
                oParent.children.unshift(this);
                nIndex = 0;
            } else if (bInsert) {
                var tmp = oParent.children.splice(nIndex);
                oParent.children.push(this);
                oParent.children = oParent.children.concat(tmp);
            }

            this.trigger('!!join', oParent, nIndex);
            oParent.trigger('!!childrenchange', nIndex, this);
            oParent.trigger('!!include', nIndex, this);
        }

        return this;
    }

    /**
     * 监听一次事件
     * @ignore
     */
    function fBaseListenOnce(sName, fHandler, oObserver) {
        if (typeof arguments[0] == 'object') {
            return this.listenOnceTo.apply(this, arguments);
        } else {
            return this.listen(sName, function () {
                this.unlisten(sName, arguments.callee);
                fHandler && fHandler.apply(this, arguments);
            }, oObserver);
        }
    }

    /**
     * 监听某个对象的一次事件
     * @ignore
     */
    function fBaseListenOnceTo(oObj, sName, fHandler) {
        return this.listenTo(oObj, sName, function () {
            this.unlistenTo(oObj, sName, arguments.callee);
            fHandler && fHandler.apply(this, arguments);
        });
    }

    /**
     * 监听事件
     * @ignore
     */
    function fBaseListen(sName, fHandler, oObserver) {

        var oFirstArg = arguments[0];

        if (typeof oFirstArg == 'undefined') {
            return this;
        } else if (typeof oFirstArg == 'object') {
            // 如果第一个参数是对象，监听对象的事件
            this.listenTo.apply(this, arguments);
            return this;
        } else if (sName.indexOf(',') >= 0) {
            // 事件名包含逗号，监听多个事件
            sName = sName.replace(/\s/g, '');
            var aNames = sName.split(',');
            for (var i = 0, l = aNames.length; i < l; i++) {
                this.listen(aNames[i], fHandler, oObserver);
            }
            return this;
        } else if (!fHandler) {
            return this;
        }

        this.__listeners = this.__listeners || {};

        var aListeners = this.__listeners[sName] = this.__listeners[sName] || [];

        // 检查有无重复监听
        for (var i = 0; i < aListeners.length; i++) {
            if (aListeners[i] === fHandler) {
                return this;
            }
        }

        this.__listeners[sName].push({
            handler: fHandler,
            observer: oObserver
        });
        return this;
    }

    /**
     * 监听某对象事件
     * @ignore
     */
    function fBaseListenTo(oObj, sName, fHandler) {
        if (oObj) {
            oObj.listen(sName, fHandler, this);
        }
        return this;
    }

    /**
     * 取消监听事件
     * @ignore
     */
    function fBaseUnlisten(sName, fHandler) {

        if (typeof arguments[0] == 'object') {
            this.unlistenTo.apply(this, arguments);
            return this;
        }

        var aListeners = (this.__listeners || {})[sName];
        if (aListeners && aListeners.length > 0) {
            for (var i = 0; i < aListeners.length; i++) {
                var o = aListeners[i];
                if (o && fHandler === o.handler) {
                    aListeners[i] = null;
                }
            }
        }
        return this;
    }

    /**
     * 取消监听某对象事件
     * @ignore
     */
    function fBaseUnlistenTo(oObj, sName, fHandler) {
        if (oObj) {
            oObj.unlisten(sName, fHandler, oObj);
        }
        return this;
    }

    /**
     * 触发事件
     * @ignore
     */
    function fBaseTrigger(sName) {
        var bForce = sName.indexOf('!!') == 0; // 是否强制执行(!!render等)
        if (bForce) {
            sName = sName.substring(2);
        }

        // 静默和禁用状态
        if (this.silent || (this.__disabled && !bForce)) {
            return;
        }

        var Class = this.Class;
        var aListeners = (this.__listeners || {})[sName];
        var aArgs = [];
        var oReturn;

        for (var i = 1, l = arguments.length; i < l; i++) {
            aArgs.push(arguments[i]);
        }

        if (aListeners) { // listeners为空不执行
            for (var i = 0, l = aListeners.length; i < l; i++) {
                var oListener = aListeners[i];
                if (!oListener) { // 去掉空的listener
                    aListeners.splice(i, 1);
                    l = aListeners.length;
                    i--;
                } else {
                    var oObserver = oListener.observer || this;
                    if (oObserver.isDestroyed()) {
                        aListeners[i] = null;
                    } else {
                        oReturn = oListener.handler.apply(oObserver, aArgs);
                        if (oReturn === pro.PREVENT) {
                            break;
                        }
                    }
                }
            }
        }

        // 触发父对象事件
        aArgs.unshift(this);
        aArgs.unshift('@child:' + sName);
        this.eachParent(function (oParent) {
            //oParent.trigger('c:' + sName, this);
            oParent.trigger.apply(oParent, aArgs);
        });

        return oReturn;
    }

    /**
     * 销毁
     * @ignore
     */
    function fBaseDestroy() {

        this.quit();
        this.destroyChildren();

        for (var s in this) {
            this[s] = null;
            delete this[s];
        }

        this.isDestroyed = fBaseHasBeenDestroyed;
    }

    /**
     * 对象已销毁的统一函数
     * @ignore
     */
    function fBaseHasBeenDestroyed(){
        return true;
    }

    /**
     * 销毁子对象
     * @ignore
     */
    function fBaseDestroyChildren() {
        if (this.children) {
            while (this.children.length > 0) {
                var oChild = this.children.shift();
                if (oChild.getParentsCount() <= 1) {
                    oChild.destroy();
                } else {
                    oChild.quit(this);
                }
            }
        }
        return this;
    }

    /**
     * 继承
     * @ignore
     */
    function fBaseExtendStatic(oDef) {
        oDef = oDef || {};
        var fConstructor = oDef.propertyIsEnumerable('constructor') ? oDef['constructor'] : null;
        var oStatics = oDef.statics = oDef.statics || {};
        var oInstances = oDef.members = oDef.members || {};
        var oOverrides = oDef.overrides = oDef.overrides || {};
        var oMixes = oDef.mixes = oDef.mixes || {};
        var oConfig = oDef.config = oDef.config || {};

        var Super = this;
        var Sub = __fGetConstructor.call(Super);

        // 保存原始定义
        var oSubDef = Sub.__definition = pro.clone(oDef);
        var oSubDefStatics = oSubDef.statics;
        var oSubDefInstances = oSubDef.members;
        var oSuperDef = Super.__definition;
        var oSuperDefStatics = oSuperDef.statics;
        var oSuperDefInstances = oSuperDef.members;

        Sub.prototype.Class = Sub;

        // 记录继承的方法和属性
        var oStaticInherit = pro.clone(Super.__inherit);
        var oInherit = pro.clone(Super.prototype.__inherit);

        // 覆盖和混合
        for (var s in oOverrides) {
            if (s in oSuperDefStatics && !(s in oStatics)) {
                oStatics[s] = oOverrides[s];
            } else if (s in oSuperDefInstances && !(s in oInstances)) {
                oInstances[s] = oOverrides[s];
            }
        }
        for (var s in oMixes) {
            if (s in oSuperDefStatics && !(s in oStatics)) {
                var o = oStatics[s] = {};
                pro.mix(o, oSuperDefStatics[s]);
                pro.mix(o, oMixes[s]);
            } else if (s in oSuperDefInstances && !(s in oInstances)) {
                var o = oInstances[s] = {};
                pro.mix(o, oSuperDefStatics[s]);
                pro.mix(o, oMixes[s]);
            }
        }

        // 静态方法和属性
        for (var s in oSuperDefStatics) {
            Sub[s] = oSubDefStatics[s] = pro.clone(oSuperDefStatics[s]);
            if (typeof Sub[s] == 'function') {
                if (s in oStaticInherit) {
                    oStaticInherit[s]++;
                } else {
                    oStaticInherit[s] = 0;
                }
            }
        }
        if (oStatics) {
            for (var s in oStatics) {
                Sub[s] = oSubDefStatics[s] = oStatics[s];
                if (typeof Sub[s] == 'function') {
                    oStaticInherit[s] = 0;
                }
            }
        }

        // 实例方法和属性
        for (var s in oSuperDefInstances) {
            Sub.prototype[s] = oSubDefInstances[s] = pro.clone(oSuperDefInstances[s]);
            if (typeof Sub.prototype[s] == 'function') {
                if (s in oInherit) {
                    oInherit[s]++;
                } else {
                    oInherit[s] = 0;
                }
            }
        }

        for (var s in oInstances) {
            Sub.prototype[s] = oSubDefInstances[s] = oInstances[s];
            if (typeof Sub.prototype[s] == 'function') {
                oInherit[s] = 0;
            }
        }

        Sub.__inherit = oStaticInherit;
        Sub.prototype.__inherit = oInherit;

        // 构造函数
        Sub.__super = Super;
        Sub.__inherit['__constructor'] = 0;

        if (fConstructor) {
            Sub.__constructor = fConstructor;
        } else {
            Sub.__constructor = __fEmptyConstructor;//Super.__constructor;
        }

        return Sub;

        function __fGetConstructor() {
            return function Class() {
                var Class = this.Class = this.constructor;
                var fConstructor = Class.__constructor;
                for (var s in this) {
                    var o = this[s];
                    if (o && (o.constructor === Object || o.constructor === Array)) {
                        this[s] = pro.clone(o);
                    }
                }
                fConstructor && fConstructor.apply(this, arguments);
            };
        }
    }

    function __fEmptyConstructor() {
        this.applySuper(arguments);
    }

    /**
     * 合并类
     * @ignore
     */
    function fBaseMergeStatic() {
        for (var i = 0, l = arguments.length; i < l; i++) {
            var o = arguments[i];
            pro.mix(this, o.statics);
            pro.mix(this.prototype, o.members);
        }
        return this;
    }

    /**
     * Model类构造函数
     * @ignore
     */
    function fModelConstructor(oData, oValidators) {
        this.applySuper(arguments);

        var Class = this.Class;

        this.__data = {};

        // 数据验证
        this.__validators = oValidators || Class.validators;

        if (this.__validators) {
            this.__valid = {};
            this.listen('valid', function (sKey) {
                this.__valid[sKey] = true;
            });
            this.listen('invalid', function (sKey) {
                delete this.__valid[sKey];
            });
        }

        this.reset();

        if (oData) {
            this.set(oData);
        }
    }

    /**
     * 将键值对转换为model对象
     * @ignore
     */
    function fModelFromStatic(oData){
        return new this(oData);
    }

    /**
     * 恢复默认值
     * @ignore
     */
    function fModelReset(sKey) {
        if(this.__disabled){
            return undefined;
        }

        var oDefault = pro.clone(this.Class.data);
        if (oDefault) {

            for (var s in oDefault) {
                var o = oDefault[s];
                if(typeof o == 'function' && o.prototype._pro) {
                    if(this._nest[s]){
                        this._nest[s].destroy();
                    }
                    this._nest[s] = o = new o(); // 保存嵌套
                    this.listen(o, 'changes', pro.bind(function(s){ // 数据改变时更新
                        var o = this.getNest(s);
                        o.__nestSet = true;
                        this.set(s, o.getData ? o.getData() : o.get());
                        o.__nestSet = false;
                    }, this, s));

                    oDefault[s] = o.getData ? o.getData() : o.get();
                }
            }

            if (sKey) {
                if (sKey in oDefault) {
                    this.set(sKey, oDefault[sKey]);
                    this.trigger('!!reset:' + sKey);
                }
            } else {
                this.set(oDefault);
                this.trigger('!!reset');
            }
        }
        return this;
    }

    /**
     * 模型销毁
     * @ignore
     */
    function fModelDestroy() {
        // 销毁嵌套的model
        for(var s in this._nest){
            this._nest[s].destroy();
        }
        this.trigger('!!destroy');
        this.callSuper('destroy');
    }

    /**
     * 验证数据
     * @ignore
     */
    function fModelValidate() {
        var oData;
        var Class = this.Class;

        if (arguments.length == 1) { // 只有一个参数时，为键值对对象
            oData = arguments[0];
        } else if (arguments.length == 2) { // 两个参数时，第一个参数为key，第二个参数为value
            oData = {};
            oData[arguments[0]] = arguments[1];
        } else { // 其他情况验证已经保存的数据
            oData = this.__data;
        }

        var bValid = true;
        for (var sKey in oData) {
            var oValue = oData[sKey];
            var oVal = (this.__validators || {})[sKey];
            if (oVal) {
                var oReturn = oVal.call(this, oValue, oData);
                if (oReturn !== undefined) {
                    bValid = false;
                    var bBreak1 = this.trigger('!!invalid:' + sKey, oReturn, oValue) === pro.PREVENT;
                    var bBreak2 = this.trigger('!!invalid', sKey, oReturn, oValue) === pro.PREVENT;
                    if (bBreak1 || bBreak2) {
                        break;
                    }
                } else {
                    this.trigger('!!valid:' + sKey, oValue);
                    this.trigger('!!valid', sKey, oValue);
                }
            }
        }
        return bValid;
    }

    /**
     * 设置数据
     * @ignore
     */
    function fModelSet() {
        var aArgs = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            aArgs.push(arguments[i]);
        }
        aArgs.push(true);

        return this.save.apply(this, aArgs);
    }

    /**
     * 保存数据（验证）
     * @ignore
     */
    function fModelSave() {
        // 禁用
        if(this.__disabled){
            return false;
        }

        // 如果第一个参数为字符串，则第一个参数为key，第二个参数为value，第三个参数为是否不验证
        if (typeof arguments[0] == 'string') {
            var sKey = arguments[0];
            var oValue = arguments[1];
            //if(oValue !== undefined && oValue !== null){
            var bForce = !!arguments[2];
            var bAllowed = __fCheckAllowed.call(this, sKey, oValue);

            var bValid = bAllowed && (bForce || this.validate(sKey, oValue));

            if (bValid) {
                var oResult = __fDoSave.call(this, sKey, oValue);
                if(oResult.valid){
                    if(oResult.changed){
                        var oChanged = {};
                        oChanged[sKey] = oValue;
                        this.trigger('!!changes', oChanged);
                    }
                }else{
                    bValid = false;
                }
            }
            return bValid;
        } else if (typeof arguments[0] == 'object') {
            // 如果第一个参数为对象，则第一个参数批量设置，第二个参数为是否不验证
            var oData = arguments[0];
            var bForce = !!arguments[1];
            var bValid = bForce || this.validate(oData);
            var bHasChange = false;
            var oChanged = {};

            if (bValid) {
                for (var sKey in oData) {
                    var oValue = oData[sKey];
                    var bAllowed = __fCheckAllowed.call(this, sKey, oValue);
                    if (bAllowed) {
                        var oResult = __fDoSave.call(this, sKey, oValue);

                        if(oResult.valid){
                            if(oResult.changed){
                                bHasChange = true;
                                oChanged[sKey] = oValue;
                            }
                        }else{
                            bValid = false;
                        }
                    }
                }
                bHasChange && this.trigger('!!changes', oChanged);
            }
            return bValid;
        }

        function __fDoSave(sKey, oValue){
            var oData = this.__data;
            var oRaw = oData[sKey];
            var oNest = this.getNest(sKey);
            var bRawIsModel = pro.is('model', oNest);
            var bRawIsList = pro.is('list', oNest);
            var bChanged = false;
            var bValid = true;
            var bNest = false;

            if(bRawIsModel || bRawIsList){
                bChanged = true;
            }else{
                bChanged = oRaw !== oValue;
            }

            if(bChanged){

                if (pro.is('object', oValue) && oValue.constructor == Object && bRawIsModel) {
                    // 如果是嵌套model的set通知过来的，只用保存值就好了，否则会死循环
                    if(!oNest.__nestSet){
                        bValid = oNest.save(oValue, bForce);
                        oValue = oNest.get();
                    }
                } else if (pro.is('array', oValue) && bRawIsList) {
                    // 如果是嵌套list的set通知过来的，只用保存值就好了，否则会死循环
                    if(!oNest.__nestSet){
                        oNest.set(oValue);
                        oValue = oNest.getData();
                    }
                }

                if(bValid){
                    oValue = oData[sKey] = oValue;
                    this.trigger('!!change:' + sKey, oValue);
                    this.trigger('!!change', sKey, oValue);
                }
            }

            return {
                changed: bChanged,
                valid: bValid
            };
        }

        function __fCheckAllowed(sKey, oValue) {
            var Class = this.Class;
            var oData = this.__data;
            // 如果原值为类，先实例化
            var oRaw = oData[sKey];
            // if (typeof oRaw == 'function' && oRaw.prototype._pro) {
            //     oData[sKey] = new oRaw();
            // }
            // 只允许相同类型覆盖的类型
            var oNeedSameType = {
                'function': 'function'
            };
            var oEmpty = {
                'undefined': true,
                'null': true
            };
            var bAllowed = true;
            if (Class.data) {
                var sRawType = typeof oRaw;
                var sNewType = typeof oValue;
                var bEmpty = oEmpty[sRawType];
                var bSameType = bEmpty || (oNeedSameType[sRawType] == oNeedSameType[sNewType]);
                bAllowed = bSameType;
            }
            return bAllowed;
        }
    }

    /**
     * 是否有数据
     * @ignore
     */
    function fModelHas(sKey) {
        return (sKey in this.__data);
    }

    /**
     * 获取数据
     * @ignore
     */
    function fModelGet(oParam) {
        var sKey = null;
        var oValue = null;
        var fFilter = null;
        var oData = this.__data;
        var oOutputData = {};

        if (typeof oParam == 'string') {
            sKey = oParam;
            oOutputData[sKey] = __fDataHandler.call(this, sKey, oData[sKey]);
        } else {
            for (var s in oData) {
                oOutputData[s] = __fDataHandler.call(this, s, oData[s]);
            }
        }
        return sKey ? oOutputData[sKey] : oOutputData;

        function __fDataHandler(s, o) {
            if (typeof o == 'function') {
                return o.call(this.__data);
            }else{
                return pro.clone(o);
            }
        }
    }
    /**
     * 将model对象转换为键值对对象
     * @ignore
     */
    function fModelToData(){
        return this.get();
    }

    /**
     * 获取原始数据
     * @ignore
     */
    function fModelGetRaw(sKey) {
        return sKey !== undefined ? this.__data[sKey] : this.__data;
    }

    /**
     * 获取嵌套的model或list
     * @ignore
     */
    function fModelGetNest(sKey){
        return sKey !== undefined ? this._nest[sKey] : this._nest;
    }

    /**
     * 请求数据
     * @ignore
     */
    function fModelRequest(oConf){
        var that = this;
        var oApi = this._getApi(oConf.api);
        var sUrl = oApi.url;
        var sType = oApi.type;
        var fOnRequest = oApi.onRequest;
        var fOnResponse = oApi.onResponse;
        var oData = oConf.data;
        var bAsync = oConf.async;

        if(fOnRequest){
            fOnRequest.call(this, oData);
        }

        pro.ajax({
            url: sUrl,
            type: sType,
            async: bAsync,
            data: oData,
            success: function(oResult){
                if(fOnResponse){
                    fOnResponse.call(that, oResult);
                    fOnResponse = null;
                }
                that.trigger('requestsuccess', oConf.api, oResult);
                that.trigger('requestsuccess:' + oConf.api, oResult);
                oConf.success && oConf.success.call(that, oResult);
            },
            error: function(oReason){
                that.trigger('requesterror', oConf.api, oReason);
                that.trigger('requesterror:' + oConf.api, oReason);
                oConf.error && oConf.error.call(that, oReason);
            },
            complete: function(){
                that.trigger('requestcomplete', oConf.api);
                that.trigger('requestcomplete:' + oConf.api);
                oConf.complete && oConf.complete.call(that);
                oConf = null;
            }
        });
    }

    /**
     * 获取api
     * @ignore
     */
    function fModelGetApiProtected(sApi){
        var oApis = this.Class.apis;
        var oRawApi = oApis[sApi];
        var bSimple = typeof oRawApi == 'string';
        var sUrl = bSimple ? oRawApi : oRawApi.url;
        var fRequest = bSimple ? null : oRawApi.onRequest;
        var fResponse = bSimple ? null : oRawApi.onResponse;
        var sType = bSimple ? '' : oRawApi.type;

        var oApi = null;
        if(sUrl){
            if(!sType){
                sType = 'GET';
                var rType = /^(post|get|delete|put):/i;
                var tmp = sUrl.match(rType);
                if(tmp){
                    sType = tmp[1];
                    sUrl = sUrl.split(':')[1];
                }
            }

            oApi = {
                url: sUrl,
                type: sType,
                onResponse: fResponse,
                onRequest: fRequest
            };
        }

        return oApi || {};
    }

    /**
     * List类构造函数
     * @ignore
     */
    function fListConstructor(aList, DefaultModel) {
        this.applySuper(arguments);

        var Class = this.Class;
        this.child = this.child || {};
        this.children = this.children || [];

        this.listen('change', function () {
            if (this.getChildrenCount() == 0) {
                this.__isEmpty = true;
                this.trigger('!!empty');
            } else {
                if (this.__isEmpty || this.__isEmpty == undefined) {
                    this.__isEmpty = false;
                    this.trigger('!!nonempty');
                }
            }
        });

        this.listen('childrenchange', function () {
            this.trigger('!!change');
        });

        this.__Model = DefaultModel || Class.Model || pro.Model;
        this.set(aList);
    }

    /**
     * 将数组转换为list对象
     * @ignore
     */
    function fListFromStatic(aArr){
        return new this(aArr);
    }

    /**
     * 合并
     * @ignore
     */
    function fListMerge(oList) {
        // 禁用
        if(this.__disabled){
            return;
        }

        var that = this;
        oList.each(function (oModel) {
            that.insert(oModel);
            //oList.remove(oModel);
            //return -1;
        });
        //oList.destroy();
        this.trigger('!!concat');
        return this;
    }

    /**
     * 拆分
     * @ignore
     */
    function fListCut(nIndex, nCount) {
        // 禁用
        if(this.__disabled){
            return;
        }

        var Class = this.Class;
        var oList = new Class();
        var nEndIndex = nIndex + nCount;
        for (var i = nIndex, l = nEndIndex; i < l; i++) {
            if (this.getChild(i)) {
                oList.insert(this.remove(i));
                i--;
                l--;
            } else {
                nEndIndex = i;
                break;
            }
        }
        this.trigger('!!slice', nIndex, nEndIndex);
        return oList;
    }

    /**
     * 插入数据
     * @ignore
     */
    function fListInsert(oModel, nIndex) {
        // 禁用
        if(this.__disabled){
            return undefined;
        }

        // 非空数据
        if (oModel) {
            // 支持数组
            if (oModel instanceof Array) {
                var o;
                var n = nIndex;
                for (var i = 0, l = oModel.length; i < l; i++) {
                    o = this.insert(oModel[i], nIndex);
                    n++;
                }
                this.trigger('!!afterinsert', nIndex);
                return o;
            }

            if (oModel.constructor === Object) {
                oModel = new this.__Model(oModel);
            }

            oModel = oModel.join(this, nIndex);
            var nCurIndex = this.getIndex(oModel);
            //this.trigger('add', oModel, nCurIndex);
            this.trigger('!!insert', oModel, nCurIndex);
        }
        return oModel;
    }

    /**
     * 列表排序
     * @ignore
     */
    function fListSort(fSort) {
        // 禁用
        if(this.__disabled){
            return undefined;
        }

        this.children.sort(pro.bind(fSort, this));
        this.trigger('!!change');
        return this;
    }

    /**
     * 列表反序
     * @ignore
     */
    function fListReverse() {
        // 禁用
        if(this.__disabled){
            return undefined;
        }

        this.children.reverse();
        this.trigger('!!change');
        return this;
    }

    /**
     * 列表查找
     * @ignore
     */
    function fListHas(oModel) {
        var bHas = false;
        this.each(function (o) {
            if (o === oModel) {
                bHas = true;
                return false;
            }
        });
        return bHas;
    }

    /**
     * 通过数组设置
     * @ignore
     */
    function fListSet(aList) {
        if (this.__disabled) {
            return undefined;
        }

        if(!aList){
            return this;
        }

        this.clear(true);

        var Class = this.Class;

        this.silently(function () {
            for (var i = 0, l = aList.length; i < l; i++) {
                var o = aList[i];
                if (pro.is('model', o)) {
                    this.insert(o);
                } else {
                    this.insert(new this.__Model(o));
                }
            }
        });

        this.trigger('!!change');
        this.trigger('!!set');
        this.trigger('!!replace');

        return this;
    }

    /**
     * 获取列表数据数组
     * @ignore
     */
    function fListGetData(nIndex) {
        if(nIndex == undefined){
            var oModel = this.get(nIndex);
            return oModel && oModel.get();
        }else{
            return this.toArray();
        }
    }

    /**
     * 将list对象转换为数组
     * @ignore
     */
    function fListToArray() {
        var aList = [];
        this.each(function (oModel) {
            aList.push(oModel.get());
        });
        return aList;
    }

    /**
     * 获取models
     * @ignore
     */
    function fListGet(nIndex) {
        if (nIndex === undefined) {
            return this.children;
        } else {
            return this.children[nIndex];
        }
    }

    /**
     * 获取列表数量
     * @ignore
     */
    function fListGetCount() {
        return this.getChildrenCount();
    }

    /**
     * 增加一个model到列表后面
     * @ignore
     */
    function fListPush(oModel) {
        oModel = this.insert(oModel);
        return oModel;
    }

    /**
     * 删除数据
     * @ignore
     */
    function fListRemove() {

        // 禁用
        if(this.__disabled){
            return undefined;
        }

        var oModel = null;

        // 如果参数是number则是index，否则是model
        if (typeof arguments[0] == 'number') {
            oModel = this.get(arguments[0]);
        } else {
            oModel = arguments[0];
        }
        if (oModel) {
            var nIndex = this.getIndex(oModel);
            oModel.quit(this);
            this.trigger('!!remove', oModel, nIndex);
        }
        return oModel;
    }

    /**
     * 获取第一个model并从列表里删掉
     * @ignore
     */
    function fListShift() {
        return this.remove(0);
    }

    /**
     * 获取最后一个model并从列表里删掉
     * @ignore
     */
    function fListPop() {
        return this.remove(this.getCount() - 1);
    }

    /**
     * 清空数据列表
     * @ignore
     */
    function fListClear(bNoFire) {
        // 禁用
        if(this.__disabled){
            return undefined;
        }

        this.exclude();
        if (!bNoFire) {
            this.trigger('!!change');
        }
        return this;
    }

    /**
     * 增加一个model到列表前面
     * @ignore
     */
    function fListUnshift(oModel) {
        oModel = this.insert(oModel, 0);
        return oModel;
    }

    /**
     * 在列表中查找数据
     * @ignore
     */
    function fListFind(oConf, fCall) {
        var aResult = [];
        this.each(function (oModel) {
            if (typeof oConf == 'object') {
                var bMatch = false;
                for (var s in oConf) {
                    var o = oModel.get(s);
                    var oQuery = oConf[s];
                    if (oQuery instanceof RegExp) {
                        if (oQuery.test(o)) {
                            //aResult.push(oModel);
                            bMatch = true;
                        } else {
                            bMatch = false;
                            break;
                        }
                    } else if (typeof oQuery == 'function') {
                        if (oQuery.call(oModel, o)) {
                            //aResult.push(oModel);
                            bMatch = true;
                        } else {
                            bMatch = false;
                            break;
                        }
                    } else {
                        if (oQuery === o) {
                            //aResult.push(oModel);
                            bMatch = true;
                        } else {
                            bMatch = false;
                            break;
                        }
                    }
                }
                if (bMatch) {
                    aResult.push(oModel);
                }
            } else if (typeof oConf == 'function') {
                if (oConf.call(this, oModel) === true) {
                    aResult.push(oModel);
                }
            }
        });

        for (var i = 0, l = aResult.length; i < l; i++) {
            if (fCall && fCall.call(this, aResult[i]) === pro.BREAK) {
                return false;
            }
        }

        return aResult;
    }

    /**
     * View类构造函数
     * @ignore
     */
    function fViewConstructor(oParam) {

        this.applySuper(arguments);

        var Class = this.Class;
        var oConf = this.__config = oParam || {};
        var Model = Class.Model || pro.Model;

        // 重写toString实现隐式转换为字符串
        this.toString = this.getHtml;

        this.__inactive = true;
        this.useBuffer = !!(Class.useBuffer === undefined ? (this.useBuffer === undefined ? oConf.useBuffer : this.useBuffer) : Class.useBuffer);
        this.model = 'model' in oConf ? oConf.model : new Model();

        this.__bind = 'bind' in oConf ? oConf.bind : Class.bind;

        if (this.useBuffer) {
            this.getBuffer();
        }
        if ('dom' in oConf) {
            this.dom = oConf.dom;
        }

        if ('data' in oConf) {
            this.model.set(oConf.data);
        } else if (Class.data) {
            if (typeof Class.data == 'function') {
                this.model.set(Class.data(oConf));
            } else {
                this.model.set(Class.data);
            }
        }

        // 插入css
        if (Class.css && !Class.__cssInserted) {
            var sCss = Class.css;
            if (typeof sCss == 'function') {
                sCss = sCss.call(this, this.model.get());
            } else if (typeof sCss == 'object') {
                // 判断浏览器
                var oCss = sCss;
                var oBrowser = pro.browser();
                // 先插入基础css
                sCss = oCss.all;
                if (oBrowser.ie) {
                    sCss += oCss.ie || '';
                    if (oBrowser.ie <= 7 && oCss.iel) {
                        sCss += oCss['iel'];
                    }
                    sCss += oCss['ie' + oBrowser.ie] || '';
                } else if (oBrowser.webkit && oCss.webkit) {
                    sCss += oCss.webkit;
                } else if (oBrowser.triggerfox && oCss.triggerfox) {
                    sCss += oCss.triggerfox;
                }
            }
            pro.insertCss(sCss, true);
            Class.__cssInserted = true;
        }

        // 监听自定义事件
        var oListeners = oConf.listeners;
        for (var s in oListeners) {
            var oListener = oListeners[s];
            this.listen(s, oListener);
        }

        // for(var s in oConf){
        //     if(/^on[A-Z]+/.test(s)){
        //         var sEvent = s.replace('on', '').toLowerCase();
        //         this.listen(sEvent, oConf[s]);
        //     }
        // }

        this.listen('create', oConf.onCreate);
        this.listen('update', oConf.onUpdate);
        this.listen('render', oConf.onRender);
        this.listen('afterrender', oConf.onAfterCreate);
        this.listen('destroy', oConf.onDestroy);

        // 数据绑定
        if(this.__bind){
            this.listen(this.model, 'changes', function(){
                this.update();
            });
        }
    }

    /**
     * 添加子视图
     * @ignore
     */
    function fViewAddView(oView, nIndex) {
        if (!oView.isRendered()) {
            if (nIndex === undefined || nIndex == this.getChildrenCount()) {
                oView.join(this).render(this);
            } else {
                var oChild = this.getChild(nIndex);
                oView.join(this).renderBefore(oChild);
            }
        }
        return this;
    }

    /**
     * 通过页面dom创建view
     * @ignore
     */
    function fViewFromStatic(oDom, oConf) {
        oConf = pro.mix(oConf, {
            dom: oDom,
            id: oDom.id
        });

        var obj = new this(oConf);
        // obj.getHtml();

        if (!obj.dom.id) {
            obj.dom.id = obj.domId;
        }

        obj.activate();
        return obj;
    }

    /**
     * 将页面dom作为模板创建view
     * @ignore
     */
    function fViewParseStatic(oDom, oConf){

        var oTmpDom = document.createElement('div');
        oTmpDom.appendChild(oDom.cloneNode(true));

        oConf = pro.mix(oConf, {
            template: oTmpDom.innerHTML
        });

        var obj = new this(oConf);
        obj.renderBy(oDom);

        return obj;
    }

    /**
     * 增加class
     * @ignore
     */
    function fViewAddClass(sClass, sQuery) {
        var oDom = sQuery ? this.find(sQuery) : this.dom;
        pro.addClass(oDom, sClass);
        return this;
    }

    /**
     * 移除class
     * @ignore
     */
    function fViewRemoveClass(sClass, sQuery) {
        var oDom = sQuery ? this.find(sQuery) : this.dom;
        pro.removeClass(oDom, sClass);
        return this;
    }

    /**
     * 获取缓冲区dom
     * @ignore
     */
    function fViewGetBuffer() {
        return this.__buffer = this.__buffer || document.createDocumentFragment();
    }

    /**
     * 清空缓冲区dom
     * @ignore
     */
    function fViewClearBuffer() {
        // 清空buffer
        this.__buffer = null;
        delete this.__buffer;
        return this.getBuffer();
    }

    /**
     * 将缓冲区中的dom渲染
     * @ignore
     */
    function fViewFlush() {
        var oParent = this.entry || this.dom;
        if (oParent && this.__buffer && this.__buffer.childNodes.length > 0) {
            oParent.appendChild(this.__buffer);
            this.trigger('!!flush');
            this.clearBuffer();
        }
        return this;
    }

    /**
     * 查找一个dom
     * @ignore
     */
    function fViewFind(sQuery, fCall) {
        if (sQuery) {
            return (this.findAll(sQuery, fCall, true) || [])[0];
        }
    }

    /**
     * 查找dom
     * @ignore
     */
    function fViewFindAll(sQuery, fCall, bOne) {
        var oScale = this.dom || this.__buffer || null;
        var bRoot = sQuery == '@';
        var sRawQuery = sQuery;

        if (sQuery && oScale) {

            if (bRoot) {
                return [oScale];
            } else if (oScale.querySelectorAll) { // 高级浏览器使用querySelectorAll
                if(sQuery.indexOf('@') >= 0){
                    sQuery = sQuery.replace(/@([\w\-]+)/, '[data-pro=$1]');
                }

                var aAll = oScale.querySelectorAll(sQuery) || [];
                try {
                    return Array.prototype.slice.call(aAll);
                } catch (e) {
                    var aTmp = [];
                    for (var i = 0, l = aAll.length; i < l; i++) {
                        aTmp.push(aAll[i]);
                    }
                    return aTmp;
                }
            } else {
                var aAll = oScale.getElementsByTagName('*');
                var aNodeList = [];
                var sAttr = '';
                var sSymbol = sQuery[0] || sQuery.match(/^./)[0];
                // var oCache = this.__cacheDoms = this.__cacheDoms || {};
                // var aCacheDoms = oCache[sRawQuery];

                // 在缓存中查找
                // if(aCacheDoms){
                //     return aCacheDoms;
                // }

                switch (sSymbol) {
                    case '@':
                        sAttr = 'data-pro';
                        sQuery = sQuery.substring(1);
                        break;
                    case '#':
                        sAttr = 'id';
                        sQuery = sQuery.substring(1);
                        var oDom = pro.$(sQuery);
                        if (oDom) {
                            return [oDom];
                        }
                        break;
                    case '.':
                        sAttr = 'class';
                        sQuery = sQuery.substring(1);
                        break;
                    default:
                        sAttr = '';
                }
                var rTest = new RegExp('(?:^|\\s)' + sQuery + '(?:$|\\s)');
                for (var i = 0, l = aAll.length; i < l; i++) {
                    var oNode = aAll[i];
                    if ((!sAttr && oNode.tagName.toLowerCase() == sQuery) || (sAttr == 'class' && rTest.test(oNode.className)) || rTest.test(oNode.getAttribute(sAttr))) {
                        aNodeList.push(oNode);
                        fCall && fCall.call(this, oNode);

                        // 查找id或bOne参数为true时只返回一个dom
                        if (bOne || sAttr == 'id') {
                            break;
                        }
                    }
                }

                // 保存到cache
                // oCache[sRawQuery] = aNodeList;

                return aNodeList;
            }
        }
    }

    /**
     * 更新视图
     * @ignore
     */
    function fViewUpdate(oConf) {
        var Class = this.Class;
        var oDom = this.dom;
        var oModel = this.model;
        var bHidden = this.__hidden;
        var oRawConf = this.__config;
        if (oConf) {
            if (Class.data && typeof Class.data == 'function') {
                oConf = Class.data(pro.mix(oRawConf, oConf));
                oModel && oModel.set(oConf);
            } else {
                oModel && oModel.set(oConf);
                pro.mix(oRawConf, oConf);
            }
        }
        this.destroyChildren();

        // 已渲染才重新生成dom
        if (oDom && oDom.parentNode) {
            bHidden = oDom.style.display == 'none'; // 已dom的style为准
            this.__inactive = true; // 重新绑定事件
            this.__rendered = false; // 重新渲染
            this.render(oDom.parentNode, 'r', oDom);
        }

        if (this.__disabled) {
            this.__disabled = false;
            this.disable();
        } else {
            this.__disabled = true;
            this.enable();
        }

        if (bHidden) {
            this.hide();
        }

        this.trigger('!!update');
        return this;
    }

    /**
     * 生成dom
     * @ignore
     */
    function fViewCreate(bHtml) {
        var Class = this.Class;
        var oConf = this.__config;
        var oModel = this.model;

        this.trigger('!!beforecreate');

        var sHtml = oConf.html || Class.html;

        var oData = {};

        if (typeof sHtml == 'function') {
            oData = oModel ? oModel.get() : {};
            sHtml = sHtml.call(this, oData);
        }else{
            oData = oModel ? oModel.getRaw() : {};
        }

        // 如果没有html则从模板生成
        if (sHtml === undefined) {
            var sTemplate = oConf.template || Class.template || '';
            if (sTemplate) {
                sHtml = Class.fill(sTemplate, oData);
            } else {
                sHtml = '';
            }
        }

        var oDom;
        oDom = document.createElement('div');
        oDom.innerHTML = sHtml = sHtml.replace(/(?:^\s+|\s+$)/g, '');

        var bSingle = false;
        if (oDom.childNodes.length == 1) {
            var oChild = oDom.childNodes[0];
            if (oChild.nodeType == 1) {
                oDom.removeChild(oChild);
                oDom = oChild;
                bSingle = true;
            }
        }

        if (oDom.id) {
            this.domId = oDom.id;
        } else {
            this.domId = 'pro-view-' + (pro.View.__id++);
            oDom.id = this.domId;
        }

        if (bSingle) {
            // this.__html = sHtml.replace('>', ' id="' + this.domId + '">');
            var nSliceTmp = sHtml.indexOf('>');
            this.__html = sHtml.substring(0, nSliceTmp) + ' id="' + this.domId + '"' + sHtml.substring(nSliceTmp);
        } else {
            this.__html = '<div id="' + this.domId + '">' + sHtml + '</div>';
        }

        // 只生成html不执行后续操作
        if (bHtml) {
            // 保存未激活的view
            if (this.__inactive) {
                this.listenOnce('activate', function (oDom) {
                    // 触发渲染相关的事件
                    this.trigger('!!beforecreate');
                    __fFindDoms.call(this);
                    this.trigger('!!create', oDom);
                    this.trigger('!!aftercreate', oDom);
                    this.trigger('!!beforerender', oDom);
                    this.trigger('!!render', oDom);
                    this.flush();
                    this.trigger('!!afterrender', oDom);
                });
                pro.__inactiveViews.push(this);
            }
            return this.__html;
        }

        this.dom = oDom;

        __fFindDoms.call(this);

        this.trigger('!!create', oDom);

        // 绑定dom事件
        this.activate();

        this.trigger('!!aftercreate', oDom);

        return oDom;


        function __fFindDoms() {
            var Class = this.Class;
            var oConf = this.__config;

            // 保存入口dom
            var sEntryQuery = Class.entry || oConf.entry;
            if (sEntryQuery) {
                this.entry = this.find(sEntryQuery);
            }

            // 保存dom
            if (this.dom && (Class.doms || oConf.doms)) {
                var oDoms = pro.mix(Class.doms, oConf.doms);
                this.doms = this.doms || {};

                for (var s in oDoms) {
                    var sQuery = oDoms[s];
                    if (typeof sQuery == 'string') {
                        this.doms[s] = this.find(sQuery);
                    }
                }
            }
        }
    }

    /**
     * 获取dom
     * @ignore
     */
    function fViewGetDom() {
        return this.dom;
    }

    /**
     * 获取view使用的数据
     * @ignore
     */
    function fViewGetData(sKey) {
        return oModel.get(sKey);
    }

    /**
     * 获取html
     * @ignore
     */
    function fViewGetHtml(bUpdate) {

        if (bUpdate && this.isCreated()) {
            var oDom = this.dom;
            var sHtml = oDom.outerHTML;
            if (!sHtml) {
                var oNewDom = oDom.cloneNode(true);
                var oTmpDom = document.createElement('div');
                oTmpDom.appendChild(oNewDom);
                sHtml = oTmpDom.innerHTML;
            }
            this.__html = sHtml;
        }

        return this.__html || this.silently(function () {
                return this.create(true)
            });
    }

    /**
     * 激活html
     * @ignore
     */
    function fViewActivateStatic() {
        var arr = pro.__inactiveViews;
        for (var i = 0, l = arr.length; i < l; i++) {
            var o = arr[i];
            if (o.__rendered || o.activate()) {
                arr.splice(i, 1);
                i--;
                l = arr.length;
            }
        }
    }

    /**
     * 激活html
     * @ignore
     */
    function fViewActivate(oDom) {
        var Class = this.Class;
        var oConf = this.__config;

        if(!this.dom){
            this.dom = oDom || document.getElementById(this.domId);
        }

        if (this.dom && this.__inactive) {
            this.listenDoms(Class.events);
            this.listenDoms(oConf.events);
            this.__inactive = false;
            this.trigger('activate', this.dom);
            return true;

        }

        return false;
    }

    /**
     * 渲染视图
     * @ignore
     */
    function fViewRender(oRenderTo, sCmd, oRelDom) {
        // 不允许多次渲染
        if (this.__rendered) {
            return this;
        }

        var Class = this.Class;

        var oConf = this.__config;
        var oDom;

        oRenderTo = oRenderTo || oConf.renderTo;

        if (oRenderTo) {
            // dom或者view
            if (!pro.is('dom', oRenderTo)) {
                var oView = oRenderTo;
                // useBuffer或者dom不存在时使用buffer
                if (oView.useBuffer || !oView.dom) {
                    oRenderTo = oView.getBuffer();
                } else {
                    oRenderTo = oView.entry || oView.dom;
                }
            }

            if (sCmd == 'r') {
                oDom = this.create();
            } else {
                oDom = this.dom || this.create();
            }

            this.trigger('!!beforerender');

            if (sCmd && oRelDom) {
                switch (sCmd) {
                    case 'a':
                        oRenderTo.insertBefore(oDom, oRelDom.nextSibling);
                        break;
                    case 'b':
                        oRenderTo.insertBefore(oDom, oRelDom);
                        break;
                    case 'r':
                        oRenderTo.replaceChild(oDom, oRelDom);
                        break;
                }
            } else {
                oRenderTo.appendChild(oDom);
            }

            this.dom = oDom;
        }

        // 如果create时没绑定事件，render时再绑定一次
        this.activate();

        this.__rendered = true;
        this.trigger('!!render', this.dom);

        pro.delay(pro.bind(function (bSilent) {
            // afterrender时可能已经destroy
            try {
                this.flush();
                pro.View.activate();
                if (!bSilent) {
                    this.trigger('!!afterrender', this.dom);
                }
            } catch (e) {
            }
        }, this, this.silent));

        return this;
    }

    /**
     * 监听事件
     * @ignore
     */
    function fViewListenDoms(oEvents) {
        var that = this;
        if (oEvents) {
            for (var s in oEvents) {
                var tmp = s.split('/');
                var sQuery = tmp[0];
                var sEvent = tmp[1] || 'click';

                var aNodeList = this.findAll(sQuery);
                for (var i = 0, l = aNodeList.length; i < l; i++) {
                    var oNode = aNodeList[i];
                    if (oNode) {
                        pro.addEvent(oNode, sEvent, pro.bind(function (oNode, o, sEvent) {
                            return pro.bind(function (o, oNode, sEvent, e) {
                                var oEvt = e || window.event;
                                if (e.type == 'mouseover' || e.type == 'mouseout') {
                                    var oRel = oEvt.relatedTarget || oEvt.fromElement || oEvt.toElement;
                                    oEvt.contains = oNode === oRel || pro.contains(oNode, oRel);
                                }

                                var bReturn = typeof o == 'function' ? o.call(this, oNode, oEvt) : this.trigger(o, oNode, oEvt);

                                if(bReturn === pro.PREVENT){
                                    pro.cancelBubble(oEvt);
                                }

                                return bReturn;
                            }, this, o, oNode, sEvent);
                        }, this, oNode, oEvents[s], sEvent)());
                    }
                }
            }
        }
        return this;
    }

    /**
     * 是否已生成
     * @ignore
     */
    function fViewIsCreated() {
        return !!this.dom;
    }

    /**
     * 是否已渲染
     * @ignore
     */
    function fViewIsRendered() {
        return !!this.__rendered;
    }

    /**
     * 将视图渲染到某容器上并替换此容器
     * @ignore
     */
    function fViewRenderBy(oRelDom) {
        oRelDom = oRelDom.dom || oRelDom;
        this.render(oRelDom.parentNode, 'r', oRelDom);
        return this;
    }

    /**
     * 将视图渲染到某容器后面
     * @ignore
     */
    function fViewRenderBefore(oRelDom) {
        oRelDom = oRelDom.dom || oRelDom;
        this.render(oRelDom.parentNode, 'b', oRelDom);
        return this;
    }

    /**
     * 将视图渲染到某容器后面
     * @ignore
     */
    function fViewRenderAfter(oRelDom) {
        oRelDom = oRelDom.dom || oRelDom;
        this.render(oRelDom.parentNode, 'a', oRelDom);
        return this;
    }

    /**
     * 显示视图
     * @ignore
     */
    function fViewShow() {
        if (this.dom) {
            this.dom.style.display = '';
            if (this.__hidden) {
                this.trigger('!!show');
            }
            this.__hidden = false;
        }
        return this;
    }

    /**
     * 隐藏视图
     * @ignore
     */
    function fViewHide() {
        if (this.dom) {
            this.dom.style.display = 'none';
            if (!this.__hidden) {
                this.trigger('!!hide');
            }
            this.__hidden = true;
        }
        return this;
    }

    /**
     * 销毁视图
     * @ignore
     */
    function fViewDestroy() {
        if (this.trigger('!!beforedestroy') !== pro.PREVENT) {
            this.destroyChildren();
            if (this.dom && this.dom.parentNode) {
                this.dom.parentNode.removeChild(this.dom);
            }
            this.trigger('!!destroy');
            //pro.Base.prototype.destroy.call(this);
            this.callSuper('destroy');
        }
    }

    /**
     * AdapterView构造函数
     * @ignore
     */
    function fAdapterViewConstructor(oConf){
        this.applySuper(arguments);

        var Class = this.Class;
        this.list = oConf.list;
        this.adapter = oConf.adapter || this.adapter;
        this.__views = new pro.Base();
        this.__init();
    }

    /**
     * AdapterView初始化
     * @ignore
     */
    function fAdapterViewInitPrivate(){
        var Class = this.Class;
        var that = this;
        var oList = this.list;
        var oConf = this.__config;

        this.__bind = 'bind' in oConf ? oConf.bind : Class.bind;

        this.listen('create', function(){
            oList.each(function(oModel, nIndex){
                var oItemView = that.adapter(oModel, nIndex);
                if(oItemView){
                    oItemView.join(that).render(that);
                    that.__views.include(oItemView);
                }
            });
        });

        if(this.__bind){
            this.listen(oList, 'set', function(){
                this.update();
            });

            this.listen(oList, 'exclude', function(n){
                var oItemView = this.__views.getChild(n);
                oItemView && oItemView.destroy();
            });

            this.listen(oList, 'include', function(n, oModel){
                var oItemView = this.adapter(oModel, n);
                var oViews = this.__views;
                var oRelView = oViews.getChild(n);

                this.include(oItemView);

                if(oRelView){
                    oItemView.renderBefore(oRelView);
                }else{
                    oItemView.render(this);
                }

                oViews.include(oItemView, n);
            });
        }
    }


    /**
     * 通过id获取dom
     * @ignore
     */
    function fProDollar(sId) {
        return document.getElementById(sId);
    }

    /**
     * 监听dom事件
     * @ignore
     */
    function fProAddEvent(o, s, f) {

        if (o && s && f) {
            switch(s){
                case pro.CLICK:
                case pro.MOUSE_DOWN:
                case pro.MOUSE_UP:
                case pro.KEY_PRESS:
                case pro.KEY_UP:
                case pro.KEY_DOWN:
                    var oDelegate = pro.__delegate = pro.__delegate || {};
                    var oDeleDefSet = oDelegate[s] = oDelegate[s] || {};
                    pro.__delegateCount = pro.__delegateCount || 1;

                    var nId = pro.__delegateCount++;
                    o.setAttribute('data-pro-' + s, nId);
                    oDeleDefSet[nId] = f;

                    fInjectBody(s);

                    break;
                default:
                    fListen(o, s, f);
                    break;
            }
        }

        function fInjectBody(s){
            var sKey = '__injected' + s;
            var bInject = !!pro[sKey];
            if(!bInject){
                pro[sKey] = true;
                fListen(document.body, s, function(e){
                    var oEvt = e || window.event;
                    var oSrc = oEvt.srcElement || oEvt.target;
                    var sKey = 'data-pro-' + s;

                    do {
                        var nId = oSrc.getAttribute(sKey);
                        if(nId != null){
                            var oDele = pro.__delegate[s] || {};
                            var fHandler = oDele[nId];
                            if(fHandler && fHandler({type: s}) === pro.PREVENT){
                                break;
                            }
                        }
                        oSrc = oSrc.parentNode;
                    } while(oSrc && oSrc !== document.documentElement);

                });
            }
        }

        function fListen(o, s, f){
            try {
                o.addEventListener(s, f, false);
            } catch (e) {
                o.attachEvent('on' + s, f);
            }
        }
    }

    /**
     * 取消监听dom事件
     * @ignore
     */
    function fProRemoveEvent(o, s, f) {
        if (o && s && f) {
            switch(s){
                case pro.CLICK:
                case pro.MOUSE_DOWN:
                case pro.MOUSE_UP:
                case pro.KEY_PRESS:
                case pro.KEY_UP:
                case pro.KEY_DOWN:
                    var sAttr = 'data-pro-' + s;
                    try{
                        delete pro.__delegate[s][o.getAttribute(sAttr)];
                        o.removeAttribute(sAttr);
                    }catch(e){}
                    break;
                default:
                    try {
                        o.removeEventListener(s, f, false);
                    } catch (e) {
                        o.detachEvent("on" + s, f);
                    }
                    break;
            }
        }
    }

    /**
     * 通过id获得模板
     * @ignore
     */
    function fProGetTemplate(sId) {
        try {
            return this.$(sId).innerHTML;
        } catch (e) {
            return '';
        }
    }

    /**
     * 延迟执行
     * @ignore
     */
    function fProDelay(fFunc, oThis, nTime) {
        oThis = oThis || this;
        nTime = nTime || 0;
        return setTimeout(function () {
            fFunc.call(oThis);
        }, nTime);
    }

    /**
     * 判断数据类型
     * @ignore
     */
    function fProIs(s, o) {
        var sTypeof = typeof o;
        switch (sTypeof) {
            case 'undefined':
            case 'string':
            case 'number':
            case 'boolean':
            case 'function':
            case 'string':
                return s == sTypeof;
            case 'object':
                if (o === null) {
                    return s == 'null';
                } else {
                    switch (s) {
                        case 'array':
                            return o instanceof Array;
                        case 'object':
                            return !(o instanceof Array);
                        case 'dom':
                            return typeof o.nodeType == 'number';
                        case 'pro':
                            return !!o._pro;
                        default:
                            return __fIs(s, o);
                    }
                }
        }
        return false;

        function __fIs(s, o) {
            var Super = o.constructor;
            while (Super) {
                if (o._type === s) {
                    return true;
                }
                Super = Super.__super;
            }
            return false;
        }
    }

    /**
     * 增加class
     * @ignore
     */
    function fProAddClass(oDom, sClass) {
        if (oDom && sClass) {
            if (oDom.classList) {
                var arr = sClass.split(' ');
                for (var i = 0, l = arr.length; i < l; i++) {
                    oDom.classList.add(arr[i]);
                }
            } else {
                this.removeClass(oDom, sClass);
                oDom.className += ' ' + sClass;
            }
        }
    }

    /**
     * 移除class
     * @ignore
     */
    function fProRemoveClass(oDom, sClass) {
        if (oDom && sClass) {
            if (oDom.classList) {
                var arr = sClass.split(' ');
                for (var i = 0, l = arr.length; i < l; i++) {
                    oDom.classList.remove(arr[i]);
                }
            } else {
                oDom.className = oDom.className.replace(new RegExp('\\s?' + sClass, 'g'), '');
            }
        }
    }

    /**
     * 克隆对象
     * @ignore
     */
    function fProClone(o, fFilter) {
        var oNew = null;
        if (typeof o == 'object') {
            if (pro.is('array', o)) {
                oNew = [];
                for (var i = 0, l = o.length; i < l; i++) {
                    var v = o[i];
                    if (!fFilter || (fFilter(v, i) !== pro.BREAK)) {
                        oNew[i] = pro.clone(v);
                    }
                }
            } else if (o === null || pro.is('dom', o)) {
                oNew = o;
            } else if(o._pro){
                if(pro.is('model', o)){
                    oNew = new o.Class(o.get());
                }else if(pro.is('list', o)){
                    oNew = new o.Class(o.getData());
                }else if(pro.is('view', o)){
                    oNew = new o.Class(o.__config);
                }else{
                    oNew = new o.Class();
                }
            } else {
                oNew = {};
                for (var i in o) {
                    var v = o[i];
                    if (!fFilter || (fFilter(v, i) !== pro.BREAK)) {
                        oNew[i] = pro.clone(v);
                    }
                }
            }
        } else {
            if (!fFilter || fFilter(o)) {
                oNew = o;
            }
        }
        return oNew;
    }

    /**
     * 合并两个对象
     * @ignore
     */
    function fProMix(o1, o2, fCustom) {
        o1 = o1 || {};
        if (o2) {
            for (var s in o2) {
                var o = o2[s];
                if (!fCustom) {
                    if (o instanceof Array) {
                        o1[s] = o;
                    } else if (pro.is('object', o) && o.constructor === Object) {
                        o1[s] = (pro.is('object', o1[s])) ? o1[s] : {};
                        o1[s] = pro.mix(o1[s], o);
                    } else {
                        o1[s] = o;
                    }
                } else {
                    o1[s] = fCustom(s, o);
                }
            }
        }
        return o1;
    }

    /**
     * 模板生成html
     * @ignore
     */
    function fProTemplate(sTemplate, oData) {
        return pro.Simplate.render(sTemplate, oData);
    }

    /**
     * 函数绑定
     * @ignore
     */
    function fProBind(f, o) {
        var a = [];
        for (var i = 2, l = arguments.length; i < l; i++) {
            a.push(arguments[i]);
        }
        return function () {
            var a2 = [];
            for (var i = 0, l = arguments.length; i < l; i++) {
                a2.push(arguments[i]);
            }
            return f.apply(o, a.concat(a2));
        };
    }

    /**
     * 阻止冒泡
     * @ignore
     */
    function fProCancelBubble(oEvt) {
        try {
            oEvt.stopPropagation();
        } catch (e) {
            oEvt.cancelBubble = true;
        }
    }

    /**
     * 插入style
     * @ignore
     */
    function fProInsertCss(sCss, bBefore) {
        var oDoc = document;
        var bIsFile = /\.css$/.test(sCss);
        var oStyle;

        if(bIsFile){
            oStyle = oDoc.createElement('link');
            oStyle.href = sCss;
            oStyle.rel = 'stylesheet';
        }else{
            oStyle = oDoc.createElement('style');
            oStyle.type = 'text/css';
            try {
                oStyle.appendChild(oDoc.createTextNode(sCss));
            } catch (e) {
                oStyle.styleSheet.cssText = sCss;
            }
        }

        var oRelDom = oDoc.getElementsByTagName('head')[0];
        if (bBefore) {
            oRelDom.insertBefore(oStyle, oRelDom.childNodes[0]);
        } else {
            oRelDom.appendChild(oStyle);
        }
    }

    /**
     * 检查dom是否包含另一个dom
     * @ignore
     */
    function fProContains(oParent, oDom) {
        return oParent.contains ? (oParent != oDom && oParent.contains(oDom)) : !!(oParent.compareDocumentPosition(oDom) & 16);
    }

    /**
     * 浏览器信息
     * @ignore
     */
    function fProBrowser() {
        if (!pro.__browser) {
            var s = navigator.userAgent.toLowerCase();
            var o = null;
            if (/msie/.test(s)) {
                o = {
                    ie: (s.match(/msie\s(\d+?)/) || [])[1]
                };
            } else if (/firefox/.test(s)) {
                o = {
                    firefox: true
                };
            } else if (/webkit/.test(s)) {
                o = {
                    webkit: true
                };
            } else {
                o = {
                    other: true
                };
            }
            this.__browser = o;
        }
        return this.__browser;
    }

    /**
     * ajax
     * @ignore
     */
    function fProAjax(oConf) {
        var that = this;
        var oXmlHttp = __fCreateXMLHttpRequest();
        var sType = (oConf.type || 'GET').toUpperCase();
        var bAsync = oConf.async === false ? false : true;
        var bPost = sType == 'POST';
        var bGet = sType == 'GET';
        var sUrl = bGet ? oConf.url + '?' + __fGetParamsString(oConf.data) : oConf.url;

        oXmlHttp.open(sType, sUrl, bAsync);
        oXmlHttp.setRequestHeader("Accept", "application/json");
        oXmlHttp.setRequestHeader("cache-control", "no-cache");

        if (!bGet) {
            oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        oXmlHttp.onreadystatechange = function() {
            var nState = oXmlHttp.readyState;
            var bDone = nState == 4;
            var bSend = nState == 1;
            if(bDone){
                var fSuc = oConf.success;
                var fErr = oConf.error;
                var fComp = oConf.complete;
                if (oXmlHttp.status < 400) {
                    try{
                        var oResponse = window.JSON ? JSON.parse(oXmlHttp.responseText) : window['eval']('('+oXmlHttp.responseText+')');
                        fSuc && fSuc.call(that, oResponse);
                    }catch(e){
                        fErr && fErr.call(that, oXmlHttp.responseText);
                    }
                } else {
                    fErr && fErr.call(that, oXmlHttp.status, oXmlHttp.responseText);
                }
                fComp && fComp.call(that);
            }else if(bSend){
                var fSend = oConf.send;
                fSend && fSend.call(that);
            }
        }

        try{
            oXmlHttp.send(bPost ? __fGetParamsString(oConf.data) : null);
        }catch(e){}


        function __fGetParamsString(o){
            var a = [];
            for (var s in o) {
                a.push(encodeURI(s) + "=" + encodeURIComponent(o[s]));
            }
            var s = a.join('&');
            return s;
        }

        function __fCreateXMLHttpRequest() {
            if (window.ActiveXObject) {
                var aVersions = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
                for (var i = 0; i < aVersions.length; i++) {
                    try {
                        return new ActiveXObject(aVersions[i]);
                    } catch (e) {
                        continue;
                    }
                }
            } else if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        }
    }

    /**
     * Simplate模板
     * @ignore
     */
    function fProSimplate(){
        return {
            tags: ['{{', '}}'], // 开始结束标签
            keys: {'#': '#', '^': '^', '.': '.', '/': '/'},
            parse: fSimplateParse, // 获取html
            render: fSimplateRender, // 模板生成html
            each: fSimplateEach, // 遍历数组
            getValue: fSimplateGetValue, // 从数据中获取值
            findClose: fSimplateFindClose // 查找结束标签
        };

        function fSimplateFindClose(aFragments, sKey, nStart){
            var rEnd = new RegExp('^/' + sKey);
            var rNest = new RegExp('^#' + sKey);
            var a = [];
            var nNest = 0;
            this.each(aFragments, function(sFragment, n){
                if(rEnd.test(sFragment)){
                    nNest--;
                    if(nNest < 0){
                        return false;
                    }else{
                        a.push(sFragment);
                    }
                }else{
                    a.push(sFragment);
                    if(rNest.test(sFragment)){
                        nNest++;
                    }
                }
            }, nStart);
            return a;
        }

        function fSimplateGetValue(sKey, oData){
            return oData[sKey];
        }

        function fSimplateEach(a, f, n){
            for(var i=n||0, l=a.length; i<l; i++){
                var o = f.call(this, a[i], i);
                if(o === false){
                    break;
                }else if(typeof o == 'number'){
                    i += o;
                }
            }
        }

        function fSimplateParse(sTemplate, oData){

            var aTags = this.tags;
            var oKeys = this.keys;
            var sStartTag = aTags[0];
            var sEndTag = aTags[1];
            var bLowBrowser = !window.addEventListener;
            var sString = bLowBrowser ? [] : '';

            var aFragments = typeof sTemplate == 'string' ? sTemplate.split(sStartTag) : sTemplate;

            this.each(aFragments, function(sFragment, n){

                // 空字符串
                if(!sFragment){
                    return;
                }

                // 没有变量
                if(sFragment.indexOf(sEndTag) < 0){
                    __fMerge(sFragment);
                    return;
                }

                var aTmp = sFragment.split(sEndTag);
                var sStart = sFragment[0];
                var sKey = aTmp[0];
                var sStatic = aTmp[1];

                if(sKey[0] in oKeys){
                    sKey = sKey.substring(1);
                }

                var oValue = this.getValue(sKey, oData);
                var sValueType = typeof oValue;
                var bSkip = 0;

                if(sKey.indexOf('.') > 0){
                    var o = oData;
                    this.each(sKey.split('.'), function(s){
                        o = o[s];
                    });
                    oValue = o;
                }

                if(oValue instanceof Array){
                    sValueType = 'array';
                }

                switch(sStart){
                    case '#':
                        switch(sValueType){
                            case 'array':
                                bSkip = __fDoArray.call(this);
                                break;
                            default:
                                bSkip = __fDoBoolean.call(this, !oValue);
                                break;
                        }
                        break;

                    case '^':
                        bSkip = __fDoBoolean.call(this, !!oValue);
                        break;

                    case '/':
                        __fMerge(sStatic);
                        break;

                    case '.':
                        oValue = oData;
                        __fMerge(oValue, sStatic);
                        break;

                    default:
                        if(sValueType == 'function'){
                            oValue = oValue.call(oData);
                        }
                        __fMerge(oValue, sStatic);
                        break;
                }

                return bSkip;

                function __fDoArray(a){
                    var aSub = __fFindClose.call(this);
                    this.each(oValue, function(o){
                        __fMerge(sStatic, this.parse(aSub, o));
                    });
                    return aSub.length;
                }

                function __fDoBoolean(b){
                    if(b){
                        return __fFindClose.call(this).length;
                    }else{
                        __fMerge(sStatic);
                    }
                }

                function __fFindClose(){
                    return this.findClose(aFragments, sKey, n+1);
                }

            });

            return bLowBrowser ? sString.join('') : sString;

            function __fMerge(){
                for(i=0, l=arguments.length; i<l; i++){
                    if(bLowBrowser){
                        sString.push(arguments[i]);
                    }else{
                        sString += arguments[i];
                    }
                }
            }

            function __fToRegExp(s){
                return s.replace(/([\{\}\[\]\.\(\)])/g, '\\$1');
            }
        }

        function fSimplateRender(sTemplate, oData){
            return this.parse(sTemplate, oData);
        }
    }

    return pro;
});