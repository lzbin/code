/**
 * Created by zhenbin on 2016/4/20 0020.
 */
(function(){
    /**
     * @class base.Location
     * @static
     * @requires base
     * @requires base.Object
     * Location������չ�࣬�ṩurl�ĳ��ò���������������ȡ(����)������hash��
     *
     * #### ���˵��
     * *    Location��Ҫ�����ֲ�������ȡ���������Ӳ���
     * *    ������Ϣ����_parse����
     *
     * #### ˵��
     * *    ͨ��Location._parse(sUrl)ͳһ�Դ����url���н���
     * *    ���з���Ĭ������Ϊ��ǰ��url��Ҳ���������һ���������洫��ָ�����ӵ��ַ���
     *
     */

    var Location = {
        _paramCache: {a:1}, // ��������
        _parse: _fLocationParse,
        addParam: fLocationAddParam, // ��location������get��Ҫ�Ĳ���
        getParam: fLocationGetParam, // ��ȡ����
        getDomain: fLocationGetDomain, // ��ȡ����
        getParameters: fLocationGetParameters,
        getHash: fLocationGetHash, // ��ȡhash
        getHashValue: fLocationGetHashValue // ��ȡhash��ֵ
    };

    /**
     * ��location������get��Ҫ�Ĳ���
     * *    ����
     *      Location.addParam({sKey: sValue}, 'http://mail.163.com') => http://mail.163.com?sKey=sValue
     *
     * @method  addParam
     * @static
     * @param   {String/Object} oParams   ��Ҫ���ӵĲ�����string || object
     * @param   {String} [sHref] == false, ��Ĭ��Ϊ��ǰ��window.location.href
     * @param   {Boolean} [bNotCover] true: �������Ѵ��ڵĲ���
     * @return  {String}       ƴ�ӳɵ�url
     */

    function fLocationAddParam(oParams, sHref, bNotCover) {
        sHref = sHref || window.location.href;

        // ��hash��ȡ����
        var aUrl = sHref.split('#');
        var sUrl = aUrl[0];

        var sChar = sUrl.indexOf('?') > -1 ? '&' : '?';

        if (typeof oParams === 'string') {
            var sFirstChar = oParams.charAt(0);
            oParams = sFirstChar === '?' || sFirstChar === '&' ? oParams.slice(1) : oParams;
            sUrl += sChar + oParams;
        } else {
            for (var sKey in oParams) {

                // �ظ��Ĳ����Ͳ�����
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

        // �ж��Ƿ��Ѿ����ڲ���

        function _fHas(s, sParam) {
            return s.indexOf('?' + sParam) > -1 || s.indexOf('&' + sParam) > -1;
        }
    }

    /**
     * ��ȡ����
     * *    ����
     *      Location.getParam('sKey', 'http://mail.163.com?sKey=sValue') => sValue
     *
     * @method   getParam
     * @static
     * @param    {String}sName   ��Ҫ��ѯ�Ĳ���
     * @param    {String}[sHref] Ĭ��Ϊ��ǰ��location.href
     * @return   {String/Object}           ������ֵ�����ݲ��������� string || object
     */

    function fLocationGetParam(sName, sHref) {
        return this.getParameters(sHref)[sName];
    }

    /**
     * ��ȡȫ������
     * *    ����
     *      Location.getParameters('http://mail.163.com?sKey=sValue') => {sKey: sValue}
     *      Location.getParameters('http://mail.163.com?sKey=') => {sKey: ''}
     *      Location.getParameters('http://mail.163.com?sKey=#hehe') => {sKey: ''}
     *      Location.getParameters('http://mail.163.com?sKey') => {}
     *      Location.getParameters('http://mail.163.com') => {}
     *
     * @method   getParameters
     * @static
     * @param    {String}[sHref] Ĭ��Ϊ��ǰ��location.href
     * @return   {Object}      ��������
     */

    function fLocationGetParameters(sHref) {
        sHref = sHref || window.location.href;
        var oParameters = this._paramCache;

        var sName = sHref.replace(/(#.+)/g, ''); // ȥ��hash
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
     * ��ȡ����
     * *    ����
     *      Location.getDomain('http://mail.163.com?sKey=sValue') => 163.com
     *
     * @method   getDomain
     * @static
     * @param    {String}[sHref] Ĭ��Ϊ��ǰ��location.href
     * @return   {String}    ��������163.com, 126.com
     */

    function fLocationGetDomain(sHref) {
        var aInfo = this._parse(sHref).hostname.split('.');
        return aInfo.length < 2 ? '' : aInfo.reverse().slice(0, 2).reverse().join('.');
    }

    /**
     * ��ȡhash
     * *    ����
     *      Location.getHash('http://mail.163.com#test') => test
     *
     * @method   getHash
     * @static
     * @param    {String}[sHref] Ĭ��Ϊ��ǰ��location.href
     * @return   {String}        hash������#
     */

    function fLocationGetHash(sHref) {
        var sHash = this._parse(sHref).hash;
        sHash = !! sHash && sHash.length > 0 ? sHash.slice(1) : '';
        return sHash;
    }

    /**
     * ��ȡhash��ֵ
     * *    ����
     *      Location.getParam('sName', 'http://mail.163.com#sName=sValue') => sValue
     *
     * @method   getHashValue
     * @static
     * @param    {String}[sName] ��Ҫ��ѯ�Ĳ���
     * @param    {String}[sHref] Ĭ��Ϊ��ǰ��location.href
     * @return   {String}        hash����ֵ
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
     * ����ȫ����
     *
     * @method   _parse
     * @private
     * @param    {String}[sUrl] Ĭ��Ϊ��ǰ��location.href
     * @return   {Object}       �����Ϣ
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