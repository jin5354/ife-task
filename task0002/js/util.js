/* 数据类型判断函数 */
var typer = (function(){

    function type(item, expect){
        var str = Object.prototype.toString.call(item);
        var pattern = /[A-Z]\w+/;
        return str.match(pattern)[0] === expect;
    }

    return {
        isArray: function(item) {return type(item, 'Array');},
        isFunction: function(item) {return type(item, 'Function');},
        isNumber: function(item) {return type(item, 'Number');},
        isString: function(item) {return type(item, 'String');},
        isBoolean: function(item) {return type(item, 'Boolean');},
        isUndefined: function(item) {return type(item, 'Undefined');},
        isNull: function(item) {return type(item, 'Null');},
        isRegExp: function(item) {return type(item, 'RegExp');},
        isDate: function(item) {return type(item, 'Date');},
        isError: function(item) {return type(item, 'Error');},
        isObject: function(item) {return typeof item === 'function' || typeof item ==='object' && !!item;}
    };
})();


/* 实现对象的深度克隆
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。
 */

 function cloneObject(src) {

    var obj = {};
    
    for(var ele in src){
        if(typeof(src[ele])==='object'){
            if(src[ele] instanceof Array){  
                obj[ele] = src[ele].concat();
            }else if(src[ele] instanceof Date){
                obj[ele] = new Date(src[ele].valueOf());
            }else {
                obj[ele] = cloneObject(src[ele]); 
            }
        }else {
            obj[ele] = src[ele];
        }
    }

    return obj;

}

/* 实现对象的深度克隆，在Object的原型上拓展功能 */
/*
Object.prototype.cloneAll=function(){
  
  function clonePrototype(){}
  clonePrototype.prototype = this;
  var obj = new clonePrototype();
  
  for(var ele in obj){
    if(typeof(obj[ele])==='object')
      if(obj[ele] instanceof Array){
        obj[ele] = Array.prototype.slice.call(obj[ele].cloneAll());
      }else if(obj[ele] instanceof Date){
        obj[ele] = new Date(obj[ele].valueOf());
      }else {
        obj[ele] = obj[ele].cloneAll(); 
      }
    }
  return obj;
};
Object.defineProperty(Object.prototype, 'cloneAll', {enumerable : false});
*/


/* 数组去重 */
function uniqArray(ary){
    if(typer.isArray(ary) !== true){
        throw Error('Not a Array!');
    }else{
        for(var i = 0; i < ary.length; i++){
            for(var j = i + 1; j< ary.length; j++){
                if(ary[j] === ary[i]){
                    ary.splice(j,1);
                    j--;
                }
            }
        }
    }
    return ary;
}

/* 字符串去掉头尾空格 */
function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

/* 遍历数组/对象并执行函数 */
function each(item, fn) {
    if(typer.isObject(item) !== true){
        throw Error('Not an Object!');
    }else if(typer.isArray(item) === true){
        for(var i = 0,len = item.length; i<len; i++){
            fn(item[i],i);
        }
    }else{
        var keys = getKeys(item);
        for(var i = 0,len = keys.length; i<len; i++){
            fn(item[keys[i]],[keys[i]]);
        } 
        /* 解决IE<9下的BUG */
        if (hasEnumBug) collectNonEnumProps(item, keys);
    }
}

var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString','propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
            keys.push(prop);
        }
    }
}

/* 遍历获取对象属性值 */
function getKeys(item){
    if(typer.isObject(item) !== true){return [];}
    if(Object.keys){return Object.keys[item];}
    var keys = [];
    for(key in item){
        if(item.hasOwnProperty(key)){keys.push(key);}
    }
    return keys;
}

/* 获取一个对象里面第一层元素的数量，返回一个整数 */
function getObjectLength(obj) {
    if(typer.isObject(obj) === true){
        return getKeys(obj).length;
    }
}

/* 判断是否为邮箱地址 */
function isEmail(emailStr) {
    return emailStr.search(/^[\w._-]+@[\w-]+(.\w{2,})+$/g) !== -1;
}

/* 判断是否为手机号 */
function isMobilePhone(phone) {
    return phone.search(/^1\d{10}$/g) !== -1;
}

/* 为element增加一个样式名为newClassName的新样式 */
function addClass(element, newClassName) {
    if(element.className.search('(^|\\s)' + newClassName+ '(\\s|$)') === -1){
        element.className += (' ' + newClassName + ' ');
    }
}

/* 移除element中的样式oldClassName */
function removeClass(element, oldClassName) {
    element.className = element.className.replace(new RegExp('(^|\\s)' + oldClassName+ '(\\s|$)'),' ');
}

/* 检查element是否有样式className */
function hasClass(element, className) {
    return element.className.search('(^|\\s)' + className+ '(\\s|$)') === -1;
}

/* 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值 */
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var obj = {};
    obj.left = element.offsetLeft;
    obj.top = element.offsetTop;
    curEle = element.offsetParent;
  
    while(curEle){
        obj.left += curEle.offsetLeft;
        obj.top += curEle.offsetTop;
        curEle = curEle.offertParent;
    }
    return obj;
}

