/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-11-02 14:45:25
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-02 14:57:46
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

export interface IProps {
  isHideEditBtn: boolean;
  isDefineBySelf: boolean;
  title: any;
  size: 'default' | 'small' | undefined;
  maxLength: number;
  formItemLayout: { [key: string]: any };
  runEditor: boolean;
  infoList: Array<{ [key: string]: any }>;
  infoData: { [key: string]: any };
  colSpan: number;
  eventHandle: (event, value) => void;
  cancelHandle: (result) => void;
  updateHandle: (result) => void;
  handleEdit: () => void;
  beforeEditHandle: (params) => boolean;
}

export interface IState {
  loading: boolean;
  infoList: Array<{ [key: string]: any }>;
  searchForm: Array<{ [key: string]: any }>;
  infoData: { [key: string]: any };
  cardShow: boolean;
  previewVisible: boolean;
  previewImage: string;
}
