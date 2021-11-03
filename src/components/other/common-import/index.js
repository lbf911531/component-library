import React from 'react';
import config from 'config';
import { UploadOutlined } from '@ant-design/icons';
import {
  Modal,
  Button,
  Tabs,
  Upload,
  message,
  Popover,
  Badge,
  Spin,
} from 'antd';
import httpFetch from 'share/httpFetch';
import FileSaver from 'file-saver';
import { messages } from 'utils/utils';
import CustomTable from '../../basic/custom-table';
import './index.less';

const { TabPane } = Tabs;

// 数据导入组件
class CommonImporter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initLoading: false,
      visible: false,
      fileList: [],
      uploading: false,
      batchNo: '',
      successTotal: 0,
      failureTotal: 0,
      columns: [
        {
          title: messages('common.line.number') /* 行号 */,
          dataIndex: 'idxNo',
          align: 'center',
          width: 100,
          fixed: 'left',
          render: (value) => {
            return (
              <Popover content={value} overlayStyle={{ maxWidth: 100 }}>
                {value}
              </Popover>
            );
          },
        },
        {
          /* 状态 */
          title: messages('common.column.status'),
          key: 'errorFlag',
          width: 100,
          dataIndex: 'errorFlag',
          align: 'center',
          fixed: 'left',
          render: (isEnabled) => (
            <Badge
              status={!isEnabled ? 'success' : 'error'}
              text={
                !isEnabled ? messages('base.successful') : messages('base.fail')
              }
            />
          ),
        },
        {
          title: messages('common.error.message') /* 错误信息 */,
          dataIndex: 'errorMsg',
          align: 'left',
          width: 300,
          render: (value) => {
            return (
              <Popover content={value} overlayStyle={{ maxWidth: 500 }}>
                {value}
              </Popover>
            );
          },
        },
      ],
      accept: ['.xlsx', '.xls'],
      templateProperties: {},
      tabKey: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;
    if (nextProps.visible && !visible) {
      this.setState({ visible: nextProps.visible });
      if (nextProps.showTemplate)
        this.getTemplateProperties(nextProps.templateCode);
    }
    if (!nextProps.visible) {
      this.setState({
        templateProperties: {},
        fileList: [],
        batchNo: null,
        successTotal: 0,
        failureTotal: 0,
        visible: false,
      });
    }
  }

  /**
   * 获取模板配置信息
   * @param {*} templateCode
   */
  getTemplateProperties(templateCode) {
    const { propertiesUrl, extraParams } = this.props;
    let url;
    if (propertiesUrl.indexOf('?') !== -1) {
      url = `${propertiesUrl}&templateCode=${templateCode}`;
    } else {
      url = `${propertiesUrl}?templateCode=${templateCode}`;
    }
    this.setState({ initLoading: true });
    httpFetch
      .post(url, extraParams)
      .then((res) => {
        const { data } = res;
        let tabKey = '';
        if (data.templateCode && data.sheetList.length > 0) {
          tabKey = data.sheetList[0].sheetIndex;
        }
        this.setState({
          templateProperties: res.data,
          fileList: [],
          batchNo: null,
          tabKey,
          initLoading: false,
        });
      })
      .catch(() => {
        this.setState({ initLoading: false });
      });
  }

  /**
   * 确认导入
   */
  confirm = () => {
    const { templateProperties, batchNo } = this.state;
    const { extraParams, afterSuccess, onConfirm } = this.props;
    this.setState({ uploading: true });
    if (onConfirm) {
      onConfirm({ templateProperties, batchNo }, () => {
        this.setState({ uploading: false });
      });
      return;
    }
    httpFetch
      .post(
        `${templateProperties.prefixPatch}/api/excel/import/confirm?templateCode=${templateProperties.templateCode}&batchNo=${batchNo}`,
        extraParams,
      )
      .then(() => {
        this.setState({ uploading: false });
        message.success(messages('common.operate.success'));
        this.onCancel();
        if (afterSuccess) {
          afterSuccess();
        }
      })
      .catch(() => {
        this.setState({ uploading: false });
      });
  };

  // 下载导入模板
  downloadTemplate = () => {
    const { extraParams } = this.props;
    const { templateProperties } = this.state;
    const url = `${templateProperties.prefixPatch}/api/excel/import/down/template?templateCode=${templateProperties.templateCode}`;

    const hide = message.loading(
      messages('common.spanned.file') /* 正在生成文件.. */,
    );
    httpFetch
      .post(url, extraParams, {}, { responseType: 'arraybuffer' })
      .then((res) => {
        const b = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const name = templateProperties.templateName;
        FileSaver.saveAs(b, `${name}.xlsx`);
        hide();
      })
      .catch(() => {
        hide();
      });
  };

  // 下载错误数据模板
  exportErrorData = () => {
    const { templateProperties, batchNo } = this.state;
    const url = `${templateProperties.prefixPatch}/api/excel/import/export/error/data?templateCode=${templateProperties.templateCode}&batchNo=${batchNo}`;
    const { extraParams } = this.props;
    const hide = message.loading(
      messages('common.spanned.file') /* 正在生成文件.. */,
    );
    httpFetch
      .post(url, extraParams, {}, { responseType: 'arraybuffer' })
      .then((res) => {
        const b = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const name = templateProperties.errorFileName;
        FileSaver.saveAs(b, `${name}.xlsx`);
        hide();
      })
      .catch(() => {
        hide();
      });
  };

  /**
   * 拼接url参数
   * @param {*} url
   * @returns
   */
  handleSetUrlParams = (url) => {
    const { extraParams } = this.props;
    let newUrlParam = '';
    if (Boolean(extraParams) && JSON.stringify(extraParams) !== '{}') {
      Object.keys(extraParams).forEach((key) => {
        newUrlParam += `&${key}=${extraParams[key]}`;
      });
      if (url.indexOf('?') !== -1) {
        return `${url}${newUrlParam}`;
      } else {
        newUrlParam = newUrlParam.substring(1);
        return `${url}?${newUrlParam}`;
      }
    }
    return url;
  };

  onCancel = () => {
    const { onClose } = this.props;
    const { templateProperties, batchNo } = this.state;
    if (batchNo !== undefined && batchNo !== null && batchNo !== '') {
      httpFetch
        .post(
          `${templateProperties.prefixPatch}/api/excel/import/cancel?templateCode=${templateProperties.templateCode}&batchNo=${batchNo}`,
        )
        .catch(() => {});
    }
    if (onClose) {
      onClose();
    }
  };

  tabChange = (value) => {
    this.setState({ tabKey: value }, () => {
      this.searchTable(value);
    });
  };

  searchTable = (sheetNo) => {
    this[`tableRef${sheetNo}`].search();
    const { templateProperties, batchNo } = this.state;
    const { extraParams } = this.props;
    httpFetch
      .post(
        `${templateProperties.prefixPatch}/api/excel/import/total?templateCode=${templateProperties.templateCode}&batchNo=${batchNo}&sheetNo=${sheetNo}`,
        extraParams,
      )
      .then((res) => {
        this.setState({
          successTotal: res.data.successTotal,
          failureTotal: res.data.failureTotal,
        });
      })
      .catch(() => {});
  };

  // 只能上传一个文件
  handleChange = (info) => {
    const { fileList, file } = info;
    const { status } = file;
    if (status === 'done') {
      message.success(messages('common.upload.success' /* 上传成功 */));
      const { tabKey } = this.state;
      const batchNo = file.response.data;
      this.setState({ batchNo }, () => {
        this.searchTable(tabKey);
      });
    } else if (status === 'error') {
      message.error(messages('common.upload.fail' /* 上传失败 */));
    }
    this.setState({ fileList });
  };

  // 自定义上传
  handleCustomUpload = (options) => {
    const { templateProperties } = this.state;
    const url = this.handleSetUrlParams(
      `${templateProperties.prefixPatch}/api/excel/import/upload?templateCode=${templateProperties.templateCode}`,
    );
    const formData = new FormData();
    formData.append('file', options.file);
    httpFetch
      .post(url, formData)
      .then((res) => {
        if (res.data) {
          options.onSuccess(res, options.file);
        } else {
          options.onError();
        }
      })
      .catch((error) => {
        options.onError();
        console.log(error);
      });
  };

  render() {
    const defaultButton = {
      downloadTemplate: messages('common.download.import.template'), // 下载导入模板
      confirm: messages('common.import'), // 导入
      downloadError: messages('common.download.error.data'), // 下载错误数据
      chooseFile: messages('common.choose.file'), // 选择文件
      // alertMessage: "base.common.import.result.msg",
    };
    const {
      title,
      afterClose,
      extraParams,
      buttonInfo = defaultButton,
    } = this.props;

    const { visible, initLoading, uploading } = this.state;
    const {
      tabKey,
      columns,
      accept,
      templateProperties,
      fileList,
      batchNo,
      successTotal,
      failureTotal,
    } = this.state;

    const props = {
      customRequest: this.handleCustomUpload,
      action: `${templateProperties.prefixPatch}/api/excel/import/upload?templateCode=${templateProperties.templateCode}`,
      onRemove: (file) => {
        // eslint-disable-next-line no-shadow
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      fileList,
      beforeUpload: (file) => {
        const fileType = (file.name || '').split('.').pop().toLowerCase();
        if (!accept.includes(`.${fileType}`)) {
          message.error(
            `${messages('common.upload.fail')}，${messages(
              'common.upload.excel',
            )}`,
          ); // 上传失败，请上传Excel文件
        }
      },
      accept: accept.join(),
      onChange: this.handleChange,
      maxCount: 1,
      itemRender: () => null,
    };

    return (
      <Modal
        width={1000}
        className="importer"
        visible={visible}
        onOk={this.confirm}
        onCancel={this.onCancel}
        afterClose={afterClose}
        title={title || templateProperties.templateName}
        confirmLoading={uploading}
        okText={buttonInfo.confirm /* 导入 */}
        cancelText={messages('common.cancel') /* 取消 */}
        okButtonProps={{ disabled: !batchNo }}
        bodyStyle={{ padding: '16px 32px', height: 460 }}
      >
        {visible &&
        templateProperties.templateCode &&
        templateProperties.sheetList.length > 0 ? (
          <div>
            <div className="table-header-for-index">
              <div className="table-header-buttons">
                <Button
                  size="small"
                  type="primary"
                  style={{ height: '28px', padding: '0 16px' }}
                  onClick={this.downloadTemplate}
                >
                  {buttonInfo.downloadTemplate /* 下载导入模板 */}
                </Button>
                <Upload {...props}>
                  <Button
                    type="primary"
                    size="small"
                    style={{ height: '28px', padding: '0 16px' }}
                  >
                    <UploadOutlined /> {buttonInfo.chooseFile /* 选择文件 */}
                  </Button>
                </Upload>
              </div>
            </div>
            <Tabs
              defaultActiveKey={tabKey}
              onChange={this.tabChange}
              tabBarStyle={{ marginTop: -2 }}
            >
              {templateProperties.sheetList.map((item) => {
                const tmpColumns = item.columns.map((v) => {
                  const tmp = {
                    title: v.columnName,
                    dataIndex: `excelData.${v.columnCode}`,
                    align: 'left',
                    render: (val, record) => {
                      const value = record.excelData[v.columnCode];
                      return (
                        <Popover
                          content={value}
                          overlayStyle={{
                            maxWidth: 500,
                            wordWrap: 'break-word',
                          }}
                        >
                          {value}
                        </Popover>
                      );
                    },
                  };
                  return tmp;
                });
                return (
                  <TabPane tab={item.sheetName} key={item.sheetIndex}>
                    {!!batchNo && (
                      <>
                        <div style={{ marginBottom: 16 }}>
                          <span style={{ color: '#333' }}>
                            {messages('common.upload.success') /* 上传成功 */}：
                          </span>
                          <span style={{ color: '#4390FF' }}>
                            {successTotal}&nbsp;
                          </span>
                          <span style={{ color: '#666' }}>
                            {messages('base.strip')}，
                            {
                              messages(
                                'common.click.tip',
                              ) /* 点击【导入】后将导入成功的数据进行保存 */
                            }
                          </span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <span style={{ color: '#333' }}>
                            {messages('common.upload.fail') /* 上传失败 */}：
                          </span>
                          <span style={{ color: '#F5222D' }}>
                            {failureTotal}&nbsp;
                          </span>
                          <span style={{ color: '#666' }}>
                            {messages('base.strip')}，
                            {
                              messages(
                                'common.upload.again',
                              ) /* 请修改错误数据后、重新上传 */
                            }
                          </span>
                          {!!failureTotal && (
                            <a
                              style={{ paddingLeft: 16, fontSize: 12 }}
                              onClick={this.exportErrorData}
                            >
                              {buttonInfo.downloadError /* 下载错误数据 */}
                            </a>
                          )}
                        </div>
                      </>
                    )}
                    <CustomTable
                      tableSize="small"
                      scroll={{ x: 500 + tmpColumns.length * 120 }}
                      bodyParams={extraParams}
                      methodType="post"
                      ref={(ref) => {
                        this[`tableRef${item.sheetIndex}`] = ref;
                      }}
                      columns={[...columns, ...tmpColumns]}
                      params={{
                        batchNo,
                        sheetIndex: item.sheetIndex,
                        templateCode: templateProperties.templateCode,
                      }}
                      url={
                        batchNo
                          ? `${templateProperties.prefixPatch}/api/excel/import/query`
                          : undefined
                      }
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        ) : initLoading ? (
          <div style={{ height: '100%', textAlign: 'center', paddingTop: 220 }}>
            <Spin />
          </div>
        ) : (
          <div>{messages('common.tpl.info.warning')}</div>
        )}
      </Modal>
    );
  }
}

// CommonImporter.propTypes = {
//   visible: PropTypes.bool,           // 导入弹框是否可见
//   templateCode: PropTypes.string, // 导入模板代码
//   title: PropTypes.string, // 导入框的标题
//   onClose: PropTypes.func, // 导入框的标题
//   propertiesUrl: PropTypes.string, // 获取配置信息的模板
//   extraParams: PropTypes.object,
//   showTemplate: PropTypes.string,  // 是否获取模版配置信息
//   onConfirm: PropTypes.func, // 提供确定按钮事件
// };

CommonImporter.defaultProps = {
  templateCode: undefined,
  visible: false,
  title: undefined,
  onClose: () => {},
  propertiesUrl: `${config.baseUrl}/api/excel/import/get/properties`,
  extraParams: {},
  showTemplate: true,
  onConfirm: undefined,
};

export default CommonImporter;
