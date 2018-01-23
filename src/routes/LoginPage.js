import React, { Component } from 'react';
import styles from './LoginPage.less';
import { setLocalAuthority } from '../utils/authorityStorage';

class LoginPage extends Component {
  doClickLogin = () => {
    setLocalAuthority('user');
    // 重新载入
    window.location.reload();
  }
  render() {
    return (
      <div className={styles.main}>
        <span onClick={this.doClickLogin}>点击我，完成登录</span>
      </div>
    );
  }
}

export default LoginPage;
