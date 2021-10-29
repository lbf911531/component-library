/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-29 14:23:27
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-29 15:38:47
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { Component } from 'react';

import { Button, Modal, Form } from 'antd';
import { messages } from '@/components/utils';
import config from 'config';
import httpFetch from 'share/httpFetch';
import WrappedForm from '@/components/wrapped-form';
import { IProps, IState } from './interface';
import Lov from '../../form/lov';

import './style.less';

/**
 * 点击该组件，自动调用接口判断是否要展示模态框，并选取人员范围数据
 * 如果接口返回了数据，表示弹窗，根据数据渲染Form.Item，
 * 经选取值后 保存，保存成功后继续执行原父组件中单据提交的原函数
 * 如果接口没返回数据，则直接执行原父组件中单据提交事件
 */
class DocumentSubmitBtn extends Component<IProps, IState> {
  formRef: any;

  static defaultProps = {
    onClick: () => {},
    url: '',
    btnLoading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModalVisible: false, // 模态框展示与否
      submitLoading: false, // 模态框内确定按钮loading
      loading: false, // 提交按钮loading
      itemList: [], // 模态框内Form.Item渲染依据后台接口返回数据
      selectorItem: {
        title: 'common.select.staff',
        url: `${config.wflUrl}/api/wfl/identity/optional/query/by/document`,
        searchForm: [
          { type: 'input', id: 'userCode', label: 'common.staff.code' },
          { type: 'input', id: 'userName', label: 'common.staff.name' },
        ],
        columns: [
          { title: 'common.staff.code', dataIndex: 'userCode', width: '25%' },
          { title: 'common.staff.name', dataIndex: 'userName', width: '25%' },
        ],
        key: 'userId',
        method: 'post',
      },
    };
  }

  // 提交按钮-是否展示模态框
  handleModalShow = () => {
    const { onClick, url, approvalRule } = this.props;
    if (['RETURN_NODE', 'RETURN_WORKBANCH'].includes(approvalRule)) {
      onClick();
      return;
    }
    this.setState({ loading: true });
    httpFetch
      .get(url)
      .then(({ data }) => {
        if (data && data.length) {
          this.setState({
            showModalVisible: true,
            itemList: data,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
          onClick();
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  // 渲染Form.Item
  renderFormItem = () => {
    const { itemList, selectorItem } = this.state;
    const FormItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 10,
      },
    };
    if (Array.isArray(itemList) && itemList.length) {
      return itemList.map((item, index) => {
        const itemIndex = `item${index}`;
        return (
          <Form.Item
            {...FormItemLayout}
            key={itemIndex}
            label={item.title}
            name={item.approvalNodeId}
            rules={[
              {
                required: item.required,
                message: messages('common.please.select'),
              },
            ]}
          >
            <Lov
              // @ts-ignore
              selectorItem={selectorItem}
              labelKey="userName"
              valueKey="userId"
              showDetail={false}
              listExtraParams={{}}
              single={!item.multiSelectFlag || false}
              method={selectorItem.method}
              requestBody={item}
              lovType="chooser"
            />
          </Form.Item>
        );
      });
    }
  };

  // 关闭弹窗
  handleCancel = () => {
    this.setState(
      { showModalVisible: false, loading: false, submitLoading: false },
      () => {
        const { resetFields } = this.formRef;
        resetFields();
      },
    );
  };

  // 模态框确认按钮回调-收集参数值
  handleOk = (e) => {
    e.preventDefault();
    const { validateFields } = this.formRef;
    const { itemList } = this.state;
    this.setState({
      submitLoading: true,
    });
    validateFields()
      .then((values) => {
        let temp = [];
        Object.keys(values).forEach((key) => {
          if (!values[key]) {
            return false;
          }
          temp = temp.concat(values[key]);
        });
        const formParams = {
          entityId:
            Array.isArray(itemList) &&
            itemList.length > 0 &&
            itemList[0]?.entityId,
          entityType:
            Array.isArray(itemList) &&
            itemList.length > 0 &&
            itemList[0]?.entityType,
          records: [...temp],
        };
        this.handleSaveRangeInfo(formParams);
      })
      .catch((err) => {
        this.setState({ submitLoading: false });
        console.log(err);
      });
  };

  // 存储模态框选择的人员范围数据--调接口保存,完了之后正常提交 onClick的事件'
  handleSaveRangeInfo = (params) => {
    const { onClick } = this.props;
    const url = `${config.wflUrl}/api/wfl/identity/optional/choose/optional/select`;
    httpFetch
      .post(url, params)
      .then((res) => {
        if (res) {
          this.setState(
            {
              showModalVisible: false,
              submitLoading: false,
            },
            () => {
              onClick(this.goBack);
              const { resetFields } = this.formRef;
              resetFields();
            },
          );
        }
      })
      .catch((err) => {
        this.setState({ submitLoading: false });
        console.error(err);
      });
  };

  // 操作后返回到上个页面
  goBack = () => {
    // @ts-ignore
    if (this.$goBack) {
      // @ts-ignore
      this.$goBack();
    }
  };

  render() {
    const { showModalVisible, submitLoading, loading } = this.state;
    const { btnLoading, className, block } = this.props;
    return (
      <>
        <Button
          block={block}
          className={className}
          type="primary"
          loading={loading || btnLoading}
          onClick={this.handleModalShow}
        >
          {messages('common.submit')}
        </Button>
        <Modal
          visible={showModalVisible}
          title={messages('common.approver') /** 自选审批人 */}
          footer={null}
          bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <Form
            ref={(ref) => {
              this.formRef = ref;
            }}
          >
            <div style={{ marginBottom: '48px' }}>{this.renderFormItem()}</div>
            <div
              className="slide-footer"
              style={{
                textAlign: 'right',
                height: '48px',
                lineHeight: '48px',
                paddingRight: '28px',
              }}
            >
              <Button
                className="btn"
                type="primary"
                onClick={this.handleOk}
                loading={submitLoading}
                style={{ minWidth: '72px' }}
              >
                {messages('common.save')}
              </Button>
              <Button
                className="btn"
                onClick={this.handleCancel}
                style={{ minWidth: '72px' }}
              >
                {messages('common.cancel')}
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export default WrappedForm(DocumentSubmitBtn);
