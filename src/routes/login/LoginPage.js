import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import styles from './LoginPage.less';
import { setLocalAuthority } from '../../utils/authorityStorage';

@connect(state =>
  ({
    loginRequest: state.global.loginRequest,
    currentUser: state.global.currentUser,
  })
)
class LoginPage extends Component {
  componentWillMount() {
    // 打开时获取登录请求
    this.props.dispatch({
      type: 'global/loginRequest',
    });
    // 一直测试是否已完成登录
    setTimeout(this.checkLoginStatus, 2000);
  }
  checkLoginStatus = () => {
    // 如果已登录则跳过
    const { currentUser: { authorities }, loginRequest: { id } } = this.props;
    if (authorities) {
      return;
    }
    // console.log('current id:', id);
    this.props.dispatch({
      type: 'global/loginResult',
      payload: id,
    });
    setTimeout(this.checkLoginStatus, 2000);
  }
  doClickLogin = () => {
    setLocalAuthority('user');
    // 重新载入
    window.location.reload();
  }
  render() {
    const { loginRequest: { url } } = this.props;
    return (
      <div className={styles.main}>
        {url ? <QRCode value={url} className={styles.loadImage} size={368} /> : <Spin size="large" className={styles.loadImage} />}
        <span className={styles.message} >通过已注册微信扫码完成登录</span>
      </div>
    );
  }
}

export default LoginPage;
