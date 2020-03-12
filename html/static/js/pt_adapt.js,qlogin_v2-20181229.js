
;!function() {

    window.ptlogin_callback = function(msg) {
        try {
            var data = JSON.parse(msg.data);
            switch (data.action) {
                case 'close':
                    window.ptlogin2_onClose && ptlogin2_onClose();
                    break;
                case 'resize':
                    window.ptlogin2_onResize && ptlogin2_onResize(data.width, data.height);
                    break;
		case 'qclogin_success': //Handle graph.qq.com/oauth2.0/login_jump message
                    //check origin
		    if (msg.origin !== 'https://graph.qq.com') {
		       return;
		    }
		    Q.agree(); 
		    break;
		default: //什么也不做，便于我们扩展接口
		    break;
	    }
            // 考虑到ptlogin接口的扩展性，希望业务在对于data.action的条件处理也要保持一定的可扩展性
            // 如不要采用：data.action == 'resize' ? ptlogin2_onResize(data.width, data.height) : ptlogin2_onClose()
            // 一旦ptlogin支持了新的接口，那么该代码将会无法正常工作，影响业务正常使用
        } catch (e) {}
    }
	
	if (typeof window.postMessage == 'undefined') {
		var vbs = [
			"Function vbs_ptlogin_callback(data)",
				"ptlogin_callback data",
			"End Function",
			'navigator.ptlogin_callback = GetRef("vbs_ptlogin_callback")'
		].join("\r\n");
		navigator.ptlogin_callback = null;
		window.execScript && window.execScript(vbs, "VBScript");
	} else {
		function listener(event) { ptlogin_callback((event || window.event)); }
		if (window.addEventListener) {
			window.addEventListener('message', listener, false);
		} else {
			window.attachEvent('onmessage', listener);
		}
	}


	
}();

	            	
// JS 加载完成
_speedTiming.push(+new Date);

/**
 * min underscore utils
 */
(function () {
    var root = this;
    var _ = root['_'] || {};

    var ArrayProto = Array.prototype,
        concat = ArrayProto.concat,
        slice = ArrayProto.slice;

    /**
     * Function: indexOf
     * ECMA-262-5 15.4.4.14
     * Returns the first (least) index of an element within the array
     * equal to the specified value, or -1 if none is found.
     *
     * Parameters:
     *  array - {Array}
     *     searchElement - {Mixed}
     *     fromIndex {optional} - {number}
     *
     * Returns:
     *     {number}
     *
     * Example:
     * (code)
     *  indexOf(['a','b','c'], 'b') === 1
     * (end)
     */
    _.indexOf = function (array, searchElement, fromIndex) {

        if (array.indexOf) {
            return array.indexOf(searchElement, fromIndex);
        }

        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.
        var len = array.length;

        if (len === 0) {
            return -1;
        }

        if (fromIndex === undefined) {
            fromIndex = 0;
        } else {
            // If fromIndex is negative, fromIndex from the end of the array.
            if (fromIndex < 0)
                fromIndex = len + fromIndex;
            // If fromIndex is still negative, search the entire array.
            if (fromIndex < 0)
                fromIndex = 0;
        }
        if (searchElement !== undefined) {
            for (var i = fromIndex; i < len; i++) {
                if (array[i] === searchElement)
                    return i;
            }
            return -1;
        }
        // Lookup through the array.
        for (var j = fromIndex; j < len; j++) {
            if (array[j] === undefined && j in array) {
                return j;
            }
        }
        return -1;
    };


    _.forEach = function (array, callbackfn, thisArg){

        if (array.forEach) {
            return array.forEach(callbackfn, thisArg);
        }
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.
        var len = array.length;
        for (var i = 0; i < len; ++i) {
            var current = array[i];
            if (current !== undefined || i in array) {
                callbackfn.call(thisArg, current, i, array);
            }
        }
    };


    /**
     * Function: filter
     * ECMA-262-5 15.4.4.20
     * Creates a new array with all of the elements of array array
     * for which the provided filtering function returns true.
     *
     * Parameters:
     *  array - {Array}
     *  callbackfn - {Function}
     *  thisArg - {Object}
     *
     * Returns:
     *  {Array}
     */

    _.filter = function (array, callbackfn, thisArg) {

        if (array.filter) {
            return array.filter(callbackfn, thisArg);
        }

        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.
        var len = array.length,
            result = [];
        for (var i = 0; i < len; ++i) {
            var current = array[i];
            if (current !== undefined || i in array) {
                callbackfn.call(thisArg, current, i, array) && result.push(array[i]);
            }
        }

        return result;
    };

    _.difference = function (array) {

        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function (value) {
            return !(_.indexOf(rest, value) > -1);
        });
    };


    root['_'] = _;

})();
// formsender Module
!(function (global, undefined) {

    /*mini FormSender*/
    var FormSender = global['FormSender'] = function (url, name, para) {
        this.url = url;
        this.name = name;
        this.para = this.parasPara(para);

        this.status = 0;

        arguments.callee._pool[name] = this;
    };

    FormSender.prototype.send = function () {
        //debugger
        if (this.status != 1) {
            var fmr = document.createElement("form");
            fmr.style.display = "none";
            for (var i in this.para) {
                var ipt = document.createElement('input');
                ipt.name = i;
                ipt.value = this.para[i];
                fmr.appendChild(ipt);
            }

            fmr.action = this.url;
            fmr.method = "POST";
            fmr.style.display = "none";
            //fmr.target = this.getFrame().name;
            //this.getFrame().callback = this.onSuccess;

            document.body.appendChild(fmr);

            fmr.submit();
        }
    };
    FormSender.prototype.parasPara = function (o) {
        var tmp = [];
        if (typeof(o) != 'object') {
            o = {};
            //?x=1&b=2&c=3
            //o.replace(/(?|&)[^=]*=[^=]*);
        }
        return o;
    };
    FormSender.prototype.getFrame = function () {
        return FormSender._frame || function () {
            FormSender._frame = document.createElement('iframe');
            FormSender._frame.name = "__FS_Helper_";
            FormSender._frame.height = "300";
            document.body.appendChild(FormSender._frame);
            return FormSender._frame;
        }()
    };
    FormSender.prototype.onSuccess = function () {
    };
    FormSender.prototype.onError = function () {
    };

    FormSender._pool = {};
    FormSender._frame = null;
})(this);
/**
 * connectjs report kit
 * @author yuanyan@tencent.com
 */
