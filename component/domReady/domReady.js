(function(){
    //保存domReady的事件队列
    var readyFnQueue = [];
    //判断DOM是否加载完毕
    var isReady = false;
    //判断DOMReady是否绑定
    var isBind = false;
    alert(readyFnQueue);
    /*执行domReady()
     *
     *@param    {function}
     *@execute  将事件处理程序压入事件队列,并绑定DOMContentLoaded
     *          如果DOM加载已经完成，则立即执行
     *@caller
     */
    function domReady(fn){
        if (isReady) {
            fn.call(window);
        }
        else{
            readyFnQueue.push(fn);
        }
        bindReady();
    }

    /*domReady事件绑定
     *
     *@param    null
     *@execute  现代浏览器通过addEvListener绑定DOMContentLoaded,包括ie9+
     ie6-8通过判断doScroll判断DOM是否加载完毕
     *@caller   domReady()
     */
    function bindReady(){
        if (isReady) return;
        if (isBind) return;
        isBind = true;

        if (window.addEventListener) {
            document.addEventListener('DOMContentLoaded',execFn,false);
        }
        else if (window.attachEvent) {
            doScroll();
        }
    }

    /*doScroll判断ie6-8的DOM是否加载完成
     *
     *@param    null
     *@execute  doScroll判断DOM是否加载完成
     *@caller   bindReady()
     */
    function doScroll(){
        try{
            document.documentElement.doScroll('left');
        }
        catch(error){
            return setTimeout(doScroll,20);
        }
        execFn();
    }

    /*执行事件队列
     *
     *@param    null
     *@execute  循环执行队列中的事件处理程序
     *@caller   bindReady()
     */
    function execFn(){
        if (!isReady) {
            isReady = true;
            for (var i = 0; i < readyFnQueue.length; i++) {
                readyFnQueue[i].call(window);
            }
            readyFnQueue = [];
        }
    }
    //注意，如果是异步加载的js就不要绑定domReady方法，不然函数不会执行，
    //因为异步加载的js下载之前，DOMContentLoaded已经触发，addEventListener执行时已经监听不到了

    window.domReady = domReady;
})();