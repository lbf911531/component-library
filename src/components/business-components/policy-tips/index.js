/*
 * @Author: cong.guo@hand-china.com
 * @Date: 2021-10-20 17:10:43
 * @LastEditors: binfeng.long@hand-china.com
 * @Version: 1.0.0
 * @Description: 费用政策 提交原因 填写
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { messages } from '../../utils';
import Table from '../../basic/table';

const { TextArea } = Input;

class PolicyTips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: messages('common.line.number'), // 行号
          dataIndex: 'rowIndex',
          width: 100,
          align: 'center',
        },
        {
          title: messages('common.tips'), // 提示信息
          dataIndex: 'tips',
          render: (value, record) => {
            const result = value ? value.split(',') : [];
            return result.map((item) => {
              return (
                <div
                  key={`${record.documentLineId}${record.rowIndex}`}
                  style={{ whiteSpace: 'normal' }}
                >
                  {item}
                </div>
              );
            });
          },
        },
        {
          title: messages('common.reasons.for.submission'), // '提交原因'
          dataIndex: 'submitReason',
          width: 250,
          render: (value, record) => {
            const { readOnly } = this.props;
            if (readOnly) {
              return value;
            } else {
              return (
                <TextArea
                  maxLength={1000}
                  showCount
                  value={value}
                  autoSize
                  onChange={(e) =>
                    this.textChange(e, value, record.rowIndex - 1)
                  }
                />
              );
            }
          },
        },
      ],
      dataSource: [],
      pagination: {
        total: 0,
        page: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: this.$pageSizeOptions,
        showTotal: (total, range) =>
          messages('common.show.total', {
            params: {
              range0: `${range[0]}`,
              range1: `${range[1]}`,
              total,
            },
          }),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource, visible } = nextProps;
    if (visible && dataSource.length) {
      const result = dataSource.map((item, index) => ({
        ...item,
        rowIndex: index + 1,
      }));
      this.setState({ dataSource: result });
    }
  }

  // 填写原因onChange
  textChange = (e, value, index) => {
    const { dataSource } = this.state;
    dataSource[index].submitReason = e.target.value;
    this.setState({ dataSource });
  };

  // 分页
  handlePage = (pagination) => {
    this.setState({ pagination });
  };

  // 确定
  onOk = () => {
    const { dataSource } = this.state;
    const { onOk } = this.props;
    if (onOk) {
      onOk(dataSource);
    }
  };

  render() {
    const { footer, visible, onCancel, readOnly, confirmLoading } = this.props;
    const { columns, dataSource, pagination } = this.state;

    return (
      <Modal
        title={messages('base.policy.verification.info') /** 政策校验信息 */}
        visible={visible}
        footer={readOnly ? null : footer}
        width={800}
        onOk={this.onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Table
          rowKey={(record) => record.documentLineId}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={this.handlePage}
          size="middle"
        />
      </Modal>
    );
  }
}

export default PolicyTips;