(function() {
    var root = this;

    var previousNS = root['Q'];
    var Q = previousNS? previousNS: root['Q'] = {};

    /**
     * mix object
     * @param destination
     * @param source
     * @param overwrite
     * @param whitelist
     * @return {object}
     */
    Q.mix = function (destination, source, overwrite, whitelist) {
        // missing argument(s)
        if (!source || !destination) {
            return destination;
        }

        // overwrite mode by default
        if (undefined === overwrite) {
            overwrite = true;
        }

        // check whitelist and build a map
        var whitelistLen,map={};
        if (whitelist && (whitelistLen = whitelist.length)) {
            for(var i=0; i < whitelistLen; i++){
                map[whitelist[i]] = true;
            }
        }
        for (var prop in source) {
            if (overwrite && !(prop in map) || !(prop in destination)) {
                destination[prop] = source[prop];
            }
        }
        return destination;
    };


    /**
     * get current timestamp
     * @return {string}
     */
    Q.getTimestamp = function () {
        return +new Date;
    };

    /**
     * Function: template
     * 简单的模板机制
     *
     * Parameters:
     * 	temp - {String} 模板
     * 	val - {Object} 模板对象
     *
     * Returns:
     * 	{String}
     *
     * Example:
     * (code)
     * template("${i},${j}",{i:11,j:22}) === 11,22
     * (end)
     */
    Q.template = function(temp, val){

        return temp.replace(/\$\{(\w+)\}/g, function(m, i){
            if (val[i]) {
                return val[i];
            }
            else { //模板对象未定义时
                return "";
            }
        });

    };

    Q.on = function(who, when, how){

        if(who.attachEvent){
            who.attachEvent('on' + when, how);
        }else{
            who.addEventListener(when, how, false);
        }
    };

    var tasks = [];
    var isUnloadEventAdded  = false;

    /**
     * 手动立即上报, 无需等定时器触发
     * @param callback 成功上报后回调
     * @param timeout  超时设置，避免上报cgi未返回
     */
    Q.report =  function(callback, timeout){

        var counter = 0, len = tasks.length;

        timeout = timeout||2000;

        if(tasks[0]){
            for(var i= 0; i< len; i++){
                var task = tasks.shift();
                if(task){
                    task.isTicking = false;
                    task(function(){
                        if( ++counter === len && callback && !callback.isCalled ){
                            callback.isCalled = true;
                            callback();
                        }
                    })
                }
            }

            callback && setTimeout(function(){
                if(!callback.isCalled){
                    callback.isCalled = true;
                    callback();
                }
            },timeout);

        }else{
            callback && callback();
        }

        Q.tick.isTicking = false;

    };


    Q.report.delay = 500;    // 上报延迟时间

    Q.tick = function(task){

        if(!task.isTicking){
            task.isTicking = true;
            tasks.push(task);
        }

        // 默认开启一个延迟0.5秒上报的定时器
        if(!Q.tick.isTicking){
            setTimeout(Q.report, Q.report.delay);
            Q.tick.isTicking = true;
        }

        // 使用beforeunload事件打点并不总是可靠的，总丢失率在20%左右，其中各浏览器的表现各不相同
        // @more http://ued.taobao.com/blog/2012/08/23/the_loss_rate_statistics_of_beforeunload/
        if(!isUnloadEventAdded){
            Q.on(window, "beforeunload", function(evt){
                // 包裹一个function，忽略evt事件对象
                Q.report();
            });
            isUnloadEventAdded = true;
        }

    };


    var GLOBAL_IMAGE_NAME = "__tc_global_image_";
    var GLOBAL_IMAGE_ID = Q.getTimestamp();

    Q.send = function(url, callback){
        if (location.protocol === 'https:' && url.indexOf("http://") > -1) return; // remove http request
        GLOBAL_IMAGE_ID  += 1;
        url  += ("&t=" + GLOBAL_IMAGE_ID);

        var globalImageVar = GLOBAL_IMAGE_NAME + GLOBAL_IMAGE_ID ;
        // public to global, avoid variable be recycled in old IE
        root[globalImageVar] = new Image();

        if(callback){
            root[globalImageVar].onload = root[globalImageVar].onerror = function(){
                callback();
                // ie6-8下不能删除宿主对象下的变量
                // more: http://perfectionkills.com/understanding-delete/#ie_bugs
                // try{
                //     delete root[globalImageVar];
                // }catch(e){
                //     root[globalImageVar] = null;
                // }

                // 只设置为null
                // from: http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml#delete
                // In modern JavaScript engines, changing the number of properties on an object is much slower than reassigning the values.
                // The delete keyword should be avoided except when it is necessary to remove a property from an object's iterated list of keys,
                // or to change the result of if (key in obj).
                root[globalImageVar] = null;
            };
        }

        root[globalImageVar].src = url;
    };

    /**
     * 变身忍术，即 noConflict，避免命名空间冲突，返回 Q 的引用
     * @return {Object}
     */
    Q.ninja = function(){
        root.Q = previousNS;
        return this;
    };

})();
/*
 调用示例：
 http://badjs.qq.com/cgi-bin/js_report?bid=101&mid=12345&msg=errMsg|_|www.soso.com|_|123|_|IE7|_|window7|_|1024|_|768|_|flash version
 CGI名称：js_report

 参数说明：

 bid: 业务id（必填，由jackyue分配）
 mid: monitor上报id（可以不填）
 msg: 最多支持20个字段，用“|_|”分隔

 第一个字段：出错信息（必填）
 第二个字段：URL（必填）
 第三个字段：错误行号（必填）
 　　 第四个字段：浏览器版本
 　　 第五个字段：操作系统版本
 　　 第六个字段：屏幕可用工作区高度：window.screen.availHeight
 　　 第七个字段：屏幕可用工作区宽度：window.screen.availWidth
 　　 第八个字段：flash 版本
 　　 其他字段自定义
 　　
 调用成功返回结果：{"ec":0}
 　　错误返回结果：{"ec":1, em:"errMsg"}

 */
