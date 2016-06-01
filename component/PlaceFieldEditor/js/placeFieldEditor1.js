/**
 * Created by zhenbin on 2016/4/8 0008.
 */
/**
 * @param id
 * @param value
 * @param parentEle 父元素
 * @constructor
 */
function PlaceFieldEditor(id, value, parentEle)
{
    this.id = id;
    this.value = value;
    this.parentEle = parentEle;
    this.initValue = value ;

    this.initElements();
    this.initEvents();
}

PlaceFieldEditor.prototype = {
    constructor: PlaceFieldEditor,
    /**
     * 初始化所有元素
     */
    initElements: function ()
    {
        this.txtEle = $("<span/>");
        this.txtEle.text(this.value);

        this.textEle = $("<input type='text' />");
        this.textEle.val(this.value);

        this.btnWapper = $("<div style='display: inline;'/>");
        this.saveBtn = $("<input type='button' value='保存'/>");
        this.cancelBtn = $("<input type='button' value='取消'/>");
        this.btnWapper.append(this.saveBtn).append(this.cancelBtn);

        this.parentEle.append(this.txtEle).append(this.textEle).append(this.btnWapper);

        this.convertToReadable();
    },
    /**
     * 初始化所有事件
     */
    initEvents: function ()
    {
        var that = this;
        this.txtEle.on("click", function (event)
        {
            that.convertToEditable();
        });

        this.cancelBtn.on("click", function (event)
        {
            that.cancel();
        });

        this.saveBtn.on("click", function (event)
        {
            that.save();
        });

    },
    /**
     * 切换到编辑模式
     */
    convertToEditable: function ()
    {
        this.txtEle.hide();
        this.textEle.show();
        this.textEle.focus();

        if(this.getValue() == this.initValue )
        {
            this.textEle.val("");
        }

        this.btnWapper.show();
    },
    /**
     * 点击保存
     */
    save: function ()
    {
        this.setValue(this.textEle.val());
        this.txtEle.html(this.getValue().replace(/\n/g,"<br/>"));

        var url = "id=" + this.id + "&value=" + this.value;
//                alert(url);
        console.log(url);
        this.convertToReadable();
    },
    /**
     * 点击取消
     */
    cancel: function ()
    {
        this.textEle.val(this.getValue());
        this.convertToReadable();
    },
    /**
     * 切换到查看模式
     */
    convertToReadable: function ()
    {
        this.txtEle.show();
        this.textEle.hide();
        this.btnWapper.hide();
    },
    setValue: function (value)
    {
        this.value = value;
    },
    getValue: function ()
    {
        return this.value;
    }
}
;

/**
 * @param subClass  子类
 * @param superClass   父类
 */
function extend(subClass, superClass)
{
    var F = function ()
    {
    };
    F.prototype = superClass.prototype;
    //子类的prototype指向F的_proto_ ， _proto_又指向父类的prototype
    subClass.prototype = new F();
    //在子类上存储一个指向父类的prototype的属性，便于子类的构造方法中与父类的名称解耦 使用subClass.superClass.constructor.call代替superClass.call
    subClass.superClass = superClass.prototype;
}