import fetch from 'dva/fetch';
import allAddress from './address';

function parseJSON(response) {
  return response.json();
}

export function errorWithResponse(response, msg) {
  const error = new Error(msg);
  error.response = response;
  return error;
}

/**
 * @param {ServerResponse} response 响应
 * @returns {boolean} 只要是2开头的响应那就是true
 */
export function trueOnSuccessful(response) {
  if (!response.ok) {
    // console.warn(response);
    throw errorWithResponse(response, `bad response status:${response.status}`);
  }
  return response.ok;
}

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

function onlyJson(response) {
  const type = response.headers.get('Content-Type');
  if (type && type.indexOf('application/json') !== -1) {
    return response;
  }
  throw errorWithResponse(response, `except application/json, but ${type}`);
}

/**
 * 请求一个json结果
 * @param {string} url The URL we want to request
 * @param {object} options The options we want to pass to "fetch"
 */
export function requestJson(url, options) {
  const currentHeaders = (options || {}).headers;
  return request(url, {
    ...options,
    headers: {
      ...currentHeaders,
      Accept: 'application/json',
    },
  }).then(onlyJson).then(parseJSON);
}

function uploadJsonContent(url, method, data, options) {
  const currentHeaders = (options || {}).headers;
  return request(url, {
    ...options,
    method,
    headers: {
      ...currentHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
}

/**
 * put data 到url
 * @param {String} url 请求的地址
 * @param {*} data 要提交的content
 * @param {*} options The options we want to pass to "fetch"
 */
export function putJson(url, data, options) {
  return uploadJsonContent(url, 'PUT', data, options);
}

/**
 * post data 到url
 * @param {String} url 请求的地址
 * @param {*} data 要提交的content
 * @param {*} options The options we want to pass to "fetch"
 */
export function postJson(url, data, options) {
  return uploadJsonContent(url, 'POST', data, options);
}

export function deleteRequest(url, options) {
  return request(url, {
    ...options,
    method: 'DELETE',
  });
}

// * @param  {Function | Array<Function>} thenChain 工作链，响应会接受工作链
//  * @param  {Function | Array<Function>} catchChain 异常链，响应会接受异常链

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  let targetUrl;
  if (urlPrefix) {
    targetUrl = urlPrefix + url;
  } else {
    targetUrl = url;
  }
  const defaultOptions = {
    credentials: 'include',
    cache: 'no-cache',
  };
  const newOptions = { ...defaultOptions, ...options };
  return fetch(targetUrl, newOptions);
  // let promise = fetch(targetUrl, newOptions);
  // if (thenChain) {
  //   if (thenChain.constructor.name === 'Array') {
  //     thenChain.forEach((method) => {
  //       promise = promise.then(method);
  //     });
  //   } else {
  //     promise = promise.then(thenChain);
  //   }
  // }
  // if (catchChain) {
  //   if (catchChain.constructor.name === 'Array') {
  //     catchChain.forEach((method) => {
  //       promise = promise.catch(method);
  //     });
  //   } else {
  //     promise = promise.catch(catchChain);
  //   }
  // }
  // return promise;
}

let urlPrefix;

/**
 * 指定url前缀
 * @param {String} url url前缀
 */
export function updateUrlPrefix(url) {
  urlPrefix = url;
}

export function wellFormAddress(address) {
  // province => province,provinceCode
  const data1 = find(allAddress, address.province);
  const data2 = find(data1.children, address.prefecture);
  // 有可能只存在前面2个……
  let data3;
  if (!data2.children || data2.children.length === 0 || !address.county) {
    data3 = {
      label: null,
    };
  } else { data3 = find(data2.children, address.county); }
  return {
    ...address,
    provinceCode: address.province,
    province: data1.label,
    prefectureCode: address.prefecture,
    prefecture: data2.label,
    countyCode: address.county,
    county: data3.label,
  };
}
function find(data, code) {
  return data.filter(c => c.value === code)[0];
}
