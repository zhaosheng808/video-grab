import VueCookies from 'vue-cookies';
let appTokenKey = 'cmcs-token';

export function newguid() {
  var guid = '';
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
  }
  return guid;
}

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export function formatDate(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

export function randomData(now, num) {
  var name = dateFormat(now, 'yyyy-MM-dd hh:mm:ss');
  return {
    name: name,
    value: [
      name,
      // Math.round(Math.random() * 10)
      num
    ]
  };
}

export function haspermission(key, permissions) {
  let result = false;
  if (!key || key.length === 0) {
    return result;
  }

  try {
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].toLowerCase() === key.toLowerCase()) {
        result = true;
        break;
      }
    }
  } catch (e) {
    result = false;
  }

  return result;
}

export function getExt(path) {
  let pos = path.lastIndexOf('.');
  if (pos === -1) {
    return '';
  }

  let ext = path.substr(pos + 1).toLowerCase();
  return ext;
}

export function copyText(text, successCallback) {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString();
  let input = document.querySelector('#copy-input');
  if (!input) {
    input = document.createElement('input');
    input.id = 'copy-input';
    input.readOnly = 'readOnly'; // 防止ios聚焦触发键盘事件
    input.style.position = 'absolute';
    input.style.left = '-1000px';
    input.style.zIndex = '-1000';
    document.body.appendChild(input);
  }

  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    // alert('已复制到粘贴板');
    if (successCallback) {
      successCallback();
    }
  }
  input.blur();

  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) { // ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart('character', startIndex); // 起始光标
      range.moveEnd('character', stopIndex - startIndex);// 结束光标
      range.select(); // 不兼容苹果
    } else {// firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }
};

/*
 * 数组里面的对象根据key值进行排序 attr : 比较的key值 rev 标识 升序 降序 默认升序排列
 * 使用方法 newArray.sort(sortBy('number',false))
 * //表示根据number属性降序排列; 若第二个参数不传递，默认表示升序排序
 *
 * */
export function sortBy(attr, rev) {
  if (rev === undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
};

/**
 * 文件下载
 * @param url
 * @param paramsObj
 */
export function downloadFile(url, paramsObj = {}) {
  const paramsArr = [];
  for (let key in paramsObj) {
    paramsArr.push(key + '=' + encodeURIComponent(paramsObj[key]));
  }
  const queryParam = paramsArr.join('&');
  let downloadFileUrl = '';
  if (url.indexOf('?') == -1) {
    downloadFileUrl = url + '?' + queryParam;
  }else {
    downloadFileUrl = url + '&' + queryParam;
  }
  // return
  const elemIF = document.createElement("iframe");
  elemIF.src = downloadFileUrl;
  elemIF.style.display = "none";
  document.body.appendChild(elemIF);
};
// 获取项目登录用户token
export function getToken() {
  let token = VueCookies.get(appTokenKey) || '';
  return token;
}
export function setToken(token) {
  if (token) {
    VueCookies.set(appTokenKey, token);
  }else {
    VueCookies.remove(appTokenKey);
  }

}