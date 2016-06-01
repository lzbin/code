/**
 * Created by zhenbin on 2016/4/20 0020.
 */
(function(){
    /**
     * @class base.Location
     * @static
     * @requires base
     * @requires base.Object
     * Location方法拓展类，提供url的常用操作方法，包括获取(设置)参数、hash等
     *
     * #### 设计说明
     * *    Location主要有两种操作：获取和设置链接参数
     * *    链接信息的由_parse负责
     *
     * #### 说明
     * *    通过Location._parse(sUrl)统一对传入的url进行解析
     * *    所有方法默认链接为当前的url，也可以在最后一个参数后面传入指定链接的字符串
     *
     */

    var Location = {
        _paramCache: {a:1}, // 参数缓存
        _parse: _fLocationParse,
        addParam: fLocationAddParam, // 在location中增加get需要的参数
        getParam: fLocationGetParam, // 获取参数
        getDomain: fLocationGetDomain, // 获取域名
        getParameters: fLocationGetParameters,
        getHash: fLocationGetHash, // 获取hash
        getHashValue: fLocationGetHashValue // 获取hash键值
    };

    /**
     * 在location中增加get需要的参数
     * *    例子
     *      Location.addParam({sKey: sValue}, 'http://mail.163.com') => http://mail.163.com?sKey=sValue
     *
     * @method  addParam
     * @static
     * @param   {String/Object} oParams   需要增加的参数，string || object
     * @param   {String} [sHref] == false, 则默认为当前的window.location.href
     * @param   {Boolean} [bNotCover] true: 不覆盖已存在的参数
     * @return  {String}       拼接成的url
     */

    function fLocationAddParam(oParams, sHref, bNotCover) {
        sHref = sHref || window.location.href;

        // 将hash提取出来
        var aUrl = sHref.split('#');
        var sUrl = aUrl[0];

        var sChar = sUrl.indexOf('?') > -1 ? '&' : '?';

        if (typeof oParams === 'string') {
            var sFirstChar = oParams.charAt(0);
            oParams = sFirstChar === '?' || sFirstChar === '&' ? oParams.slice(1) : oParams;
            sUrl += sChar + oParams;
        } else {
            for (var sKey in oParams) {

                // 重复的参数就不加了
                if (!_fHas(sUrl, sKey)) {
                    sUrl += sChar + sKey + '=' + oParams[sKey];
                    sChar = '&';
                } else if (!bNotCover) {
                    sUrl = sUrl.replace(new RegExp(sKey + '=' + '[^&#]*'), sKey + '=' + oParams[sKey]);
                }
            }
        }

        aUrl[0] = sUrl;
        return aUrl.join('#');

        // 判断是否已经存在参数

        function _fHas(s, sParam) {
            return s.indexOf('?' + sParam) > -1 || s.indexOf('&' + sParam) > -1;
        }
    }

    /**
     * 获取参数
     * *    例子
     *      Location.getParam('sKey', 'http://mail.163.com?sKey=sValue') => sValue
     *
     * @method   getParam
     * @static
     * @param    {String}sName   需要查询的参数
     * @param    {String}[sHref] 默认为当前的location.href
     * @return   {String/Object}           参数的值，根据参数可能是 string || object
     */

    function fLocationGetParam(sName, sHref) {
        return this.getParameters(sHref)[sName];
    }

    /**
     * 获取全部参数
     * *    例子
     *      Location.getParameters('http://mail.163.com?sKey=sValue') => {sKey: sValue}
     *      Location.getParameters('http://mail.163.com?sKey=') => {sKey: ''}
     *      Location.getParameters('http://mail.163.com?sKey=#hehe') => {sKey: ''}
     *      Location.getParameters('http://mail.163.com?sKey') => {}
     *      Location.getParameters('http://mail.163.com') => {}
     *
     * @method   getParameters
     * @static
     * @param    {String}[sHref] 默认为当前的location.href
     * @return   {Object}      参数对象
     */

    function fLocationGetParameters(sHref) {
        sHref = sHref || window.location.href;
        var oParameters = this._paramCache;

        var sName = sHref.replace(/(#.+)/g, ''); // 去掉hash
        if (oParameters[sName]) {
            return oParameters[sName];
        }

        var sQuery = fTrim(this._parse(sHref).query);
        var aParameter = sQuery ? sQuery.split('&') : [];
        var aPair, oCache = {};

        if (aParameter.length > 0) {
            for (var i = 0, l = aParameter.length; i < l; i++) {
                aPair = /([^=]+)=([^=]*)/.exec(aParameter[i]);
                if (aPair) {
                    oCache[aPair[1]] = aPair[2];
                }
            }
            oParameters[sName] = oCache;
        }
        return oCache;

        function fTrim(s){
            return s.replace(/(^\s*|\s*$)/g, '');
        }
    }

    /**
     * 获取域名
     * *    例子
     *      Location.getDomain('http://mail.163.com?sKey=sValue') => 163.com
     *
     * @method   getDomain
     * @static
     * @param    {String}[sHref] 默认为当前的location.href
     * @return   {String}    域名，如163.com, 126.com
     */

    function fLocationGetDomain(sHref) {
        var aInfo = this._parse(sHref).hostname.split('.');
        return aInfo.length < 2 ? '' : aInfo.reverse().slice(0, 2).reverse().join('.');
    }

    /**
     * 获取hash
     * *    例子
     *      Location.getHash('http://mail.163.com#test') => test
     *
     * @method   getHash
     * @static
     * @param    {String}[sHref] 默认为当前的location.href
     * @return   {String}        hash，不带#
     */

    function fLocationGetHash(sHref) {
        var sHash = this._parse(sHref).hash;
        sHash = !! sHash && sHash.length > 0 ? sHash.slice(1) : '';
        return sHash;
    }

    /**
     * 获取hash键值
     * *    例子
     *      Location.getParam('sName', 'http://mail.163.com#sName=sValue') => sValue
     *
     * @method   getHashValue
     * @static
     * @param    {String}[sName] 需要查询的参数
     * @param    {String}[sHref] 默认为当前的location.href
     * @return   {String}        hash键的值
     */

    function fLocationGetHashValue(sName, sHref) {
        var sHash = this._parse(sHref).hash;
        sHash = !! sHash && sHash.length > 0 ? sHash.slice(1) : '';

        var aParameter = sHash.split('&');
        var aPair, oCache = '';

        if (aParameter.length > 0) {
            for (var i = 0, l = aParameter.length; i < l; i++) {
                aPair = /([^=]+)=([^=]*)/.exec(aParameter[i]);
                if (aPair[1] == sName) {
                    oCache = aPair[2];
                    return oCache
                }
            }
        }
        return oCache;
    }

    /**
     * 链接全解析
     *
     * @method   _parse
     * @private
     * @param    {String}[sUrl] 默认为当前的location.href
     * @return   {Object}       相关信息
     */
    function _fLocationParse(sUrl) {
        sUrl = sUrl || window.location.href;
        var a = document.createElement('a');
        a.href = sUrl;
        return {
            href: a.href,
            host: a.host || window.location.host,
            port: ('0' === a.port || '' === a.port) ? window.location.port : a.port,
            hash: a.hash,
            hostname: a.hostname || window.location.hostname,
            pathname: a.pathname.charAt(0) !== '/' ? '/' + a.pathname : a.pathname,
            protocol: !a.protocol || ':' === a.protocol ? location.protocol : a.protocol,
            search: a.search,
            query: a.search.slice(1)
        };
    }

    return window.Location = Location;
})();