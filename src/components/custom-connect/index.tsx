/**
 * 模拟dva的connect
 */
import React from 'react';

export default function WrapperConnect(mapStateToProps) {
  return function (WrappedComponent) {
    const { getState, dispatch } = (window as any)?.g_app?._store || {};
    const state = getState ? getState() || {} : {};
    const partState = mapStateToProps(state);

    return class CustomConnect extends React.Component {
      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...partState}
            dispatch={dispatch}
          />
        );
      }
    };
  };
}
