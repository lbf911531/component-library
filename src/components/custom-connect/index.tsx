/**
 * 模拟dva的connect
 */
import React, { forwardRef } from 'react';

const defaultState = { user: { currentUser: {} } };

export default function WrapperConnect(mapStateToProps) {
  return function (WrappedComponent) {
    const { getState, dispatch } = (window as any)?.g_app?._store || {};
    const state = getState ? getState() || {} : defaultState;
    const partState = mapStateToProps(state);

    return forwardRef((props, ref) => {
      return (
        <WrappedComponent
          {...props}
          {...partState}
          ref={ref}
          dispatch={dispatch}
        />
      );
    });
  };
}

export const connect = WrapperConnect;
