type TRedux = {
  type: string;
  payload?: any;
};

export enum AlignType {
  TIME = 'time',
  AMOUNT = 'amount',
  DEFAULT = 'default',
}

export interface IProps {
  allowClear?: boolean;
  placeholder: string;
  disabled?: boolean;
  extraParams?: any;
  single?: boolean;
  onChange?: (value: any) => void;
  labelKey: string;
  valueKey: string;
  value?: any;
  hideColumns?: Array<string>; // Array<string> 用于隐藏列表中不需要展示的列
  hideSearchList?: Array<string>; // Array<string> 用于隐藏搜索区中不需要展示的搜索表单
  code?: string;
  title?: string;
  showDetail?: boolean;
  width?: number | string;
  twiceSearchFlag?: boolean;
  pagination?: IPagination;
  lovType?: string;
  cancelDoubleClick?: boolean;
  selectorItem?: any;
  searchList?: any[];
  columnsList?: any[];
  listExtraParams?: any;
  selectedData?: any;
  hideRowSelect?: boolean;
  hideFooter?: boolean;
  diyFooter?: boolean;
  onReturn?: () => void;
  clearFlag?: boolean;
  cancelText?: string;
  okText?: string;
  onRowMouseLeave?: (row: any, index?: number, e?: any) => void;
  onRowMouseEnter?: (row: any, index?: number, e?: any) => void;
  isPage?: boolean;
  requestBody?: any;
  paramAsBody?: boolean;
  needCache?: boolean;
  onFocus?: () => void;
  afterOk?: (values: any) => void;
  afterCancel?: (values: any) => void;
  valueText?: string;
  lovData?: any;
  searchListIndex?: number;
  dispatch: (object: TRedux) => any;
  isRenderSelect: boolean;
  formatParams?: (value: any) => any;
  searchKey?: string;
  showPopover: boolean | undefined;
  cusSuffixIcon?: any;
  cusRemoveIcon?: any;
  labelInValue?: boolean;
  optionLabelProp?: string;
  customChooserTextValue?: any;
  inputStyle?: any;
}

export interface ILov {
  columns?: Array<{
    align?: string;
    dataIndex: string;
    fieldType?: string;
    id: null | string;
    title: string;
    width?: number | string;
    render?: (value: any, record?: any, index?: string | number) => any;
  }>;
  method?: string;
  searchForm?: Array<{
    type: string;
    id: string;
    label: string;
  }>;
  title?: string;
  url?: string;
  key?: string;
  paramAsBody?: boolean;
}

export interface ILovState {
  tableData: Array<any>;
  loading: boolean;
  page: number;
  size: number | undefined;
  pagination: IPagination;
  searchParams: any;
  selectedRows: Array<any>;
  selectedRowKeys: Array<string>;
  type?: string | undefined;
  frontPagination: IFrontPagination;
}

export interface IPagination {
  total?: number;
  current?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSize?: number;
  onChange?: (page: number, size?: number) => void;
  onShowSizeChange?: (page: number, size: number) => void;
  pageSizeOptions?: Array<string>;
  showTotal?: (total: number, range: Array<number | string>) => string;
}

export interface IListSelectorProps extends IProps {
  onOk: (values: Array<any> | any) => void;
  onCancel: () => void;
  visible: boolean;
  lovData: any;
  dispatch: any;
  delay: boolean;
  isRequest?: boolean;
  confirmLoading?: boolean;
}

export interface ILovProps extends IListSelectorProps {
  lov: ILov;
  selectedData: Array<any>;
  onSelectAll: (selected: boolean, rows: any, changeRows?: any) => void;
  width?: number | string;
  onCancel: () => void;
  onOk: (res: { result: any; type: string }) => void;
  hideSelectAll?: boolean;
  maxLength?: number;
}

interface IFrontPagination {
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: Array<string>;
  showTotal?: (total: number, range: Array<number | string>) => string;
}
