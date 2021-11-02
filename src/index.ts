import React from 'react';
import { messages } from './components/utils';
// @ts-ignore
React.Component.prototype.$t = messages;

// 统一导出
export { default as LocaleProvider } from './components/locale-lan-provider';
// 基础
export { default as Table } from './components/basic/table';
export { default as CustomTable } from './components/basic/custom-table';
export { default as SearchArea } from './components/basic/search-area';
export { default as SearchAreaLov } from './components/basic/search-area-lov';
export { default as ProTable } from './components/basic/pro-table';
export { default as NewSearchArea } from './components/basic/new-search-area';
// 其他
export { default as CommonImporter } from './components/other/common-import';
export { default as SlideFrame } from './components/other/slide-frame';
export { default as CustomCollapse } from './components/other/custom-collapse';
export { default as PrintButton } from './components/other/print-button';
export { default as SlideFrameSubtitle } from './components/other/slide-frame-subtitle';
export { default as ExcelExporter } from './components/other/excel-export';
export { default as DivideContent } from './components/other/divide-content';
export { default as BasicInfo } from './components/other/basic-info';
// 表单
export { default as Cascader } from './components/form/cascader';
export { default as Lov } from './components/form/lov';
export { default as CodeInput } from './components/form/code-input';
export { default as CustomSwitch } from './components/form/custom-switch';
export { default as InputLanguage } from './components/form/input-language';
export { default as InputNumber } from './components/form/input-number';
export { default as SelectPartLoad } from './components/form/select-part-load';

// 业务组件
export { default as PolicyTips } from './components/business-components/policy-tips';
export { default as VoucherTable } from './components/business-components/voucher-table';
export { default as BudgetTips } from './components/business-components/budget/budget-check-message';
export { default as BudgetProgressDetail } from './components/business-components/budget/budget-progress-detail';
export { default as DocumentBasicInfo } from './components/business-components/document-basic-info';
export { default as BatchDownLoadAttachments } from './components/business-components/batch-download-attachments';
export { default as SelectApplicationType } from './components/business-components/select-application-type';
export { default as ApproveHistory } from './components/business-components/approve-history';
export { default as DocumentSubmitBtn } from './components/business-components/document-submit-btn';

// 附件
export { default as Upload } from './components/attachment/upload';
export { default as UploadButton } from './components/attachment/upload-button';
export { default as UploadByType } from './components/attachment/upload-by-type';
export { default as UploadFileList } from './components/attachment/upload-file-list';
export { default as ImagePriview } from './components/attachment/image-preview';
export { default as ZipFileView } from './components/attachment/zip-preview';
