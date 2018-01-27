import React, { PureComponent } from 'react';

export default class MerchantManagerList extends PureComponent {
  render() {
    const { match: { params: { managerId } } } = this.props;
    console.log('my props:', this.props);
    console.log('managerId: ', managerId);
    return <span>hello world</span>;
  }
}
