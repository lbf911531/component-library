import React, { Component } from 'react';
import {
  Select,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Spin,
  message,
  Tooltip,
  Anchor,
  Form,
} from 'antd';
import config from 'config';
import httpFetch from 'share/httpFetch';
import Connect from '../../custom-connect';
import { messages } from '../../utils';
import './index.less';

const { Link } = Anchor;

function SearchAreaWrap(props) {
  const { categoryList, handleSearch, handleReset } = props;

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Form labelAlign="right">
      <Row>
        <Col span={8}>
          <Form.Item
            {...formItemLayout}
            name=""
            typeCategoryId
            label={messages('common.large.class') /* 大类 */}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={messages('common.please.select')}
              getPopupContainer={(trigger) => trigger.parentNode}
              allowClear
            >
              {categoryList.map((item) => {
                return <Select.Option key={item.id}>{item.name}</Select.Option>;
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            {...formItemLayout}
            name="name"
            label={messages('common.name') /* 名称 */}
          >
            <Input
              placeholder={messages('common.please.enter')}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e) => handleSearch(e, form)}
            >
              {messages('common.search')}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => handleReset(form)}>
              {messages('common.clear')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

function RenderByType({ type, selected, selectHandle }) {
  return type.map((item) => {
    return (
      <Col key={item.id} onClick={() => selectHandle(item)} span={12}>
        <div
          className={`type-item ${
            selected.id === item.id ? 'selected-item' : ''
          }`}
        >
          <img alt="" src={item.iconUrl} className="type-item-ico" />
          <span className="type-item-word">
            <Tooltip title={item.name}>{item.name}</Tooltip>
          </span>
        </div>
      </Col>
    );
  });
}

class SelectApplicationType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      applicationData: [], // 未分组数据
      applicationTypes: {}, // 已分组数据
      curUrlHistoryIds: [], // localStorage最近使用 ids
      recentlyData: [], // 最近使用
      selected: {},
      loading: false,
      searchParams: {},
      categoryList: [], // 大类
      scrollElement: `modal-type-${new Date().getTime()}`, // 滚动的容器
      history: {},
      isInit: false,
      total: 0,
      confirmLoading: false, // 确定loading
    };
  }

  componentDidMount() {
    // this.getCategory();
    this.getHistoryType();
  }

  // 获取最近使用
  getHistoryType = () => {
    const { user, url } = this.props;
    let history = window.localStorage.getItem(`history_type_${user.id}`);
    if (history) {
      history = JSON.parse(history);
      const curUrlHistory = history[url];
      this.setState({ curUrlHistoryIds: curUrlHistory || [], history });
    }
  };

  // 设置最近使用
  setHistoryType = (value) => {
    const { history } = this.state;
    const { user, historyNum, url } = this.props;
    if (!history[url]) {
      history[url] = [];
    }
    const curUrlHistory = history[url];
    const index = curUrlHistory.findIndex((cur) => cur === value.id); // index用来区分顺序
    if (curUrlHistory.length < historyNum) {
      if (index >= 0) {
        curUrlHistory.splice(index, 1);
      }
      curUrlHistory.unshift(value.id);
    } else {
      if (index >= 0) {
        curUrlHistory.splice(index, 1);
      } else {
        curUrlHistory.pop();
      }
      curUrlHistory.unshift(value.id);
    }
    window.localStorage.setItem(
      `history_type_${user.id}`,
      JSON.stringify(history),
    );
    this.setState({ history, curUrlHistoryIds: history[url] });
  };

  // 筛选在范围内的最近使用
  filterRecentlyHistory = () => {
    const { applicationData, curUrlHistoryIds } = this.state;
    const result = [];
    applicationData.forEach((type) => {
      const index = curUrlHistoryIds.findIndex((item) => item === type.id); // index用来区分顺序
      if (index >= 0) {
        result[index] = type;
      }
    });
    this.setState({ recentlyData: result.filter((item) => item) });
  };

  // 获取申请类型列表
  getList = () => {
    let { searchParams } = this.state;
    const { params, method, bodyParams } = this.props;
    let { url } = this.props;
    const page = 0;
    const size = 9999;
    if (!url) return;
    if (method === 'get') {
      searchParams = { ...params, page, size, ...searchParams };
    } else if (method === 'post') {
      const queryParams = { ...params, ...searchParams };
      searchParams = bodyParams;
      if (/\?+/.test(url)) {
        url = `${url}&page=${page}&size=${size}`;
      } else {
        url = `${url}?page=${page}&size=${size}`;
      }
      for (const name in queryParams) {
        if (queryParams[name]) {
          url += `&${name}=${queryParams[name]}`;
        }
      }
    }
    this.setState({ loading: true });
    httpFetch[method](url, searchParams)
      .then((res) => {
        const total = Number(res.headers['x-total-count']) || 0;
        const applicationData = [...(res.data || [])];
        this.setState({ applicationData, total }, () => {
          this.getApplicationTypes();
          this.filterRecentlyHistory();
        });
      })
      .catch((err) => {
        this.setState({ loading: false, total: 0 });
        console.error(err);
      });
  };

  // 类型分组
  getApplicationTypes = () => {
    const { applicationData, isInit, categoryList } = this.state;
    const applicationTypes = {};
    applicationData.forEach((item) => {
      if (Array.isArray(applicationTypes[item.typeCategoryId])) {
        applicationTypes[item.typeCategoryId].push(item);
      } else {
        applicationTypes[item.typeCategoryId] = [item];
        if (isInit) {
          categoryList.push({
            id: item.typeCategoryId,
            name: item.typeCategoryName,
          });
        }
      }
    });
    this.setState({ applicationTypes, categoryList, loading: false }, () => {
      const { value } = this.props;
      if (isInit && value && value.id) {
        const cur = applicationData.find((item) => item.id === value.id);
        if (cur) {
          const curElement = document.querySelector(
            `#type${cur.typeCategoryId}`,
          );
          if (curElement) {
            curElement.scrollIntoView();
          }
        }
      }
      this.setState({ isInit: false });
    });
  };

  // 获取申请大类
  getCategory = () => {
    let {
      params: { setOfBooksId },
    } = this.props;
    const {
      company: { setOfBooksId: setOfBooksIdFromCompany },
    } = this.props;
    if (!setOfBooksId) {
      setOfBooksId = setOfBooksIdFromCompany;
    }
    httpFetch
      .get(`${config.expenseUrl}/api/expense/types/category`, { setOfBooksId })
      .then((res) => {
        this.setState({ categoryList: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 下拉框获取焦点
  onDropdownVisibleChange = (value) => {
    const { value: valueFromProps } = this.props;
    if (value) {
      this.setState(
        { visible: true, selected: { ...valueFromProps }, isInit: true },
        this.getList,
      );
    }
  };

  // 清空
  clearChange = () => {
    this.setState({ selected: {} }, () => {
      this.handleOkCheck();
    });
  };

  // 确定时的校验
  handleOkCheck = () => {
    const { selected } = this.state;
    const { handleOkCheck, value } = this.props;
    // if (selected.id === (value || {}).id) {
    //   this.setState({ visible: false });
    //   return null;
    // }
    if (handleOkCheck) {
      handleOkCheck(this.handleOk, selected, value);
    } else {
      this.handleOk(selected);
    }
  };

  // 确定
  handleOk = (value, ...rest) => {
    const { selected } = this.state;
    if (selected.id) {
      this.setHistoryType(selected);
    }
    this.getFields(value, ...rest); // 获取动态字段
  };

  // 根据所选的类型 或对应的动态字段fields
  getFields = (value, ...rest) => {
    const { onChange } = this.props;
    if (value && value.id) {
      this.setState({ confirmLoading: true });
      httpFetch
        .get(`${config.expenseUrl}/api/expense/types/${value.id}/fields`)
        .then(({ data }) => {
          const result = { ...value, fields: data || [] };
          if (onChange) {
            onChange(result, ...rest);
          }
          this.setState({ visible: false, confirmLoading: false });
        })
        .catch((err) => {
          this.setState({ confirmLoading: false });
          message.error(err.response.data.message);
        });
    } else if (onChange) {
      onChange(value, ...rest);
    }
  };

  // 取消
  handleCancel = () => {
    this.setState({ visible: false, selected: {} });
  };

  // 弹框关闭后
  afterClose = () => {
    this.setState({
      applicationTypes: {},
      selected: {},
      total: 0,
      categoryList: [],
      searchParams: {},
    });
  };

  // 选中某个类型
  select = (item) => {
    this.setState({ selected: item });
  };

  // 搜索
  handleSearch = (e, form) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields((err, value) => {
      if (!err) {
        this.setState(
          { searchParams: value ? { ...value } : {} },
          this.getList,
        );
      }
    });
  };

  // 清空
  handleReset = (form) => {
    const { resetFields } = form;
    resetFields();
    this.setState({ searchParams: {} });
  };

  // 锚点点击事件
  onAnchorClick = (e) => {
    e.preventDefault();
  };

  render() {
    const {
      visible,
      applicationTypes,
      recentlyData,
      selected,
      loading,
      categoryList,
      scrollElement,
      total,
      confirmLoading,
    } = this.state;
    const { hideSelect, disabled, value, placeholder, title, allowClear } =
      this.props;
    const applicationTypeList = Object.values(applicationTypes);

    return (
      <div className="select-application-type-wrap">
        {!hideSelect && (
          <Select
            disabled={disabled}
            value={value ? value.name : value}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
            dropdownStyle={{ display: 'none' }}
            placeholder={placeholder || messages('common.please.select')}
            allowClear={allowClear}
            onChange={this.clearChange}
            showArrow={false}
          />
        )}

        <Modal
          title={title || messages('common.application.type')}
          visible={visible}
          onOk={this.handleOkCheck}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          bodyStyle={{ height: '65vh', overflow: 'auto', maxHeight: '65vh' }}
          width={1000}
          className={scrollElement}
          afterClose={this.afterClose}
          destroyOnClose
        >
          <div className="select-application-type">
            <SearchAreaWrap
              handleSearch={this.handleSearch}
              handleReset={this.handleReset}
              categoryList={categoryList}
            />

            <Spin spinning={loading}>
              <div className="type-total">
                {
                  messages('common.total.of.results', {
                    params: { total },
                  }) /* 共{total}条结果 */
                }
              </div>
              <Row gutter={30} style={{ marginTop: 16 }}>
                <Col span={6} className="anchor-box">
                  <Anchor
                    onClick={this.onAnchorClick}
                    getContainer={() =>
                      document.querySelector(
                        `.${scrollElement} .ant-modal-body`,
                      )
                    }
                    style={{
                      maxHeight:
                        value && value.id ? 'calc(65vh - 106px)' : '65vh',
                      display: visible ? 'block' : 'none',
                    }}
                    // offsetTop={20}
                  >
                    {!!recentlyData.length && (
                      <div className="type-title-wrap over-range">
                        <Link
                          href="#recently-type"
                          title={
                            messages('common.recently.used') /* 最近使用 */
                          }
                        />
                        <span className="type-item-num">
                          {loading ? null : recentlyData.length}
                        </span>
                      </div>
                    )}
                    {applicationTypeList.map((type) => {
                      return (
                        <div
                          className="type-title-wrap over-range"
                          key={type[0].typeCategoryId}
                        >
                          <Link
                            href={`#type${type[0].typeCategoryId}`}
                            title={type[0].typeCategoryName}
                          />
                          <span className="type-item-num">{type.length}</span>
                        </div>
                      );
                    })}
                  </Anchor>
                </Col>
                <Col span={18}>
                  {!!recentlyData.length && (
                    <div>
                      <div id="recently-type" className="type-title">
                        {messages('common.recently.used') /* 最近使用 */}
                      </div>
                      <Row gutter={16}>
                        <RenderByType
                          type={recentlyData}
                          selected={selected}
                          selectHandle={this.select}
                        />
                      </Row>
                    </div>
                  )}

                  {applicationTypeList.map((type) => {
                    return (
                      <div key={type[0].typeCategoryId}>
                        <div
                          id={`type${type[0].typeCategoryId}`}
                          className="type-title"
                        >
                          {type[0].typeCategoryName}
                        </div>
                        <Row gutter={16}>
                          <RenderByType
                            type={type}
                            selected={selected}
                            selectHandle={this.select}
                          />
                        </Row>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Spin>
          </div>
        </Modal>
      </div>
    );
  }
}

// SelectApplicationType.propTypes = {
//   url: PropTypes.string,
//   historyNum: PropTypes.number, // 最近使用 数量
//   hideSelect: PropTypes.bool, // 是否隐藏select
//   method: PropTypes.string, // 查询接口method
//   bodyParams: PropTypes.any, // post requestBody参数
//   allowClear: PropTypes.bool,
//   value: PropTypes.any,
//   params: PropTypes.object,
// };

SelectApplicationType.defaultProps = {
  allowClear: false,
  url: '',
  hideSelect: false,
  historyNum: 6,
  params: {},
  bodyParams: {},
  value: {},
  method: 'get',
};

function mapStateToProps(state) {
  return {
    company: state.user.company,
    user: state.user.currentUser,
  };
}

export default Connect(mapStateToProps, null, null, { forwardRef: true })(
  SelectApplicationType,
);
