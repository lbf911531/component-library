interface pkNameInfo {
  header?: string;
  line?: string;
}

export interface BatchDownloadProps {
  visible: boolean;
  pkName: pkNameInfo;
  queryUrl: string;
  queryMethod: string;
  saveMethod: string;
  downloadCompressURL: string;
  downloadPdfURL: string;
  pkValueList: string[];
  allSelectedRows: Object;
  categoryType: string;
  documentNumberField: string;
  linePKValueField: string;
  onCancel: () => void;
}

export interface BatchDownloadState {
  confirmLoading: boolean;
  attachmentList: Object[];
  allAttachments: Object[];
  downloadFormat: 'pdf' | 'compression';
  allSelected: Object;
  loading: boolean;
}
