/**
 * 由于部分组件内部用的antd 3.x版本的form，
 * 当组件升级到 4.x的form时，wrappedComponentRef不能再被使用，
 * 因此，这里模拟Form.create()组件，
 */

import React from 'react';

export default function WrappedForm(WrappedComponent) {
  return class WrappedClassComponent extends React.Component {
    render() {
      // @ts-ignore
      const { wrappedComponentRef } = this.props;
      return <WrappedComponent {...this.props} ref={wrappedComponentRef} />;
    }
  };
}
