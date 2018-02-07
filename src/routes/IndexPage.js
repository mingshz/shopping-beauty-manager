import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>暂无内容</h1>
      {/* <div className={styles.welcome} /> */}
      <ul className={styles.list}>
        <li>多读书，多看报；少生孩子，多种树。</li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