/* 实现一个简单的Query */
function $(selector) {
    var maybeId = selector.charAt(0) === '#';
    var maybeClass = selector.charAt(0) === '.';
    var maybeAttr = selector.charAt(0) === '[';
    var maybeTag = selector.search(/^[\w-_]+$/g) !== -1;

    if(maybeId){
        var str = selector.slice(1);
        return document.getElementById(str);
    }else if(maybeClass){
        var str = selector.slice(1);
        if(document.getElementsByClassName){
            return document.getElementsByClassName(str)[0];
        }else{
            var all = document.getElementsByTagName("*");
            for(var i=0,len=all.length;i<len;i++){
                if(hasClass(all[i],str)){return all[i];}
            }
        }
    }else if(maybeAttr){
        var key = selector.match(/[\w-_]+/g)[0];
        var value = selector.match(/[\w-_]+/g).length>1?selector.match(/[\w-_]+/g)[1]:'';
        if(key && !value){
            var all = document.getElementsByTagName("*");
            for(var i=0,len=all.length;i<len;i++){
                if(all[i].getAttribute(key)){return all[i];}
            }
        }else if(key && value){
            var all = document.getElementsByTagName("*");
            for(var i=0,len=all.length;i<len;i++){
                if(all[i].getAttribute(key)===value){return all[i];}
            }
        }         
    }else{
        return document.getElementsByTagName(selector)[0];
    }
}

/* 给一个element绑定一个针对event事件的响应，响应函数为listener */
function addEvent(element, event, listener) {
    if(document.addEventListener){
        element.addEventListener(event, listener, false);//IE9+,chrome,FF,opera,safari
    }else{
        element.attachEvent("on" + event, listener); //IE6,7,8
    }
}

/* 移除element对象对于event事件发生时执行listener的响应 */
function removeEvent(element, event, listener) {
    if(document.removeEventListener){
        element.removeEventListener(event, listener, false);//IE9+,chrome,FF,opera,safari
    }else{
        element.detachEvent("on" + event, listener); //IE6,7,8
    }
}

/* 实现对click事件的绑定 */
function addClickEvent(element, listener) {
    addEvent(element, 'click', listener);
}

/* 实现对于按Enter键时的事件绑定 */
function addEnterEvent(element, listener) {
    addEvent(element, 'keyup', function(e){
        var e = e || window.event;
        var eKeyCode = e.which || e.charCode || e.keyCode;

        if(eKeyCode === 13){listener(e);}
    });
}

/* 事件委托 */
function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function(e){
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase() === tag){
            listener(e);
        }
    })
}

$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegate = delegateEvent;

/* 判断是否为IE浏览器，返回-1或者版本号 */
function isIE() {
    if(window.navigator.userAgent,indexOf('MSIE') === -1) {return -1;}
    else{
        return window.navigator.userAgent.match(/MSIE\s[\w\.]+(?=;)/g)[0].slice(5);
    }
}

/* 获取cookie值 */
function getCookie(cookieName) {
    var name = encodeURIComponent(cookieName);
    var cookieStart = document.cookie.indexOf(name);
    if(cookieStart > -1){
      var cookieEnd = document.cookie.indexOf(';',cookieStart);
      if(cookieEnd == -1){
        cookieEnd = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(cookieStart, cookieEnd));
    }
}

/* 设置cookie */
function setCookie(cookieName, cookieValue, expiredays) {
    var cookieText = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);
    if(expiredays instanceof Date){
      cookieText += "; expires=" + expiredays.toGMTString();
    }
  document.cookie = cookieText;
}

/* 封装Ajax方法 */
function ajax(url, options) {
    var optionsObj = options || {};
    var type = optionsObj.type || "get";
    var data = optionsObj.data || null;
    if(typeof data === 'object'){
        var arr = [];
        for(key in data){
            if(data.hasOwnProperty(key)){
                arr.push(key + "=" + data[key]);
            }
        }
        data = arr.join("&");
    }
    var xhr = new XMLHttpRequest(); //IE7+
    xhr.open(type, url, true);
    xhr.send(data);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status >=200 && xhr.status < 300 || xhr.status ==304){
                if(typeof optionsObj.onsuccess === "function"){optionsObj.onsuccess(xhr);}
            }else{
                if(typeof optionsObj.onfail === "function"){optionsObj.onfail(xhr);}
            }
        }
    };
}

/* text()方法 */
function text(element, str){

    if(typeof element.textContent === 'string'){
        element.textContent = str;
    }else{
        if(element.firstChild){
            element.firstChild.nodeValue = str;
        }else{
            var textNode = document.createTextNode(str);
            element.appendChild(textNode);
        }
    }
}

/* 阻止默认事件 */
function cancelHandle(e){
    if(e.preventDefault){e.preventDefault();}
    if(e.returnValue){e.returnValue = false;}
    return false;
}