(function() {

    // 上报参数的常量值
    var BID = 130;
    var REPORT_URL = 'http://badjs.qq.com/cgi-bin/js_report?';

    function error(monitorId){
        window.onerror = function(errorMsg, url, lineNumber) {

            if(monitorId){
                Q.monitor(monitorId);
            }
            // Q.log('Script Error: ' + errorMsg + ', line:' + lineNumber + ', url:' + url);

            // http://nlog.server.com
            var bid = 'bid=' + BID;
            // monitor上报(仅统计次数)
            // http://monitor.server.com/
            var mid = '';
            var msg = 'msg=' + encodeURIComponent([errorMsg, url, lineNumber, navigator.userAgent].join("|_|"));

            var src = REPORT_URL+ [bid,mid,msg].join("&");

            Q.send(src);
        };
    }

    Q.mix(Q, {
        error: error
    });
})();
/**
 * http://oz.isd.com
 */

(function() {

    // 上报参数的常量值
    var REPORT_URL = 'http://isdspeed.qq.com/cgi-bin/r.cgi?';   // oz.isd.com
	if (location.protocol === 'https:')
	    REPORT_URL = 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi?';   // oz.isd.com

    /**
     * ISD 上报
     * @param f1
     * @param f2
     * @param f3
     * @param timing
     */
    function isd(f1, f2, f3, timing){
        var reportData = [],
            point,
            startPoint = timing[0];

        for (var i = 1, l = timing.length; i < l; i++) {
            point = timing[i];
            point = (point ? (point - startPoint) : 0);

            // 如果某个时间点花费时间为0，则此时间点数据不上报
            if (point > 0) {
                // 标记位从1开始
                reportData.push( i + '=' + point);
            }
        }

        var url =  REPORT_URL + 'flag1=' + f1 + '&flag2=' + f2 + '&flag3=' + f3 + '&' + reportData.join('&');
        Q.send(url);
    }

    /**
     *
     * @param f1
     * @param f2
     * @param f3
     * @return {Speed}
     * @constructor
     */
    function Speed(f1, f2, f3){

        if (!(this instanceof Speed)) {
            return new Speed(f1, f2, f3);
        }

        this.f1 = f1;
        this.f2 = f2;
        this.f3 = f3;
        this.timing = [];
    }

    Speed.prototype.mark = function(ts) {
        return this.timing.push( ts || Q.getTimestamp());
    };

    Speed.prototype.report = function(){
        isd(this.f1,this.f2,this.f3, this.timing);
    };

    /**
     * 上报Performance timing数据
     *
     * @param f1          flag1简写，测速系统中的业务ID
     * @param f2 f2       flag2简写，测速的站点ID
     * @param f3_ie f3_ie flag3简写，测速的页面ID  （因为使用过程中我们发现IE9的某些数据存在异常，如果IE9和chrome合并统计，会影响分析结果，所以这里建议分开统计）
     * @param f3_c f3_c   flag3简写，测速的页面ID  （如果为空，则IE9和chrome合并统计）
     */
    function performance(f1, f2, f3_ie, f3_c) {

        var timing, perf = (window.webkitPerformance ? window.webkitPerformance : window.msPerformance),
            reportPoints = ['navigationStart', "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"],
            f3 = f3_ie;

        perf = (perf ? perf : window.performance);

        if (perf && (timing = perf.timing)) {
            // performance规范最新属性
            if (timing.domContentLoadedEventStart && f3_c) {
                f3 = f3_c;

            } else if (timing.domContentLoadedStart) {
                // 早期的performance规范属性
                reportPoints.splice(15, 2, 'domContentLoadedStart', 'domContentLoadedEnd');
                if (f3_c) {
                    f3 = f3_c;
                }

            } else {
                // IE 9 中 domContentLoaded 的属性，IE10 遵守了新规范
                // @see http://blogs.msdn.com/b/ie/archive/2010/11/09/web-page-performance-in-a-standards-compliant-and-interoperable-way.aspx
                reportPoints.splice(15, 2, 'domContentLoaded', 'domContentLoaded');
            }

            var timingArray = [];

            for(var i=0,l=reportPoints.length;i<l;i++){
                timingArray[i] = timing[reportPoints[i]];
            }

            isd(f1, f2, f3, timingArray);
        }

    }



    Q.mix(Q, {
        isd: isd
        ,performance : performance
        ,speed : Speed
    });

})();(function() {

    // 上报参数的常量值
    var REPORT_URL = 'http://cgi.connect.qq.com/report/report_vm?';
    var REPORT_MAX_NUM = 6;                                    // 每次上报项数, 需在合理范围内，避免url超长

    var bernoulliQueue = [],
        globalSetup = {};

    /**
     * 伯努利上报队列
     */
    function reportBernoulliQueue(callback){
        if(bernoulliQueue[0]) {

            var item, logArr=[];

            // API 上报
            for(var i= 0, l = bernoulliQueue.length; i < REPORT_MAX_NUM && i< l; i++){ // 单次最多上报项
                item = bernoulliQueue.shift();

                if(item.nvalue){
                    // strValue_nValue_elt | strValue_nValue_elt
                    logArr.push([item.obj || globalSetup.obj || 0 , item.nvalue, item.elt].join("_"));
                }
                else if(item.obj){

                    var obj = {
                        'opername' : item.opername || globalSetup.opername,       // 业务： connnect
                        'name' : item.name || globalSetup.name,                     // 模块： authorize$pc
                        'action' : item.action || globalSetup.action,             // 行为： cancel
                        'obj' : item.obj
                    };

                    var strValue = Q.template('{"opername":"${opername}","name":"${name}","action":"${action}","obj":"${obj}"}', obj);
                    // strValue_nValue_elt | strValue_nValue_elt
                    logArr.push([strValue,0,item.elt].join("_"));

                }

            }

            // 发送之前需encode一次， 支持两种格式:
            // 1. strValue_nValue_elt | strValue_nValue_elt
            // 2. name-opername-action-obj_nvalue_elt | name-opername-action-obj_nvalue_elt TODO: 已规划，未支持
            var url = REPORT_URL  + 'tag=0&log=' + encodeURIComponent(logArr.join('|'));


            // 如果还有上报项
            if(bernoulliQueue[0]){
                // 并行上报的回调计数器
                var counter = 0;
                var cb = function(){
                    if(++counter === 2){
                        callback();
                    }
                };
                Q.send(url, cb);
                reportBernoulliQueue(cb);
            }else{
                Q.send(url, callback);
            }

        }else{
            callback && callback();
        }

    }

    /**
     * 伯努利上报
     * @param value obj字符串 或 nValue数字 或 strValue对象
     * @param obj   表示obj的strValue值 (可选)
     * @param elt   时长，单位毫秒 (可选)
     */
    function bernoulli(value, obj, elt){

        var item= {}, valueType = typeof value;

        if(valueType === 'number'){
            item.nvalue = value;
            obj && (item.obj = obj);
        }else if(valueType === 'object'){
            item = value;
        }else if(valueType === 'string'){
            item = {obj: value};
        }

        item.elt = elt || 0;

        bernoulliQueue.push(item);

        Q.tick(reportBernoulliQueue);
    }


    /**
     * 全局的上报内容配置，华丽的jQuery命名风格 jQuery.ajaxSetup
     * @param settings
     * @return {Object}
     */
    function bernoulliSetup(settings){
        return globalSetup = Q.mix(globalSetup, settings);
    }


    Q.mix(Q, {
        bernoulli: bernoulli,
        bernoulliSetup: bernoulliSetup
    });


})();
/**
 * http://monitor.server.com/
 */

