/**
 * 模拟dva的connect
 */
import React from 'react';

const defaultState = { user: { currentUser: {} } };

export default function WrapperConnect(mapStateToProps) {
  return function (WrappedComponent) {
    const { getState, dispatch } = (window as any)?.g_app?._store || {};
    const state = getState ? getState() || {} : defaultState;
    const partState = mapStateToProps(state);

    return class CustomConnect extends React.Component {
      constructor(props) {
        super(props);
      }
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

export const connect = WrapperConnect;
