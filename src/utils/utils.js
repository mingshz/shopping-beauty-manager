import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line
const IS_REACT_16 = !!ReactDOM.createPortal;

function getRelation(str1, str2) {
  if (str1 === str2) {
      console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}


/**
 * 删除id
 * @param {object} 原数据
 * @param {string | Array<String>} id 要删除的属性
 * @returns {object} 新的数据
 */
export function deleteProperty({ [id]: deleted, ...newState }, id) {
  if (id.constructor.name === 'Array') {
    // 每一个都执行一次
    let current = newState;
    id.forEach((newId) => {
      current = deleteProperty(current, newId);
    });
    return current;
  }
  return newState;
}

export function openLoginSelector(page, okHandler, config) {
  const LocalLoginSelector = page.routeData['/util/loginSelector'].component;
  const div = document.createElement('div');
  document.body.appendChild(div);

  function close(...args) {
    if (IS_REACT_16) {
      render({ ...config, close, visible: false, afterClose: destroy.bind(this, ...args) });
    } else {
      destroy(...args);
    }
  }
  // eslint-disable-next-line
    function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }
  function render(props) {
    ReactDOM.render(<LocalLoginSelector {...props} />, div);
  }
  render({ ...config, visible: true, close });
  return {
    destroy: close,
  };
}

/**
 * @param {Array<Object>} columns 源columns
 * @param {*} sortedInfo 排序信息
 * @returns {Array<Object>}具备排序功能的columns
 */
export function columnsForSort(columns, sortedInfo) {
  return columns.map((c) => {
    if (!c.sorter) { return c; }
    const key = c.key || c.dataIndex;
    if (!key) { return c; }
    return {
      sortOrder: sortedInfo.columnKey === key && sortedInfo.order,
      ...c,
    };
  });
}
