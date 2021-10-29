export interface IProps {
  onClick: (result?: any) => void; // 提交按钮依据接口判断后，走原本正常单据提交的函数（无弹窗选择人员范围）
  url: string; // 单据用于判断是否弹窗及返回人员范围数据的url
  btnLoading: boolean; // 由外部控制提交按钮loading
  approvalRule: string | undefined;
  block: boolean | undefined;
  className: string | undefined;
}

export interface ISelectorItem {
  title: string;
  url: string;
  key: string;
  method: string;
  searchForm: Array<{ type: string; id: string; label: string }>;
  columns: Array<{ title: string; dataIndex: string; width?: string }>;
}

export interface IState {
  showModalVisible: boolean;
  submitLoading: boolean;
  loading: boolean;
  itemList: Array<{ [key: string]: any }>;
  selectorItem: ISelectorItem;
}
