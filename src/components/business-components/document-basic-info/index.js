import React, { Component } from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Col, message, Popover, Row, Spin, Tag, Tooltip } from 'antd';
import config from '@/config/config';
import httpFetch from '@/share/httpFetch';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { messages } from '../../utils';
import FileItem from './file-item';
import ImagePriview from '../../attachment/image-preview';
import ZipFileView from '../../attachment/image-preview';
import './document-basic-info.less';

TweenOne.plugins.push(Children);

class DocumentBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      detailLoading: true,
      // 图片附件预览
      previewVisible: false,
      imageIndex: 0,
      imageList: [],
      expend: true,
      copied: false,
      animation: null,
      zipFileVisible: false,
      treeData: {},
    };
    this.status = {
      // 未质检 ,质检中,已完成,关闭 这几个中文不要改成多语言,后端返回的字段就是中文
      未质检: {
        label: messages('common.no.quality.inspection'),
        className: 'tag-reject',
      },
      质检中: {
        label: messages('common.under.quality.inspection'),
        className: 'tag-edit',
      },
      已完成: {
        label: messages('common.state.finish'),
        className: 'tag-audit-pass',
      },
      关闭: {
        label: messages('common.close'),
        state: 'error',
        color: '#D9D9D9',
      },
      '1001D': {
        label: messages('common.entered' /* 已录入 */),
        className: 'tag-process',
      },
      '1002D': {
        label: messages('common.in.volume' /* 已成册 */),
        className: 'tag-process',
      },
      '1003D': {
        label: messages('common.in.the.book' /* 成册中 */),
        className: 'tag-edit',
      },
      '1004D': {
        label: messages('common.entering' /* 录入中 */),
        className: 'tag-edit',
      },
      '1005D': {
        label: messages('common.being.destroyed' /* 销毁中 */),
        className: 'tag-edit',
      },
      '1006D': {
        label: messages('common.destroyed' /* 已销毁 */),
        className: 'tag-reject',
      },
      '1007D': {
        label: messages('efs.boxed' /* 已入盒 */),
        className: 'tag-process',
      },
      '1008D': {
        label: messages('efs.Warehoused' /* 已入库 */),
        className: 'tag-process',
      },
      '1001N': { label: messages('common.editing'), className: 'tag-edit' },
      '1002N': {
        label: messages('common.approving'),
        className: 'tag-process',
      },
      '1003N': {
        label: messages('common.withdraw'),
        className: 'tag-withdraw',
      },
      '1004N': {
        label: messages('common.auditing'),
        className: 'tag-process',
      },
      '1005N': {
        label: messages('common.approve.rejected'),
        className: 'tag-reject',
      },
      '1004Y': {
        label: messages('common.approved'),
        className: 'tag-audit-pass',
      },
      '1001R': {
        label: messages('common.audit.reject'),
        className: 'tag-reject',
      },
      1001: { label: messages('common.editing'), className: 'tag-edit' }, // 编辑中
      1002: { label: messages('common.approving'), className: 'tag-process' }, // 审批中
      1003: { label: messages('common.withdraw'), className: 'tag-withdraw' }, // 撤回
      1004: {
        label: messages('common.approve.pass'),
        className: 'tag-approve-pass',
      }, // 审批通过
      1005: {
        label: messages('common.approve.rejected'),
        className: 'tag-reject',
      }, // 审批驳回
      6001: { label: messages('common.pending'), className: 'tag-process' }, // 暂挂中
      6002: {
        label: messages('common.canceled'),
        className: 'tag-cancel',
      }, // 已取消
      6003: {
        label: messages('common.state.finish'),
        className: 'tag-approve-pass',
      }, // 已完成
      1006: {
        label: messages('common.approved'),
        state: 'success',
        color: 'green',
      }, // 审核通过
      1007: {
        label: messages('common.audit.reject'),
        state: 'error',
        color: 'red',
      }, // 审核驳回
      2002: {
        label: messages('common.approved'),
        state: 'success',
        color: 'green',
      }, // 审核通过
      2004: {
        label: messages('common.reviewed'),
        state: 'success',
        color: 'green',
      }, // 复核通过
      2005: {
        label: messages('common.rejection.of.review'),
        state: 'error',
        color: 'red',
      }, // 复核驳回
      3002: {
        label: messages('common.auditing'),
        state: 'processing',
        color: 'geekblue',
      }, // 审核中
      5001: {
        label: messages('common.review.post'),
        state: 'processing',
        color: '#108ee9',
      }, // 复核(过账)
      5002: {
        label: messages('common.recoil.submitted'),
        state: 'processing',
        color: '#108ee9',
      }, // 反冲提交
      5003: {
        label: messages('common.recoil.audit'),
        state: 'processing',
        color: '#108ee9',
      }, // 反冲审核
      6004: {
        label: messages('common.cancel.pending'),
        state: 'success',
        color: '#87d068',
      }, // 取消暂挂
      9001: {
        label: messages('common.pay'),
        state: 'processing',
        color: '#108ee9',
      }, // 支付
      9002: {
        label: messages('common.payment.return'),
        state: 'processing',
        color: '#108ee9',
      }, // 退款
      9003: {
        label: messages('common.refund'),
        state: 'processing',
        color: '#108ee9',
      }, // 退票
      9004: {
        label: messages('acp.payment.reserved'),
        state: 'processing',
        color: '#108ee9',
      }, // 反冲
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData = (nextProps) => {
    if (!nextProps.params) return;
    if (nextProps.params.businessCode) {
      this.setState({ detailLoading: false });
    }

    if (nextProps.params.attachments && nextProps.params.attachments.length) {
      const imageList = nextProps.params.attachments.filter((o) =>
        this.isImage(o),
      );
      this.setState({ imageList });
    }
    this.setState({ data: nextProps.params }, () => {
      const { data } = this.state;
      this.setState({
        animation: {
          Children: {
            value: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
            floatLength: 2,
            formatMoney: true,
          },
          duration: 1000,
        },
      });
    });
  };

  /**
   * 点击链接 图片预览
   */
  onPreviewClick = (e, file) => {
    e.preventDefault();

    const { imageList } = this.state;

    this.setState({
      previewVisible: true,
      imageIndex: imageList.findIndex((o) => o.id == file.id),
    });
  };

  handlePriview = (index) => {
    const {
      data: { attachments },
    } = this.state;
    const flag = attachments[index].fileType.includes('zip');
    console.log(flag);
    if (flag) {
      this.zipFileView(index, attachments[index].id);
    } else {
      this.setState({
        previewVisible: true,
        imageIndex: index,
      });
    }
  };

  // 触发预览
  zipFileView = (index, id) => {
    httpFetch
      .get(`${config.fileUrl}/api/attachments/view/zip/tree?id=${id}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            zipFileVisible: true,
            treeData: res.data,
            imageIndex: index,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  isImage = (file) => {
    const sections = (file.fileName || file.name).split('.');
    const extension = sections[sections.length - 1];
    const imageExtension = ['png', 'gif', 'jpg', 'jpeg', 'bmp'];
    return imageExtension.includes(extension.toLowerCase());
  };

  isPDF = (file) => {
    const sections = (file.fileName || file.name).split('.');
    const extension = sections[sections.length - 1];
    const imageExtension = ['pdf', 'PDF'];
    return imageExtension.includes(extension.toLowerCase());
  };

  /**
   * 预览取消
   */
  previewCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  // 复制单号
  handleCopy = () => {
    this.setState(
      {
        copied: true,
      },
      () => {
        message.success(messages('common.copy.success'));
        setTimeout(() => {
          this.setState({ copied: false });
        }, 600);
      },
    );
  };

  // 渲染附件
  renderFiles = (showDelete) => {
    const {
      data: { attachments },
    } = this.state;
    const { colSpan } = this.props;
    const num = Math.round(24 / colSpan);

    return (
      <Row>
        {(attachments || []).map((item, index) => (
          <Col
            key={item.id}
            span={colSpan}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
              marginTop: 12,
            }}
            className={`attachments ${item.className || ''}`}
          >
            <div style={{ display: 'flex' }}>
              {index % num === 0 && index === 0 ? (
                <label style={{ color: '#333', marginRight: 8 }}>
                  {messages('common.attachments')}:
                </label>
              ) : (
                <label style={{ marginRight: 8, opacity: 0 }}>
                  {messages('common.attachments')}:
                </label>
              )}
              <FileItem
                title={item.fileName}
                attachmentOid={item.id}
                thumbnailUrl={item.thumbnailUrl}
                staticFileUrl={item.staticFileUrl}
                conversionStatus={item.conversionStatus}
                index={index}
                total={(attachments || []).length}
                onDownload={this.download}
                onDelete={showDelete && this.deleteFile}
                onPriview={this.handlePriview}
              />
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  download = (attachmentOid) => {
    const downloadURL = `${
      config.fileUrl
    }/api/attachments/download/${attachmentOid}?access_token=${sessionStorage.getItem(
      'token',
    )}`;
    const iframe = document.createElement('iframe');
    iframe.src = downloadURL;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };

  deleteFile = (attachmentOid, index) => {
    httpFetch
      .delete(`${config.fileUrl}/api/attachments/${attachmentOid}`)
      .then(() => {
        const { data } = this.state;
        data.attachments.splice(index, 1);
        message.success(messages('common.delete.success'));
        this.setState({ data, previewVisible: false });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handlePrevious = () => {
    const { imageIndex } = this.state;
    if (imageIndex === 0) return;
    this.setState({ imageIndex: imageIndex - 1 });
  };

  handleLast = () => {
    const {
      imageIndex,
      data: { attachments },
    } = this.state;
    if (imageIndex + 1 === attachments.length) return;
    this.setState({ imageIndex: imageIndex + 1 });
  };

  render() {
    const { deleteAttachments, extarButton, showEmpty, colSpan } = this.props;
    const {
      expend,
      data,
      detailLoading,
      animation,
      previewVisible,
      imageIndex,
      copied,
      zipFileVisible,
      treeData,
    } = this.state;
    const rows = [...(data.infoList || []), ...(data.customList || [])];
    const attachment = (data.attachments || [])[imageIndex];
    const showDelete =
      deleteAttachments &&
      [
        1001,
        1003,
        1005,
        '1001N',
        '1003N',
        '1005N',
        '1001R',
        1007,
        2005,
      ].includes(data.statusCode); // 1001R 是工作台退回状态
    const hasExtarButton =
      extarButton && extarButton.props && extarButton.props.children;

    return (
      <Spin spinning={detailLoading}>
        <div className="header-title" style={{ marginBottom: 8 }}>
          <Row
            gutter={12}
            style={{
              paddingTop: 16,
              flexWrap: 'nowrap',
              lineHeight: hasExtarButton ? '32px' : '22px',
            }}
          >
            <Col style={{ flex: '0 1 100%' }}>
              <span
                style={{
                  fontSize: 16,
                  float: 'left',
                  marginRight: 8,
                }}
              >
                <span
                  className="form-name"
                  style={{
                    fontSize: 16,
                    color: '#333333',
                    fontWeight: 600,
                    marginRight: 8,
                  }}
                >
                  {data.formName}
                </span>
                <span
                  className="business-code"
                  style={{
                    fontSize: 16,
                    color: '#333333',
                  }}
                >
                  <Popover
                    content={
                      <CopyToClipboard
                        text={data.businessCode}
                        onCopy={this.handleCopy}
                      >
                        <Tooltip
                          title={
                            messages(
                              'base.duplicate.odd.number',
                            ) /** 复制单号 */
                          }
                          getPopupContainer={() =>
                            document.querySelector('#copy-tip')
                          }
                          overlayStyle={{ width: '72px', textAlign: 'center' }}
                        >
                          {copied ? (
                            <CheckOutlined style={{ color: '#52c41a' }} />
                          ) : (
                            <CopyOutlined />
                          )}
                        </Tooltip>
                      </CopyToClipboard>
                    }
                    id="copy-tip"
                  >
                    {data.businessCodeClick ? (
                      <a onClick={(e) => data.businessCodeClick(e, data)}>
                        {data.businessCode}
                      </a>
                    ) : (
                      data.businessCode
                    )}
                  </Popover>
                </span>
              </span>
              <div
                style={{
                  float: 'left',
                  display: 'inline',
                  marginRight: 12,
                  fontSize: 14,
                }}
              >
                {data.statusCode && this.status[data.statusCode] && (
                  <Tag
                    style={{ verticalAlign: 'middle', marginRight: 0 }}
                    color={(this.status[data.statusCode] || {}).color}
                    className={(this.status[data.statusCode] || {}).className}
                  >
                    {(this.status[data.statusCode] || {}).label}
                  </Tag>
                )}
              </div>
              <div style={{ float: 'left', fontSize: 14 }}>{extarButton}</div>
            </Col>
            <Col style={{ flex: '1 0 0px', whiteSpace: 'nowrap' }}>
              {/* 金额 */}
              {data.currencyCode && (
                <div style={{ float: 'right' }}>
                  <div
                    style={{ textAlign: 'left', fontSize: '14px' }}
                    className="amount-title"
                  >
                    {messages('common.amount')}: &nbsp;
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#333333',
                      }}
                      className="amount-content"
                    >
                      <span className="currency-code">{data.currencyCode}</span>
                      &nbsp;
                      <span className="total-amount">
                        {typeof data.totalAmount === 'string' &&
                        data.totalAmount.length > 15 ? (
                          data.totalAmount
                        ) : (
                          <TweenOne
                            animation={animation}
                            style={{
                              fontSize: 16,
                              color: 'rgb(51,51,51)',
                              fontWeight: 700,
                              display: 'inline-block',
                            }}
                          >
                            0
                          </TweenOne>
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>

        {expend && (
          <div style={{ paddingBottom: 14 }}>
            <Row gutter={12}>
              {rows.map((item, index) => {
                const keyIndex = `key-${index}`;
                return (
                  item.value && (
                    <Col
                      style={{
                        marginTop: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'left',
                      }}
                      key={keyIndex}
                      span={colSpan}
                      className={item.className || ''}
                    >
                      <label style={{ color: '#333', paddingRight: 8 }}>
                        {item.label}:
                      </label>
                      {item.linkId ? (
                        <a
                          onClick={() => {
                            item.onClick(item.linkId);
                          }}
                          title={item.value}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: '#666' }} title={item.value}>
                          {item.value}
                        </span>
                      )}
                    </Col>
                  )
                );
              })}
            </Row>
            {(data.remark || showEmpty) && (
              <Row>
                <Col
                  style={{
                    marginTop: 8,
                    textAlign: 'left',
                  }}
                  span={colSpan}
                  className="over-range remark"
                >
                  <label style={{ color: '#333', paddingRight: 8 }}>
                    {messages('common.comment')}:
                  </label>
                  <span style={{ color: '#666' }}>
                    <Popover
                      content={
                        <div className="popover-style">{data.remark}</div>
                      }
                      placement="topLeft"
                    >
                      {data.remark}
                    </Popover>
                  </span>
                </Col>
              </Row>
            )}

            {showEmpty && (data.attachments || []).length === 0 && (
              <Row style={{ marginTop: 8 }} className="attachments">
                <label style={{ color: '#333', paddingRight: 8 }}>
                  {messages('common.attachments')}:
                </label>
              </Row>
            )}
            {this.renderFiles(showDelete)}
          </div>
        )}
        {attachment && attachment.id && !attachment.fileType.includes('zip') && (
          <ImagePriview
            attachmentOid={attachment.id}
            staticFileUrl={attachment.staticFileUrl}
            conversionStatus={attachment.conversionStatus}
            onClose={() => {
              this.setState({ previewVisible: false });
            }}
            visible={previewVisible}
            url={attachment.thumbnailUrl}
            title={attachment.fileName}
            onDownload={this.download}
            onDelete={showDelete && this.deleteFile}
            first={imageIndex === 0}
            last={imageIndex + 1 === (data.attachments || []).length}
            onPrevious={this.handlePrevious}
            onLast={this.handleLast}
            index={imageIndex}
          />
        )}
        {attachment && attachment.id && attachment.fileType.includes('zip') && (
          <ZipFileView
            {...this.props}
            onClose={() => {
              this.setState({ zipFileVisible: false });
            }}
            visible={zipFileVisible}
            treeData={treeData}
            title={attachment.fileName}
            attachment={attachment}
          />
        )}
      </Spin>
    );
  }
}

DocumentBasicInfo.defaultProps = {
  colSpan: 6,
  showEmpty: false,
};

export default DocumentBasicInfo;
