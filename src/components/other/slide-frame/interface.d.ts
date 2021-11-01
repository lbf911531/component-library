/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-26 16:18:29
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-26 16:48:03
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

export interface IProps {
  width: string | number; // 宽度
  widthType: string;
  collapse: boolean;
  fullScreen: boolean;
  menuWidth: number;
  needReMount: boolean;
  style?: any;
  mountComponent: any;
  title: string; // 标题
  show: boolean; // 是否显示
  hasMask: boolean; // 是否有遮罩层
  onClose: () => void; // 点击遮罩层或右上方x时触发的事件
  // content: oneOfType([func; string]); // 内容component，包裹后的元素添加this.props.close方法进行侧滑关闭
  afterClose: (params) => void; // 关闭后触发的事件，用于更新外层的show值
  params: { [key: string]: any }; // 外部传入内部组件props
  hasFooter: boolean; // 是否有低端操作区
  shorter: boolean; // 侧划框仅遮盖当前页面
}

export interface IState {
  showFlag: boolean;
  className: string;
}