(function() {

    // 上报参数的常量值
    var REPORT_URL = "http://cgi.connect.qq.com/report/report_vm?"; // CGI接口人： ethanwei(魏伟强);
    var monitorQueue = [];

    function genReportUrl(monitors){
        return REPORT_URL + "monitors=" + "["+monitors+"]"
    }

    /**
     * monitor 上报队列
     */
    function reportMonitorQueue(callback){

        if(monitorQueue[0]){ // 忽略值为0的情况，monitor id 必然不等于 0，这里不做额外判断
            var url = genReportUrl(monitorQueue);
            monitorQueue = []; // 清空
            Q.send(url, callback);

        }else{
            callback && callback();
        }

    }


    /**
     * monitor 上报
     * @param id  monitor.server.com 申请到 id 值
     * @param isImmediately 是否立即上报，默认会放入monitor上报池
     * @param callback
     */
    function monitor(id, isImmediately, callback) {

        if (isImmediately) {
            var url = genReportUrl(id);
            // 立即上报时全部走WEB通道上报
            Q.send(url, callback);

        } else {
            // 放入monitor上报池
            monitorQueue.push(id);
            Q.tick(reportMonitorQueue);
        }

    }


    Q.mix(Q, {
        monitor: monitor
    });


})();

var getUuid = (function(){
    // generate golobally unique identifier
    var uid = "";
    var guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    };

    var getCookie = function(name){
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
        m = document.cookie.match(r);
        return (!m ? "": m[1]);
    };

    var cookieUid = getCookie("ui");
    if(cookieUid){
        uid = cookieUid;
    }else{
        uid = guid();

    }

    var cookie = "ui=" + uid + ";domain=" + location.host + ";path=/;max-age=" + (60 * 60 * 24 * 356);
    document.cookie = cookie;

    return function(){
        return uid;
    };
})();

Q.getUuid = getUuid;

Q.reportImages = [new Image(), new Image(), new Image(), new Image(), new Image()];

/**
 * 使用前修改KY
 * @param {String} eventId  事件id
 * @param {Object} data  参数  传入所在平台的入口平台 等  uin可不传 大小写参照邮件
 */

var getPlatform = (function(){
    var platform = "PC";

    var ua = window.navigator.userAgent;

    if(/iPhone/.test(ua)){
        platform = "iPhone";
    }else if(/Android/.test(ua)){
        platform = "Android";
    }else if(/Windows Phone/.test(ua)){
        platform = "WindowPhone";
    }

    return function(){
        return platform;
    };
})();

