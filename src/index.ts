import React from 'react';
import { messages } from './components/utils';
// @ts-ignore
React.Component.prototype.$t = messages;

// 统一导出
export { default as Table } from './components/table';
export { default as CustomTable } from './components/custom-table';
export { default as CodeInput } from './components/code-input';
export { default as CustomSwitch } from './components/custom-switch';
export { default as InputLanguage } from './components/input-language';
export { default as InputNumber } from './components/input-number';
export { default as SelectPartLoad } from './components/select-part-load';
export { default as Lov } from './components/lov';
export { default as SearchArea } from './components/search-area';
export { default as LocaleProvider } from './components/locale-lan-provider';
export { default as CommonImporter } from './components/common-import';

export { default as PolicyTips } from './components/business-components/policy-tips';
export { default as VoucherTable } from './components/business-components/voucher-table';
export { default as BudgetTips } from './components/business-components/budget/budget-check-message';
export { default as BudgetProgressDetail } from './components/business-components/budget/budget-progress-detail';
export { default as DocumentBasicInfo } from './components/business-components/document-basic-info';
export { default as BatchDownLoadAttachments } from './components/business-components/batch-download-attachments';
export { default as SelectApplicationType } from './components/business-components/select-application-type';

export { default as Upload } from './components/attachment/upload';
export { default as UploadButton } from './components/attachment/upload-button';
export { default as UploadByType } from './components/attachment/upload-by-type';
export { default as UploadFileList } from './components/attachment/upload-file-list';
export { default as ImagePriview } from './components/attachment/image-preview';
export { default as ZipFileView } from './components/attachment/zip-preview';
export { default as CustomCollapse } from './components/custom-collapse';
export { default as ApproveHistory } from './components/approve-history';
export { default as Cascader } from './components/cascader';
export { default as SlideFrame } from './components/slide-frame';
