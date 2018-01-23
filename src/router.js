import React from 'react';
import { Router, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
// import IndexPage from './routes/IndexPage';
import styles from './index.less';
import Authorized from './utils/Authorized';

// 权限应该保存在本地，确保刷新之后还可以使用；但是系统内部应该存在刷新机制；在发现权限丢失之后会删除权限信息，并且重新打开应用程序
// 既然是本地信息，那么pro版本的权限应该是直接可用的
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const LoginLayout = routerData['/login'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <AuthorizedRoute
            path="/login"
            render={props => <LoginLayout {...props} />}
            authority="guest"
            redirectPath="/"
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['user']}
            redirectPath="/login/login"
          />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