var MTA = (function() {
  function mtaReport(eventId, data){
    var getParamsFromUrl = function(name){
        var hash = window.location.hash;
        var reg = new RegExp("(?:^|&)" + name + "=([^=&]+)(?:&|$)");
        var result;

        hash = hash.replace(/^#/, "");
        result = reg.exec(hash);

        if(result){
            return result[1];
        }
    };

    var kyMap = {
        "Android": "AJQL249T5CUA",
        "PC": "AH46I8G5IHWE",
        "iPhone": "I2KN7UR1DG5U"
    };

    var platform = getPlatform();
    var KY = kyMap[platform] || kyMap['PC'];
    var SDK = getParamsFromUrl("SDK") || getParamsFromUrl("sdk") || "";
    var ui = getParamsFromUrl("ui") || getParamsFromUrl("UI") || "";

    var stringify = function(data){
        if(window["JSON"]){
            return JSON.stringify(data);
        }else{
            var s = [];
            for(var i in data){
                if(typeof data[i] == "object"){
                    s.push("\"" + i + "\":" + stringify(data[i]));
                }else{
                    s.push("\"" + i + "\":" + (data[i]));
                }
            }

            return "{" + s.join(",") + "}";
        }
    };

    var getCookie = function(name){
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
        m = document.cookie.match(r);
        return (!m ? "": m[1]);
    };


    var uin = getCookie("uin") || 0;
    if (uin && (/^o([0-9]+)$/).test(uin)) {
        var g_iUin = parseFloat(RegExp.$1);
    } else {
        var g_iUin = 0;
    }

    var reportData = {
        ky: KY,
        ui: ui || getUuid(),
        et: 1000,
        ts: ~~ (+ new Date / 1000),
        ei: eventId,
        du: 1,
        kv: data
    };

    var kvData = {
        Platform: platform || "PC",
        Appid: data.appid || data.Appid || "",
        UIN: data.UIN || g_iUin,
        Entrance: platform == "PC" ? "PC" : "H5",
        Time: "",
        SDK: SDK || "",
        Ext1: ""
    };

    if(data.Time){
        kvData.Time = data.Time;
    }else{
        delete kvData.Time;
    }

    if(data.Ext1){
        kvData.Ext1 = data.Ext1;
    }else{
        delete kvData.Ext1;
    }

    reportData.kv = kvData;

    var cgi = "http://cgi.connect.qq.com/report/mstat/report";
    var url = cgi + "?data=[" + stringify(reportData) + "]";

    var img = Q.reportImages.shift();
    !img && (img = new Image());
	if (location.protocol !== 'https:')
		img.src = url;
    img.onload = img.error = function(){
        Q.reportImages.push(this);
    };
}

return mtaReport;
})();


/**
 * @description SNG监控上报
 * @version 1.0
 * @author johnnyguo
 *
 * @模块接口:
 * {function} init 初始化
 * {function} report 上报函数
 *
 * @Usage
 * 示例: H5分享Qzone
 * 先在登录后进行初始化: MM.init(1000128, '175259305', 'QC_WEB');
 * 点击分享, ajax请求前: var t1 = +new Date;
 * cgi成功callback内:    var t2 = +new Date; MM.report('http://openmobile.qq.com/api/share_qzone', '0', t2-t1);
 *
 * @TODO
 * 支持批量上报
 */
window.MM = (function(){
    var image = new Image(),
        paramObj = {};

    /**
     * @param {string} cgi cgi路径, 不携带参数, 例如: https://openmobile.qq.com/oauth2.0/m_sdkauthorize
     * @param {string} retcode 返回码, 透传cgi的retcode
     * @param {string} tmcost cgi耗时, 在请求cgi前打"请求时间戳"t1, 执行callback时马上打"响应时间戳"t2
     *                          此处传入t2-t1的值, 单位为ms
     * @param {object} extra 扩展参数对象
     */
    var report = function(cgi, retcode, tmcost, extra){
        var url,
            paramArr = [];

        // 处理上报项
        paramObj.commandid = cgi;
        paramObj.resultcode = retcode;
        paramObj.tmcost = tmcost;
        if(extra){
            for(var i in extra){
                if(extra.hasOwnProperty(i)){
                    paramObj[i] = extra[i];
                }
            }
        }

        if(retcode == 0){
            // 成功的上报采样为1/20
            // frequency为采样分母
            paramObj.frequency = 20;
            var ranNum = Math.floor(Math.random() * 100 + 1);
            if(ranNum > 5){
                return;
            }
        } else {
            paramObj.frequency = 1;
        }

        for(var j in paramObj){
            if(paramObj.hasOwnProperty(j)){
                paramArr.push( j + "=" + encodeURIComponent( paramObj[j] ) );
            }
        }
        url = "http://wspeed.qq.com/w.cgi?" + paramArr.join("&");
		if (location.protocol !== 'https:')
			image.src = url;
    };

    /**
     * @param {string} appid 可到http://m.isd.com/app/mm 申请
     *                 互联Web: 1000128, 查找Web: 1000130
     * @param {string} uin 用户qq号
     * @param {string} version 版本号 'QC_WEB' -> 互联, 'FIND_WEB_4.2' -> 查找
     */
    var init = function(appid, uin, version){
        paramObj = {
            appid : appid,
            touin : uin,
            releaseversion : version,
            frequency : 1
        };
    };

    return {
        init: init,
        report : report
    };
})();

// MM.init(1000128, '175259305', 'QC_WEB');

Q.mm = MM;
Q.mta = MTA;
// base Module
!(function (global, undefined) {


    if(!document.getElementsByClassName){
        document.getElementsByClassName = function(className, element){
            var children = (element || document).getElementsByTagName('*');
            var elements = new Array();
            for (var i=0; i<children.length; i++){
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j=0; j<classNames.length; j++){
                    if (classNames[j] == className){
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        };
    }

})(this);
// utils Module
!(function (global, undefined) {

  Q.noop = function(){};

  Q.ie = (function(){
    if(window.ActiveXObject){
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        return parseInt( RegExp.$1 );
    }
  })();

  Q.cookiedomainPrefix = "qq.com";

  /**
   * 获取对应key的cookies值
   * 没有则返回空字符串
   * @param  {String} name 要获取的key值
   */
  Q.getCookie = function(name) {
    var r = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)'),
      m = document.cookie.match(r);
    return (!m ? '' : m[1]);
  };
  /**
   * 获取g_tk
   */
  Q.getToken = function() {
    var str = Q.getCookie('p_skey') || '',
      hash = 5381;
    for (var i = 0, len = str.length; i < len; ++i) {
      hash += (hash << 5) + str.charCodeAt(i);
    }
    return hash & 0x7fffffff;
  };

  Q.setCookie = function setCookie(name, value, domain, path, hour){
    if (hour) {
      var expire = new Date();
      expire.setTime(expire.getTime() + 3600000 * hour);
    }
    document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + Q.cookiedomainPrefix + ";"));
    return true;
  };

  Q.removeCookie = function removeCookie(name, domain, path) {
    document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + Q.cookiedomainPrefix + ";"));
  };
  /**
   * 注销
   */
  Q.logout = function logout() {
    //TCISD.pv("open.qzone.qq.com", "connect_acount_change");
    if (confirm("您确定要使用其它号码登录吗？")) {
      for (var i = 0, ar = ["uin", "luin", "lskey", "skey", "zzpaneluin", "zzpanelkey", "prvk", "tab"], l = ar.length; i < l; i++) {
        Q.removeCookie(ar[i]);
      }
      location.reload(true);
    }
  };

  /**
   * 获取url参数
   */
  Q.getParameter = function getParameter(name) {
    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"), m = location.href.match(r);
    return decodeURIComponent(!m ? "" : m[2]);
  };

  Q.disagree = function disagree(){
    window.close();
  };


  Q.addEventHandler = function (oTarget, sEventType, fnHandler, aArgs) {
    if(!oTarget) return;
    var handler = function() {
      // IE明确的提示要求apply的第二个参数是Array或arguments, 不能为undefined
      fnHandler.apply(oTarget, aArgs||[]);
    };
    if (oTarget.addEventListener) {
      oTarget.addEventListener(sEventType, handler, false);
    } else if (oTarget.attachEvent) {
      oTarget.attachEvent('on' + sEventType, handler);
    } else {
      oTarget['on' + sEventType] = handler;
    }
  };

  Q.addClass  = function (el, className) {
    if (!el) return;
    if(el.classList) {
      el.classList.add(className);
    } else {
      el.className = el.className + ' ' + className;
    }
  };

  Q.hasClass = function (el, className){
    if (!el || !className)
        return false;
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
    }
  };

  Q.removeClass = function(el, className){
    if (!el || !className || !Q.hasClass(el, className)) return;
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
    }
  };

  Q.getClientWidth = function getClientWidth(doc) {
    var _doc = doc || document;
    return _doc.compatMode == 'CSS1Compat' ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
  };

  Q.throttle = function (opt) {
    /*weber的函数节流*/
    var timer = null;
    var t_start;
    var fn = opt.fn,
      context = opt.context,
      delay = opt.delay || 100,
      mustRunDelay = opt.mustRunDelay;

    return function () {
      var args = arguments, t_curr = +new Date();
      context = context || this;

      //如果在delay时间段内发生两次请求，则前一次请求会被清除
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_curr;
      }
      if (mustRunDelay && t_curr - t_start >= mustRunDelay) {
        //到了必须执行一次的时间
        fn.apply(context, args);
        t_start = t_curr;
      }
      else {
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      }
    };
  };

  Q.getCgi = function() {
    return [document.location.origin, document.location.pathname].join('');
  };

  Q.cgi = [document.location.origin, document.location.pathname].join('');

  Q.appid = Q.getParameter('client_id');

  Q.toQueryString = function (o) {
        o = o || {};
        var r = [];
        for (var p in o) {
            r.push(encodeURIComponent(p) + "=" + encodeURIComponent(o[p]));
        }
        return r.join("&");
    };

})(this);
// hack Module
!(function (global, undefined) {

    // IE6 JS SDK Bug Hack
    function qc_op() {
        // 协助JS-SDK防csrf
        if (Q.ie === 6) {
            Q.setCookie("__qc_open", "1", ".qq.com", "/jsdkproxy", 5 / 60);
        }
    }

    qc_op();

})(this);
// TODO: fix Cannot read property 'nodeName' of null

