import React, { PureComponent } from 'react';

export default class ManagerList extends PureComponent {
  render() {
    const { match: { params: { merchantId } } } = this.props;
    console.log('my props:', this.props);
    console.log('merchantId: ', merchantId);
    return <span>hello world</span>;
  }
}
