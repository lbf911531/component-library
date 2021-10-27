/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-26 16:17:38
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-27 10:22:00
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { CloseOutlined } from '@ant-design/icons';
import CustomConnect from '../../custom-connect';
import { IProps, IState } from './interface';
import './style.less';

/**
 * 侧拉组件，该组件内部组件将自带this.props.close(params)方法关闭侧拉栏
 */
class SlideFrame extends React.Component<IProps, IState> {
  static defaultProps = {
    title: '',
    show: false,
    onClose: () => {},
    hasMask: true,
    afterClose: () => {},
    params: {},
    hasFooter: true,
    shorter: false,
  };
  content: any;

  constructor(props) {
    super(props);
    this.state = {
      className: 'slide-frame animated close',
      showFlag: false,
    };
  }

  /**
   * 根据传入的show值进行判断是否显示
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { showFlag } = this.state;
    if (nextProps.show !== showFlag) {
      this.handleControlVisible(nextProps.show);
    }
  }

  /**
   * 控制侧拉显隐，防抖
   * @param {*} show
   */
  handleControlVisible = (show) => {
    if (show) {
      this.show();
    } else {
      this.close(undefined);
    }
  };

  show = () => {
    this.setState({
      className: 'slide-frame animated slideInRight',
      showFlag: true,
    });
  };

  /**
   * 关闭方法，如果内部有params参数，则传出至afterClose方法
   * @param params
   */
  close = (params) => {
    const { afterClose } = this.props;
    this.setState({
      className: 'slide-frame animated slideOutRight',
      showFlag: false,
    });
    setTimeout(() => {
      this.setState({}, () => {
        afterClose(params);
      });
    }, 0);
  };

  render() {
    const {
      width,
      hasMask,
      onClose,
      widthType,
      title,
      hasFooter,
      children,
      shorter,
      collapse,
      fullScreen,
      menuWidth,
      style,
      needReMount = false,
      mountComponent = document.getElementsByTagName('body')[0],
    } = this.props;
    const { showFlag, className } = this.state;
    const type = { narrow: '660px', wider: '760px' };
    const customWidth = widthType && type[widthType];

    const slidLeft = fullScreen ? 0 : !collapse ? menuWidth : 80;
    const shorterShadow = {
      position: 'fixed',
      top: 40,
      left: slidLeft,
      right: 0,
      bottom: 0,
      transition: 'all .2s ease 0s',
    };
    const renderDom = (
      <div>
        <div
          className={
            hasMask && showFlag ? 'slide-mask open' : 'slide-mask close'
          }
          onClick={onClose}
          style={shorter ? shorterShadow : { ...style }}
        />{' '}
        <div
          className={`${className} ${customWidth ? 'custom-slide-frame' : ''} ${
            shorter ? 'shorter-slide' : ''
          }`}
          style={{ width: width || customWidth || '50vw', ...style }}
        >
          <div className="slide-title">
            {' '}
            {title} <CloseOutlined className="close-icon" onClick={onClose} />
          </div>
          <div className={`slide-content ${!hasFooter && 'no-footer'}`}>
            {' '}
            {showFlag && children}{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
    /**
     * needReMount 是否需要将 slideFrame 挂载到别的元素上
     * mountComponent 挂载到的目标元素
     */
    return needReMount
      ? ReactDOM.createPortal(renderDom, mountComponent)
      : renderDom;
  }
}

function mapStateToProps(state) {
  return {
    collapse: state?.setting?.collapsed,
    fullScreen: state?.setting?.fullScreen,
    menuWidth: state?.setting?.menuWidth,
  };
}

export default CustomConnect(mapStateToProps)(SlideFrame);
