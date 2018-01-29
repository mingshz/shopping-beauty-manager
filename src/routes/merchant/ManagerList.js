import React, { PureComponent } from 'react';

export default class ManagerList extends PureComponent {
  render() {
    const { match: { params: { merchantId } } } = this.props;
    // eslint-disable-next-line
    console.log('my props:', this.props);
    // eslint-disable-next-line
    console.log('merchantId: ', merchantId);
    return <span>hello world</span>;
  }
}
