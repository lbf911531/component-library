import React from 'react';
import { Modal, Radio, Spin } from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config';
import moment from 'moment';
import FileSaver from 'file-saver';
import { messages } from '../../utils';
import RenderAttachmentsItem from './render-attachments-item';
import AttachmentsWrap from './attachments-wrap';
import {
  filterCanExportPdfMap,
  transformSelectRows,
  filterAndSetSortIndex,
  transformQueryUrl,
} from './utils';
import { BatchDownloadProps, BatchDownloadState } from './interface';
import './index.less';

const AttachmentsList = AttachmentsWrap(RenderAttachmentsItem);

class BatchDownLoadAttachments extends React.Component<
  BatchDownloadProps,
  BatchDownloadState
> {
  // static propTypes = {
  //   visible: PropTypes.bool.isRequired,
  //   pkName: PropTypes.object.isRequired,
  //   queryMethod: PropTypes.string,
  //   queryUrl: PropTypes.string,
  //   downloadCompressURL: PropTypes.string,
  //   downloadPdfURL: PropTypes.string,
  //   saveMethod: PropTypes.string,
  //   pkValueList: PropTypes.array,
  //   allSelectedRows: PropTypes.object,
  //   onCancel: PropTypes.func,
  //   categoryType: PropTypes.string,
  //   documentNumberField: PropTypes.string,
  // };

  static defaultProps = {
    queryMethod: 'post',
    queryUrl: `${config.fileUrl}/api/attachment/get/by/pkValues`,
    downloadCompressURL: `${config.fileUrl}/api/attachments/download/selected`,
    downloadPdfURL: `${config.fileUrl}/api/attachments/download/pdf/selected`,
    saveMethod: 'post',
    pkValueList: [],
    allSelectedRows: {},
    onCancel: () => {},
    categoryType: messages('exp.type.of.category'),
    documentNumberField: 'requisitionNumber',
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      attachmentList: [],
      allAttachments: [],
      downloadFormat: 'pdf',
      allSelected: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.getAttachmentsByPkValues();
  }

  componentWillReceiveProps(nextProps: BatchDownloadProps) {
    const { visible } = this.props;
    if (nextProps.visible && nextProps.visible !== visible) {
      this.getAttachmentsByPkValues(nextProps);
    }
  }

  // 根据 pkValue List 获取附件
  getAttachmentsByPkValues = (props = this.props) => {
    const {
      pkValueList,
      queryMethod,
      queryUrl,
      allSelectedRows,
      pkName,
      linePKValueField,
    } = props;
    if (queryUrl && pkValueList && pkValueList.length) {
      const { header, line } = pkName;
      const httpList = header
        ? [
            httpFetch[queryMethod](
              transformQueryUrl(queryUrl, { pkName: header }),
              pkValueList,
            ),
          ]
        : [];
      let documentLineIds = {};
      if (line && linePKValueField) {
        const lineIds = Object.values(allSelectedRows).reduce((pre, cur) => {
          documentLineIds = {
            ...documentLineIds,
            ...(cur.documentLineIds || {}),
          };
          return [...pre, ...(Object.keys(cur.documentLineIds || {}) || [])];
        }, []);
        if (lineIds.length) {
          httpList.push(
            httpFetch[queryMethod](
              transformQueryUrl(queryUrl, { pkName: line }),
              lineIds,
            ),
          );
        }
      }
      this.setState({ loading: true });
      Promise.all(httpList).then((res) => {
        const { data: headerResponse = {} } = res[0] || {};
        const { data: lineResponse = {} } = res[1] || {};
        for (const key in lineResponse) {
          if ({}.hasOwnProperty.call(lineResponse, key)) {
            const { headerId } = documentLineIds[key];
            if (headerResponse[headerId]) {
              headerResponse[headerId].push(...(lineResponse[key] || []));
            } else {
              headerResponse[headerId] = [...(lineResponse[key] || [])];
            }
          }
        }
        this.dealResponseData(headerResponse);
      });
    }
  };

  dealResponseData = (data) => {
    const { allSelectedRows, documentNumberField } = this.props;
    const { downloadFormat } = this.state;
    let result = [];
    const allAttachments = [];
    const allSelected = {};
    Object.entries(data).forEach((item) => {
      const [documentId, fileList] = item;
      const {
        sortIndex = result.length,
        [documentNumberField]: documentNumber,
      } = allSelectedRows[documentId] || {};
      const attachments = (fileList as any[]).map((file) => {
        return { ...file, previewName: `${documentNumber}-${file.fileName}` };
      });
      result[sortIndex] = {
        pkValue: documentId,
        documentNumber,
        attachments,
      };
      allSelected[documentNumber] = attachments;
    });
    result = result.filter((item) => {
      if (item) {
        allAttachments.push(...(item.attachments || []));
      }
      return item;
    });
    const defaultSelect = filterCanExportPdfMap(allSelected, downloadFormat);
    this.setState({
      attachmentList: result,
      loading: false,
      allAttachments,
      allSelected: defaultSelect,
    });
  };

  // 点击确定
  onOkHandle = () => {
    const { saveMethod, downloadPdfURL, downloadCompressURL, categoryType } =
      this.props;
    const { allSelected, downloadFormat } = this.state;
    let result = {};
    const allFileList = [];
    Object.entries(allSelected).forEach((item) => {
      const [documentNumber, attachments] = item;
      const folderName = `${documentNumber}-${attachments.length}${
        messages('common.a') /* 个 */
      }`;
      result[folderName] = attachments.map((file) => file.id);
      allFileList.push(...attachments);
    });
    let saveUrl = downloadCompressURL;
    const fileName = `${categoryType} ${moment().format('YYYYMMDD')}-${
      allFileList.length
    }${messages('common.a') /* 个 */}`;
    if (downloadFormat === 'pdf') {
      saveUrl = downloadPdfURL;
      result = { [fileName]: allFileList.map((file) => file.id) };
    }

    if (allFileList.length) {
      this.setState({ confirmLoading: true });
      httpFetch[saveMethod](
        saveUrl,
        result,
        {},
        { responseType: 'arraybuffer' },
      )
        .then((res) => {
          if (res.data) {
            const suffix = res.headers['content-disposition']
              .split('filename=')[1]
              .split('.')[1];
            FileSaver.saveAs(
              new Blob([res.data]),
              decodeURIComponent(`${fileName}.${suffix}`),
            );
            this.setState({ confirmLoading: false });
            this.onCancel();
          }
        })
        .catch(() => {
          this.setState({ confirmLoading: false });
        });
    } else {
      this.onCancel();
    }
  };

  // 关闭弹框
  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  // 下载格式改变，置灰并去除勾选不符合的附件
  onTypeChange = (e) => {
    const downloadFormat = e.target.value;
    const { allSelected } = this.state;
    const result = filterCanExportPdfMap(allSelected, downloadFormat);
    this.setState({
      downloadFormat,
      allSelected: result,
    });
  };

  // 附件select
  onSelectChange = (value) => {
    const { allSelected } = this.state;
    this.setState({ allSelected: { ...allSelected, ...value } });
  };

  afterClose = () => {
    this.setState({
      attachmentList: [],
      allAttachments: [],
      downloadFormat: 'pdf',
      allSelected: {},
    });
  };

  render() {
    const { visible } = this.props;

    const {
      attachmentList,
      confirmLoading,
      loading,
      downloadFormat,
      allAttachments,
      allSelected,
    } = this.state;

    const selectedNum = Object.values(allSelected).reduce(
      (pre, cur) => [...pre, ...cur],
      [],
    ).length;

    return (
      <Modal
        visible={visible}
        title={messages('common.batch.download') /* 附件批量下载 */}
        confirmLoading={confirmLoading}
        onOk={this.onOkHandle}
        onCancel={this.onCancel}
        okText={messages('common.ok')}
        cancelText={messages('common.cancel')}
        width={614}
        wrapClassName="batch-download-attachments"
        bodyStyle={{ paddingTop: 0, height: 500 }}
        afterClose={this.afterClose}
        destroyOnClose
      >
        <div className="select-type-wrap clearfix">
          <span className="select-type-desc">
            {messages('common.choose.download.format') /* 选择下载格式 */}：
          </span>
          <Radio.Group
            onChange={this.onTypeChange}
            value={downloadFormat}
            disabled={loading}
          >
            <Radio value="pdf">
              {messages('common.to.pdf.merge') /* 转pdf合并 */}
            </Radio>
            <Radio value="compression">
              {messages('common.original.compression') /* 原件压缩 */}
            </Radio>
          </Radio.Group>

          <span className="title-right over-range">
            <span className="selected-num">
              {
                messages('common.accounting.selected', {
                  params: { num: selectedNum },
                }) /* 已选中{num}个 */
              }
            </span>
            /
            <span className="total-num">
              {
                messages('common.total.files', {
                  params: { number: allAttachments.length },
                }) /* 共{num}个文件 */
              }
            </span>
          </span>
        </div>

        <Spin spinning={loading} wrapperClassName="attachments-list-wrap">
          <AttachmentsList
            attachmentList={attachmentList}
            onSelectChange={this.onSelectChange}
            downloadFormat={downloadFormat}
            attachments={allAttachments}
            showName="previewName"
          />
        </Spin>
      </Modal>
    );
  }
}

export default BatchDownLoadAttachments;

export { transformSelectRows, filterAndSetSortIndex, AttachmentsWrap };
