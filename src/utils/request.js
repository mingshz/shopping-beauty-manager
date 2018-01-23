import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
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
  const error = new Error(`except application/json, but ${type}`);
  error.response = response;
  throw error;
}

/**
 * 请求一个json结果
 * @param {string} url The URL we want to request
 * @param {object} options The options we want to pass to "fetch"
 * @param  {Function | Array<Function>} catchChain 异常链，响应会接受异常链
 */
export function requestJson(url, options, catchChain) {
  return request(url, {
    Accept: 'application/json',
    ...options,
  }, [onlyJson, parseJSON], catchChain);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {Function | Array<Function>} thenChain 工作链，响应会接受工作链
 * @param  {Function | Array<Function>} catchChain 异常链，响应会接受异常链
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, thenChain, catchChain) {
  let targetUrl;
  if (urlPrefix) {
    targetUrl = urlPrefix + url;
  } else {
    targetUrl = url;
  }
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  let promise = fetch(targetUrl, newOptions);
  if (thenChain) {
    if (thenChain.constructor.name === 'Array') {
      thenChain.forEach((method) => {
        promise = promise.then(method);
      });
    } else {
      promise = promise.then(thenChain);
    }
  }
  if (catchChain) {
    if (catchChain.constructor.name === 'Array') {
      catchChain.forEach((method) => {
        promise = promise.catch(method);
      });
    } else {
      promise = promise.catch(catchChain);
    }
  }
  return promise;
}

let urlPrefix;

/**
 * 指定url前缀
 * @param {String} url url前缀
 */
export function updateUrlPrefix(url) {
  urlPrefix = url;
}
