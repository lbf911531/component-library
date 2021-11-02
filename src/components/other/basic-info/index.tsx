import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SearchArea from '@/components/basic/search-area-lov';
import {
  Card,
  Row,
  Col,
  Badge,
  Tooltip,
  Popover,
  Modal,
  Divider,
  Switch,
} from 'antd';
import moment from 'moment';
import WrappedForm from '@/components/wrapped-form';
import config from 'config';
import { messages } from 'utils/utils';
import { IProps, IState } from './interface';

import './style.less';
/**
 * 基本信息组件
 * @params infoList   渲染表单所需要的配置项，详见search-area组件的 searchForm 表单列表
 * @params infoData  基本信息数据
 * @params updateHandle  点击保存时的回调
 * @params updateState  保存状态，保存成功设为true，保存失败设为false，用于判断修改界面是否关闭
 * @params eventHandle 表单的onChange事件
 * @params loading 表单保存时保存按钮loading
 */

class BasicInfo extends React.Component<IProps, IState> {
  formRef: any;

  static defaultProps = {
    eventHandle: () => {},
    updateHandle: () => {},
    cancelHandle: () => {},
    isHideEditBtn: false,
    runEditor: false,
    isDefineBySelf: false,
    updateState: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      infoList: [],
      searchForm: [],
      infoData: {},
      cardShow: true,
      previewVisible: false,
      previewImage: '',
    };
  }

  componentDidMount() {
    const {
      runEditor,
      infoList: infoListFromProps,
      infoData: infoDataFromProps,
    } = this.props;
    this.setState(
      { infoList: infoListFromProps, infoData: infoDataFromProps },
      () => {
        if (runEditor) {
          this.editInfo();
        }
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        infoData: nextProps.infoData,
        loading: nextProps.loading,
      },
      () => {
        if (nextProps.updateState) {
          this.setState({ cardShow: true });
        }
      },
    );
  }

  setValues = (values) => {
    this.formRef.setValues(values);
  };

  getInfo() {
    const { infoData, infoList: infoListFromState } = this.state;
    const { colSpan } = this.props;
    let children = [];
    const rows = [];
    const infoList = [].concat(infoListFromState);
    infoList.forEach((items, index) => {
      const item = items;
      // 获取默认值
      item.defaultValue = infoData[item.id] || '-';

      // 规则定义的有效时间
      if (item.items) {
        item.items.forEach((childItem) => {
          const indexChild = childItem;
          indexChild.defaultValue = moment(
            infoData[indexChild.id],
            'YYYY-MM-DD',
          );
          if (infoData[indexChild.id] === null) {
            indexChild.defaultValue = undefined;
          }
        });
        // 这里没有将items里的成员提取出来，不知道 原来infoList是怎么配置 items的，而且还return了，理解不能
        children.push(
          <Col
            span={colSpan || 8}
            style={{ marginBottom: '15px' }}
            key={item.id}
          >
            <div style={{ color: '#989898' }}>{item.infoLabel}</div>
            {this.renderGetInfo(item)}
          </Col>,
        );
        return;
      }

      // 格式化日期的默认值
      if (item.type === 'date') {
        item.defaultValue = moment(item.defaultValue, 'YYYY-MM-DD');
      }

      children.push(
        <Col
          span={colSpan || 8}
          style={{ marginBottom: '15px', paddingRight: '5px' }}
          key={item.id}
        >
          <div style={{ color: '#989898' }}>{item.label}</div>
          {this.renderGetInfo(item)}
        </Col>,
      );
      if (colSpan) {
        if ((index + 1) % 4 === 0) {
          rows.push(<Row key={`${this.uuid()}_${index}`}>{children}</Row>);
          children = [];
        }
      } else if ((index + 1) % 3 === 0) {
        rows.push(<Row key={`${this.uuid()}_${index}`}>{children}</Row>);
        children = [];
      }

      if (index + 1 === infoList.length && (index + 1) % 3 !== 0) {
        rows.push(<Row key={`${this.uuid()}_${index}`}>{children}</Row>);
      }
    });
    return rows;
  }

  // 图片预览
  preview = (record) => {
    this.setState({
      previewVisible: true,
      previewImage:
        record.thumbnailUrl &&
        `${record.thumbnailUrl}?access_token=${sessionStorage.getItem(
          'token',
        )}`,
    });
  };

  handelEvent = (e, event) => {
    const { eventHandle } = this.props;
    eventHandle(event, e ? (e.target ? e.target.value : e) : null);
  };

  handelCancel = () => {
    const { cancelHandle } = this.props;
    const { infoData } = this.state;
    if (cancelHandle) {
      cancelHandle(infoData);
    }
    this.setState({ cardShow: true });
  };

  handleUpdate = (params) => {
    const { updateHandle } = this.props;
    updateHandle(params);
  };

  // 点击 "编辑"
  editInfo = () => {
    const { handleEdit, beforeEditHandle } = this.props;
    const { infoData, infoList } = this.state;
    if (handleEdit) {
      handleEdit();
      return;
    }
    let show = true;
    if (beforeEditHandle) {
      show = beforeEditHandle(infoData);
    }
    if (show) {
      const values = {};
      const searchForm = [].concat(infoList);
      searchForm.forEach((items, index) => {
        const item = items;
        if (item.type === 'badge' || item.type === 'file') {
          searchForm.splice(index, 1);
        } else {
          values[item.id] = infoData[item.id];
        }
        if (['switch'].includes(item.type)) {
          item.defaultValue = values[item.id];
        } else {
          item.defaultValue = values[item.id] || undefined;
        }
        if (item.language) {
          const record = infoData;
          item.defaultValue = record.id
            ? {
                value: record[item.id],
                i18n: record.i18n ? record.i18n[item.id] || [] : [],
              }
            : undefined;
        }
      });
      // @ts-ignore
      searchForm.expand = true;
      this.setState({ searchForm, cardShow: false });
    }
  };

  // 生成随机的UUID, 临时id
  uuid = () => {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';

    const uuid = s.join('');
    return uuid;
  };

  // 渲染基本信息显示页
  renderGetInfo(item) {
    const { infoData } = this.state;
    // 这边我要加一个显示图片字段的
    if (
      item.type.toLowerCase() === 'img' ||
      item.type.toLowerCase() === 'image'
    ) {
      const url = infoData[item.src]
        ? `${config.fileUrl}${
            infoData[item.src]
          }?access_token=${sessionStorage.getItem('token')}`
        : '';
      return (
        <Tooltip
          title={<img alt="" style={{ width: 200, height: 200 }} src={url} />}
        >
          <img alt="" style={{ width: 20, height: 20 }} src={url} />
        </Tooltip>
      );
    } else if (item.type === 'switch') {
      return (
        <Badge
          status={infoData[item.id] ? 'success' : 'error'}
          text={
            infoData[item.id]
              ? messages('common.enabled') /* 启用 */
              : messages('common.disable') /* 禁用 */
          }
        />
      );
    } else if (item.type === 'status') {
      return (
        <span>
          <Switch
            checked={infoData[item.id]}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
          <span>
            &nbsp;&nbsp;
            {infoData[item.id]
              ? messages('common.enable')
              : messages('common.disable')}
          </span>
        </span>
      );
    } else if (item.type === 'select' || item.type === 'value_list') {
      if (item.options) {
        item.options.map((option) => {
          // 有options选项时显示label值
          if (infoData[item.id] === option.value) {
            infoData[item.id] = option.label;
          }
          return item.defaultValue && item.defaultValue.label ? (
            <div style={{ wordWrap: 'break-word', color: '#333' }}>
              {item.defaultValue.label || infoData[item.id] || '-'}
            </div>
          ) : infoData && infoData[item.id] ? (
            infoData[item.id]
          ) : (
            '-'
          );
        });
      }
    } else if (item.type === 'list') {
      if (!item.defaultValue) return;
      let returnRender;
      const returnList = [];
      if (item.defaultValue.length <= 5) {
        if (item.defaultValue.map) {
          item.defaultValue.forEach((list) => {
            returnList.push(list[item.labelKey]);
          });
        }
        returnRender = (
          <div style={{ wordWrap: 'break-word', color: '#333' }}>
            {returnList.join() || '-'}
          </div>
        );
      } else {
        returnRender = (
          <div style={{ wordWrap: 'break-word', color: '#333' }}>
            {
              messages('common.accounting.selected', {
                count: item.defaultValue.length,
              }) /* 已选 {total} 条 */
            }
          </div>
        );
      }
      return returnRender;
    } else if (item.type === 'date') {
      // 时间
      const formatValue = item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
      const dateValue = moment(infoData[item.id]).format(formatValue);
      return (
        infoData[item.id] && (
          <div style={{ wordWrap: 'break-word', color: '#333' }}>
            {dateValue || '-'}
          </div>
        )
      );
    } else if (item.type === 'badge') {
      // 状态
      return infoData[item.id] ? (
        <Badge
          status={infoData[item.id].status}
          text={infoData[item.id].value}
        />
      ) : (
        '-'
      );
    } else if (item.type === 'file') {
      // 附件
      const fileArr = [];
      if (infoData[item.id]) {
        infoData[item.id].map((link) => {
          fileArr.push(
            <Col
              span={6}
              style={{
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              key={link.id}
            >
              <Popover content={link.fileName}>
                {link.fileType !== 'IMAGE' ? (
                  <a
                    href={`${config.fileUrl}/api/attachments/download/${
                      link.attachmentOid
                    }?access_token=${sessionStorage.getItem('token')}`}
                  >
                    {link.fileName}
                  </a>
                ) : (
                  <a
                    onClick={() => {
                      this.preview(link);
                    }}
                  >
                    {link.fileName}
                  </a>
                )}
              </Popover>
            </Col>,
          );
          return fileArr.length > 0 ? fileArr : '-';
        });
      }
    } else {
      return (
        <div style={{ wordWrap: 'break-word', color: '#333' }}>
          {infoData[item.id] || '-'}
        </div>
      );
    }
  }

  render() {
    const {
      isHideEditBtn,
      isDefineBySelf,
      title,
      size,
      maxLength,
      formItemLayout,
    } = this.props;
    const { cardShow, searchForm, loading, previewVisible, previewImage } =
      this.state;
    let EditBtn = null;

    if (!isHideEditBtn && isDefineBySelf) {
      EditBtn = (
        <span>
          <a onClick={this.editInfo}>{messages('common.edit') /* 编辑 */}</a>
          <Divider type="vertical" />
          {/* {this.props.renderBtnBySelf()} */}
        </span>
      );
    } else if (!isHideEditBtn) {
      EditBtn = (
        <a onClick={this.editInfo}>{messages('common.edit') /* 编辑 */}</a>
      );
    }

    let domRender;
    if (cardShow) {
      domRender = (
        <Card
          title={title || messages('common.base.info') /* 基本信息 */}
          extra={EditBtn}
          size={size || 'default'}
        >
          <div>{this.getInfo()}</div>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={() => {
              this.setState({ previewVisible: false });
            }}
          >
            <img
              alt="example"
              style={{ width: '100%' }}
              src={
                previewImage &&
                `${previewImage}?access_token=${sessionStorage.getItem(
                  'token',
                )}`
              }
            />
          </Modal>
        </Card>
      );
    } else {
      domRender = (
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.handleUpdate}
          clearHandle={this.handelCancel}
          eventHandle={this.handelEvent}
          wrappedComponentRef={(inst) => {
            this.formRef = inst;
          }}
          okText={messages('common.save') /* 保存 */}
          clearText={messages('common.cancel') /* 取消 */}
          loading={loading}
          maxLength={maxLength || 6}
          formItemLayout={formItemLayout || null}
        />
      );
    }

    return <div className="basic-info">{domRender}</div>;
  }
}

export default WrappedForm(BasicInfo);
