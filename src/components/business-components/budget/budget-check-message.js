import React, { Component } from 'react';
import { Button, Modal, Popover } from 'antd';
import Table from '../../basic/table';

class BudgetTips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: this.$t('common.sequence'),
          dataIndex: 'sort',
          width: 40,
          align: 'center',
          render: (value, record, index) => {
            const {
              pagination: { current, pageSize },
            } = this.state;
            return <span>{(current - 1) * pageSize + index + 1}</span>;
          },
        },
        {
          title: this.$t('budget.control.method'), // 预算控制方法
          dataIndex: 'messageLevelName',
          width: 100,
        },
        {
          title: this.$t('budget.verification.information'), // 校验信息
          dataIndex: 'errorMessage',
          width: 400,
          render: (value) => {
            return (
              <Popover
                content={value}
                placement="topLeft"
                getPopupContainer={(trigger) => trigger.parentNode}
                className="description-popover-wrap"
                overlayClassName="popover-style"
              >
                <div style={{ whiteSpace: 'normal' }}>{value}</div>
              </Popover>
            );
          },
        },
      ],
      pagination: {
        total: 0,
        page: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: this.$pageSizeOptions,
        showTotal: (total, range) =>
          this.$t('common.show.total', {
            range0: `${range[0]}`,
            range1: `${range[1]}`,
            total,
          }),
      },
      waringLevel: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { budgetCheckMessage } = nextProps;
    if (
      budgetCheckMessage &&
      budgetCheckMessage.length > 0 &&
      budgetCheckMessage[0].messageLevel === 'ALLOWED'
    ) {
      this.setState({ waringLevel: true });
    } else {
      this.setState({ waringLevel: false });
    }
  }

  /**
   * 切换页码
   * @param pagination1
   */
  paginationOnChange = (pagination1) => {
    this.setState({ pagination: pagination1 });
  };

  render() {
    const { visible, onOk, onCancel, maskClosable, budgetCheckMessage } =
      this.props;
    const { columns, pagination, waringLevel } = this.state;

    return (
      <Modal
        title={
          this.$t('budget.budget.verification.information') /** 预算校验信息 */
        }
        visible={visible}
        maskClosable={maskClosable !== undefined ? maskClosable : true}
        width={1000}
        onCancel={onCancel}
        footer={
          <>
            {waringLevel ? (
              <>
                <Button type="primary" onClick={onOk}>
                  {this.$t('itinerary.type.slide.and.modal.ok.btn')}
                </Button>
                <Button onClick={onCancel}>{this.$t('common.cancel')}</Button>
              </>
            ) : (
              <Button type="primary" onClick={onCancel}>
                {this.$t('expense.got.it') /* 知道了 */}
              </Button>
            )}
          </>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={budgetCheckMessage}
          pagination={pagination}
          onChange={this.paginationOnChange}
          size="middle"
          bordered
        />
      </Modal>
    );
  }
}

export default BudgetTips;