// 无法获取属性“getAttribute”的值: 对象为 null 或未定义
!(function (global, undefined) {

    // 授权小于2项时微调样式
    // 因授权项减少，这段逻辑可以去掉了
    // if(Q.authsCount < 2) {
    //     var accredit_info_op;
    //     accredit_info_op = document.querySelector ? document.querySelector('.accredit_info_op') : document.getElementsByClassName('accredit_info_op')[0];
    //     document.getElementById('accredit_info').style.height = (accredit_info_op.clientHeight || 64) + 'px';
    //     // fix ie6下clientHeight为0的bug
    // }


    function getStats (){
        var ids=[], items=[];
        var acs = document.getElementsByName('api_choose');
        for(var i=0,len=acs.length;i<len;i++){
            var ac = acs[i];
            if(ac.checked||ac.disabled){
                ids.push(ac.value);
                items.push(ac.id.split("_")[1]);
            }
        }
        return {
            ids: ids,
            items: items
        };
    }

    // 在PC端的授权登录页面上，需要对帐户头像的点击进行限频的处理。 改为5秒内限制点击一次。
    var faceEl = document.getElementsByClassName('face')[0];
    var disableAgree = function() {
        global.disabled = true;
        if(!faceEl) return;
        return setTimeout(function() {
            global.disabled = false; // 能否执行授权的标识
        }, 5000);
    };

    // 原始的选中的授权项
    var originItems = getStats().items;

    Q.agree = global.agree = function agree(_ids){

        if(global.disabled) return;

        if(faceEl) {
            // 重置定时器
            clearTimeout(global.agreeTimeout);
            // 开启定时器
            global.agreeTimeout = disableAgree();
        }

        var ids=[], stats=getStats();
        if(_ids) {
            ids = _ids;
        }else{
            ids = stats.ids;
        }

        // 计算被取消的授权项
        var diffItems = _.difference(originItems, stats.items);

        if(ids[0] !== '#'){
            Q.bernoulli(10613);
        }else{
            Q.bernoulli(10614);
        }

        if(ids[0] !== '#' && diffItems[0]){

            Q.bernoulliSetup({
                opername:"qqconnect",
                name:"authorize$pc",
                action:"cancel"
            });
            _.forEach(diffItems, function(item){
                Q.bernoulli(item);
            });

            Q.report(formSend);

        }else{
            formSend();
        }

        function formSend(){
            //SDK26版本重报移动端统计
            //点击登录上传数据
            var data = Q.toQueryString({
                "report_type" : 4,
                "platform" :  8 ,
                "app_id" : Q.getParameter("client_id") || Q.getParameter('oauth_consumer_key') || 0,
                "result" : 0,
                "act_type" : 2,
                "uin" : /(^|;\s*)uin\=o0*(\d+)/.exec(document.cookie) ? /(^|;\s*)uin\=o0*(\d+)/.exec(document.cookie)[2] : 0,
                "login_status" : 2- (Q.isNeedLogin ? 0 : 1),
                "via" : 1
            });
            Q.send("http://appsupport.qq.com/cgi-bin/appstage/mstats_report?" + data);

            if( ids[0] === undefined ){
                ids.push('#');
            }

            // var siteName = '<?cs var:oauth_app_name ?>';
            // !_ids && Q.widget.msgbox.show('授权成功，正在返回'+siteName, 4, 5000);
            // Q.maskLayout();

            var CGI_URL = "https://graph.qq.com/oauth2.0/authorize",//https
                t = new FormSender(CGI_URL, "post", {
                    response_type: Q.getParameter('response_type'),
                    client_id: Q.getParameter('client_id'),
                    redirect_uri: Q.getParameter('redirect_uri'),
                    scope: Q.getParameter('scope'),
                    state: Q.getParameter('state'),
                    'switch': Q.getParameter('switch'),
                    from_ptlogin: 1,
                    src:1/*getParameter('src')*/,
                    update_auth:(Q.isNeedLogin ? 1 : 0),//added by cson

                    //new param
                    openapi:ids.join('_'),
                    // 防CSRF攻击
                    g_tk: Q.getToken(),

                    auth_time: +new Date,
                    ui: Q.getUuid()
                }, "utf-8");
            t.onSuccess = function(re){
                try{
                    if(re.ret==0){
                        // !_ids && Q.widget.msgbox.show("授权成功。",4,3000);
                        setTimeout(function(){window.location = (re.callback);},2000);
                    }else{
                        // Q.widget.msgbox.show(re.msg,5,3000);
                    }
                }catch( e ){
                    //msg box
                    // Q.widget.msgbox.show("服务器繁忙，请稍后再试。",5,2000);
                }
            };
            t.onError = function(){
                // Q.widget.msgbox.show("服务器繁忙，请稍后再试。",5,3000);
            };
            t.send();


        }
    };

    function doResize() {
        // fix错误页面js报错
        if(!document.getElementById('combine_page')) return;

        document.getElementById('combine_page').style.width = 'auto';

        var pageLoginEl = document.getElementsByClassName('page_login')[0];
        var pageAccreditEl = document.getElementsByClassName('page_accredit')[0];
        Q.removeClass(pageLoginEl, 'border_right');
        Q.removeClass(pageLoginEl, 'float_left');
        Q.removeClass(pageAccreditEl, 'float_left');
        Q.addClass(pageLoginEl, 'align');
        Q.addClass(pageAccreditEl, 'align');

        document.getElementsByClassName('lay_top_inner')[0].style.width = 'auto';
    }


    // 初始调整页面
    function initClientWidth(){

        var MAX = 688;

        var maxWidth = Q.getClientWidth(document);
        if (maxWidth < MAX) {
            doResize();
        }

        Q.addEventHandler(window, 'resize', function () {
            Q.throttle({
                fn: function () {
                    maxWidth = Q.getClientWidth(document);
                    if (maxWidth < MAX) {
                        doResize();
                        if (maxWidth < 433) {
                            // $('lay_main').style.marginLeft = '130px';
                            document.getElementById('lay_main').style.marginLeft = '130px';
                        } else {
                            // $('lay_main').style.marginLeft = '27px';
                            document.getElementById('lay_main').style.marginLeft = '27px';
                        }
                    } else {
                        var pageLoginEl = document.getElementsByClassName('page_login')[0];
                        var pageAccreditEl = document.getElementsByClassName('page_accredit')[0];
                        Q.addClass(pageLoginEl, 'border_right');
                        Q.removeClass(pageLoginEl, 'align');
                        Q.removeClass(pageAccreditEl, 'align');
                        Q.addClass(pageLoginEl, 'float_left');
                        Q.addClass(pageAccreditEl, 'float_left');
                        document.getElementsByClassName('lay_top_inner')[0].style.width = MAX + 'px';
                        document.getElementById('combine_page').style.width = MAX + 'px';
                    }
                }
            })();
        });

    }

    initClientWidth();

    var selectAllEl = document.getElementById('select_all');
    var oauthCheckboxsEls = document.getElementsByClassName('oauth_checkbox');

    if(selectAllEl && oauthCheckboxsEls){
        // 授权项全选时间绑定
        Q.addEventHandler(selectAllEl, 'click', function () {
            if (this.checked) {
                selectAllOauth();
            } else {
                clearAllOauth();
            }
        });

        // 全选
        var selectAllOauth = function () {
            // $e('.oauth_checkbox').setAttr('checked', 'checked');
            for (var i = 0; i < oauthCheckboxsEls.length; i++) {
                oauthCheckboxsEls[i].checked = 'checked';
            }
        };

        // 全不选
        var clearAllOauth = function () {
            // $e(".oauth_checkbox:not([disabled])").setAttr("checked", false);
            for (var i = 0; i < oauthCheckboxsEls.length; i++) {
                var oauthCheckbox = oauthCheckboxsEls[i];
                if (!oauthCheckbox.disabled) {
                    oauthCheckbox.checked = false;
                }
            }
        };

        var checkHasAllSelected = function () {
            var len = 0,
                checkedCnt = 0;
            for (var i = 0; i < oauthCheckboxsEls.length; i++) {
                var oauthCheckbox = oauthCheckboxsEls[i];
                if (!oauthCheckbox.disabled) {
                    len += 1;
                    if (oauthCheckbox.checked) {
                        checkedCnt += 1;
                    }
                }
            }

            if (checkedCnt === len) {
                // $e('#select_all').setAttr('checked', 'checked');
                selectAllEl.checked = 'checked';
            } else {
                // $e('#select_all').setAttr('checked', false);
                selectAllEl.checked = false;
            }
        };


        function initCheckboxStat(){
            // TODO 时间绑定到父节点
            for (var i = 0; i < oauthCheckboxsEls.length; i++) {
                var oauthCheckbox = oauthCheckboxsEls[i];
                if (!oauthCheckbox.disabled) {
                    Q.addEventHandler(oauthCheckbox, 'click', checkHasAllSelected);
                }
            }
            // 初始判断授权项目是否都是被选中
            checkHasAllSelected();
        }


        initCheckboxStat();
    }


    function initUI(){

        // 对搜狗业务进行特殊处理
        var redirect_uri = Q.getParameter('redirect_uri');
        var isSogou = false;
        if( ( redirect_uri.indexOf("http://account.sogou.com") == 0 || redirect_uri.indexOf("https://account.sogou.com") == 0 )
            && Q.getParameter('show_auth_items') == 0){

            isSogou = true;

            var items = document.getElementsByClassName('page_accredit')[0];
            items.style.display = "none";

            if(Q.authsCount <= 0) {
                document.getElementsByClassName('lay_login_form')[0].style.marginLeft = "10px";
            }

        }

        // 已有登录态且完全授权
        if(Q.authsCount <= 0) {
            //skip();
            Q.removeClass(document.getElementsByClassName('wording_timeout')[0], 'hide');
            Q.removeClass(document.getElementsByClassName('page_login')[0], 'border_right');
            !isSogou && Q.addClass(document.getElementsByClassName('page_accredit')[0], 'hide');
            document.getElementsByClassName('page_login')[0].style.width = '100%';

            var timeoutEl = document.getElementsByClassName('timeout')[0];
            agreeInterval = setInterval(function() {
                timeoutEl.innerHTML = parseInt(timeoutEl.innerHTML, 10) - 1;
                if(timeoutEl.innerHTML == '0') {
                    clearInterval(agreeInterval);
                    Q.agree();
                }
            }, 1000);
        }

        // 头像交互逻辑
        var faceEl = document.getElementsByClassName('face')[0];
        if ( faceEl ) {
            var uinEl = document.getElementsByClassName('uin')[0];
            var imgOutFocusEl = document.getElementsByClassName('img_out_focus')[0];

            Q.addEventHandler(faceEl, 'mouseover', function () {
                Q.removeClass(uinEl, 'hide');
                Q.addClass(imgOutFocusEl, 'img_out_focus_focus');
            });

            Q.addEventHandler(faceEl, 'mouseout', function () {
                Q.addClass(uinEl, 'hide');
                Q.removeClass(imgOutFocusEl, 'img_out_focus_focus');
            });
        }

    }

    initUI();


    if(global.isAgreed){
        Q.agree();
    }

    if(global.isLogouted){
        Q.logout();
    }

})(this);
// report Module
!(function (global, undefined) {

    // 进入错误页不执行授权页的上报
    if(Q.getParameter("which") === 'error') return;

    var client_id = Q.getParameter("client_id");
    Q.bernoulliSetup({obj: client_id});

    // 登录页曝光
    Q.bernoulli(10955);

    // mta上报曝光
    Q.mta('LoginPageViews', {Appid: Q.appid, Time: +new Date() - window.__start});

    // 上报
    Q.addEventHandler(document.getElementById('select_all'), 'click', function() {
        if(!this.checked) {
            Q.bernoulli(10960);
        }
    });

    Q.addEventHandler(document.getElementById('accredit_site_link'), 'click', function(){
        Q.bernoulli(10958);
    });

    Q.addEventHandler(document.getElementById('auth_manager_link'), 'click', function(){
        Q.bernoulli(10957);
    });

    var oauth_checkboxs = document.getElementsByClassName('oauth_checkbox');
    for(var i=0; i<oauth_checkboxs.length; i++) {
        Q.addEventHandler(oauth_checkboxs[i], 'click', function() {
            if(!this.checked) {
                Q.bernoulli(10959);
            }
        });
    }



    // 可以认为是JS初始完成延迟
    _speedTiming.push(+new Date);

    Q.addEventHandler(window, "load", function () {
        // 可以认为是iframe加载完成延迟
        _speedTiming.push(+new Date);

        setTimeout(function() {
	        // QQ登录授权V2 Performance
	        Q.performance(7721,166,6);
	        // QQ登录授权V2 静态资源测速
	        Q.isd(7721, 166, 9, _speedTiming);
        }, 2000);
    });

//    http://monitor.server.com/link/graph/viewid:4774
//    ID: 302295    名称：无登录授权页曝光量
//    ID: 302296    名称：有登录授权页曝光量
//    ID: 302297    名称：有登录已授权页曝光量
//    ID: 302298    名称：移动设备授权页曝光量
//    ID: 302299    名称：授权页脚本错误量
//    ID: 302300    名称：错误页曝光量

    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        Q.monitor(302298);
    }

    // 已有登录态且完全授权
    if(Q.authsCount <= 0){
        Q.monitor(302297)
    }

    // 有登录态曝光量
    if(Q.isNeedLogin){
        Q.monitor(302295)
    }else{
        Q.monitor(302296);
    }

})(this);
(function () {
    Q.addEventHandler(window,'load', function (){
        var data = Q.toQueryString({
            "report_type" : 4,
            "platform" :  8 ,
            "app_id" : Q.getParameter("client_id") || Q.getParameter('oauth_consumer_key') || 0,
            "result" : 0,
            "act_type" : 1,
            "uin" : /(^|;\s*)uin\=o0*(\d+)/.exec(document.cookie) ? /(^|;\s*)uin\=o0*(\d+)/.exec(document.cookie)[2] : 0,
            "login_status" : 2- (Q.isNeedLogin ? 0 : 1),
            "via" : 1
        });
        Q.send("http://appsupport.qq.com/cgi-bin/appstage/mstats_report?" + data);
    }, false);
})();
