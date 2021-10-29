import { ReactNode } from 'react';

export interface ProTableProps {
  url: string;
  columns: Object[];
  tableRef?: (ref: any) => void;
  searchRef?: () => void;
  beforeSearchSubmit?: (params: Object) => void;
  submitHandle?: (params: Object) => void;
  searchForm?: Object[];
  method?: string;
  extraSearchField?: string;
  placeholder?: string;
  onSelectChange?: (selectedRowKeys: Object[], selectedRows: Object[]) => void;
  toolBarRender?: (
    selectedRowKeys: Object[],
    selectedRows: Object[],
  ) => ReactNode;
}

interface SelectRow {
  selectedRowKeys: string[] | number[];
  selectedRows: Object[];
}

export interface ProTableState {
  searchForm: Object[];
  columns: Object[];
  selectRow: SelectRow;
}
