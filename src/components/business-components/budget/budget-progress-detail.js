import React from 'react';
import { Modal, Popover, Tabs } from 'antd';
import config from '@/config/config';
import httpFetch from '@/share/httpFetch';
import { cloneDeep } from 'lodash';
import { messages } from '../../utils';
import CustomTable from '../../basic/custom-table';

const { TabPane } = Tabs;

class BudgetProgressDetail extends React.Component {
  constructor(props) {
    super(props);
    const isReserve = ['EXP_REQUISITION', 'TRAVEL_APPLICATION'].includes(
      props.baseParams?.documentType,
    );
    this.state = {
      scrollx: 260,
      usedColumns: [] /* 列表使用的columns */,
      dimensionColumns: [],
      dimensionItemGroupColumns: [],
      columns: [
        {
          title: messages('common.line.number') /* 行号 */,
          dataIndex: 'lineNumber',
          align: 'left',
          width: '5%',
        },
        {
          title: messages(
            'common.control.results.on.submission',
          ) /* 提交时控制结果 */,
          dataIndex: 'controlLevel',
          align: 'left',
          width: '10%',
        },
        {
          title: messages('common.budget.version'),
          dataIndex: 'versionName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.budget.structure'),
          dataIndex: 'structureName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.budget.scenarios'),
          dataIndex: 'scenarioName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.period'),
          dataIndex: 'periodName',
          align: 'left',
          width: '8%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages(
            'budget.strategy.detail.control.period',
          ) /* 控制期段 */,
          dataIndex: 'periodStrategy',
          align: 'left',
          width: '10%',
          render: (value) => <Popover content={value}>{value}</Popover>,
        },
        {
          title: messages('common.budget.item') /* 预算项目 */,
          dataIndex: 'itemName',
          align: 'left',
          width: '10%',
          render: (value) => <Popover content={value}>{value}</Popover>,
        },
        {
          title: isReserve
            ? messages('common.application.type')
            : messages('common.expense.type'),
          dataIndex: 'expenseTypeName',
          align: 'left',
          width: '10%',
          render: (value) => <Popover content={value}>{value}</Popover>,
        },
        {
          title: messages('common.company'),
          dataIndex: 'companyName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.company.group'),
          dataIndex: 'companyGroupName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.department'),
          dataIndex: 'unitName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.department.group'),
          dataIndex: 'unitGroupName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        // 责任中心
        {
          title: messages('common.responsibility.center'),
          dataIndex: 'responsibilityCenterName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        // 责任中心组
        {
          title: messages('common.responsibility.center.group'),
          dataIndex: 'responsibilityCenterGroupName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.user'),
          dataIndex: 'employeeName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.user.group'),
          dataIndex: 'employeeGroupName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.budget.item.type'),
          dataIndex: 'itemTypeName',
          width: '15%',
          align: 'left',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
        {
          title: messages('common.budget.item.group'),
          dataIndex: 'itemGroupName',
          align: 'left',
          width: '10%',
          render: (record) => <Popover content={record}>{record}</Popover>,
        },
      ],
      amountColumns: [
        {
          title: messages('common.currency'),
          width: '8%',
          dataIndex: 'currency',
          align: 'left',
        },
        {
          title: messages('common.budget.amt'),
          dataIndex: 'bgtAmount',
          align: 'right',
          width: '8%',
          render: (bgtAmount) => (
            <Popover content={this.filterMoney(bgtAmount)}>
              {this.filterMoney(bgtAmount)}
            </Popover>
          ),
        },
        {
          title: messages('common.budget.rsv'),
          dataIndex: 'expReserveAmount',
          align: 'right',
          width: '8%',
          render: (expReserveAmount) => (
            <Popover content={this.filterMoney(expReserveAmount)}>
              {this.filterMoney(expReserveAmount)}
            </Popover>
          ),
        },
        {
          title: messages('common.budget.usd'),
          dataIndex: 'expUsedAmount',
          align: 'right',
          width: '8%',
          render: (expUsedAmount) => (
            <Popover content={this.filterMoney(expUsedAmount)}>
              {this.filterMoney(expUsedAmount)}
            </Popover>
          ),
        },
        {
          title: messages('common.budget.avb'),
          dataIndex: 'expAvailableAmount',
          align: 'right',
          width: '8%',
          render: (expAvailableAmount) => (
            <Popover content={this.filterMoney(expAvailableAmount)}>
              {this.filterMoney(expAvailableAmount)}
            </Popover>
          ),
        },
        {
          title: messages('common.budget.schedule'),
          dataIndex: 'schedule',
          align: 'right',
          width: '8%',
        },
      ],
      ruleList: [],
      currentRuleId: undefined,
    };
  }

  componentWillMount() {
    const { baseParams } = this.props;
    httpFetch
      .get(
        `${config.budgetUrl}/api/budget/reserves/all/related/control/rule/query`,
        { ...baseParams },
      )
      .then((res) => {
        this.setState({
          ruleList: res.data,
          currentRuleId: (res.data && res.data[0].id) || '',
        });
      });
  }

  /**
   * 筛选表格数据
   */
  filterData = (data) => {
    if (data) {
      const dimensionColumnsTemp = [];
      const dimensionItemGroupFieldMapTemp = [];

      if (data.dimensionFiledMap) {
        const { dimensionFiledMap } = data;
        Object.keys(dimensionFiledMap).forEach((dimensionIndex) => {
          dimensionColumnsTemp.push({
            title: dimensionFiledMap[dimensionIndex],
            dataIndex: `dimension${dimensionIndex}Name`,
            index: dimensionIndex,
            width: '8%',
            render: (record) => <Popover content={record}>{record}</Popover>,
          });
        });
      }
      if (data.dimensionItemGroupFieldMap) {
        const { dimensionItemGroupFieldMap } = data;
        Object.keys(dimensionItemGroupFieldMap).forEach((dimensionIndex) => {
          dimensionItemGroupFieldMapTemp.push({
            title: dimensionItemGroupFieldMap[dimensionIndex],
            dataIndex: `dimension${dimensionIndex}ItemGroupName`,
            index: dimensionIndex,
            width: '8%',
            render: (record) => <Popover content={record}>{record}</Popover>,
          });
        });
      }
      this.setState(
        {
          dimensionColumns: dimensionColumnsTemp,
          dimensionItemGroupColumns: dimensionItemGroupFieldMapTemp,
        },
        () => {
          const {
            dimensionItemGroupColumns,
            dimensionColumns,
            columns,
            amountColumns,
          } = this.state;
          const tempColumns = this.filterColumnsDataIndex(
            columns,
            data.queryResultList,
          );
          const cloneDeepAmountColumns = cloneDeep(amountColumns);
          const usedColumns = cloneDeep(tempColumns)
            .concat(dimensionColumns)
            .concat(dimensionItemGroupColumns)
            .concat(cloneDeepAmountColumns);
          this.setState({ usedColumns });
        },
      );
    }

    return data.queryResultList;
  };

  /**
   * 根据返回的列表结果集过滤不存在值的字段，从而动态重渲染columns
   */
  filterColumnsDataIndex = (columns, lineData) => {
    if (lineData && lineData.length > 0) {
      const data = lineData[0];
      return columns.filter(
        (item) => item.dataIndex === 'controlLevel' || data[item.dataIndex],
      );
    }
    return [];
  };

  onTabChange = (tabType) => {
    this.setState(
      {
        currentRuleId: tabType,
      },
      () => {
        this.table.search();
      },
    );
  };

  render() {
    const {
      scrollx,
      usedColumns,
      dimensionColumns,
      dimensionItemGroupColumns,
      ruleList,
      currentRuleId,
    } = this.state;
    const { baseParams, visible, onCancel } = this.props;

    return (
      <Modal
        title={messages('common.budget.progress.info') /** 预算进度信息 */}
        width={1000}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        bodyStyle={{ padding: '4px 24px 24px' }}
      >
        {ruleList.length > 0 && (
          <Tabs
            defaultActiveKey={ruleList[0].id}
            className="tabs-background-wrap"
            onChange={this.onTabChange}
          >
            {ruleList.map((o) => {
              return (
                <TabPane key={o.id} tab={o.controlRuleName}>
                  <CustomTable
                    columns={usedColumns}
                    ref={(ref) => {
                      this.table = ref;
                    }}
                    url={`${config.budgetUrl}/api/budget/reserves/budget/progress/query`}
                    params={{ ...baseParams, controlRuleId: currentRuleId }}
                    scroll={{
                      x: `${
                        scrollx +
                        dimensionColumns.length * 10 +
                        dimensionItemGroupColumns.length * 10
                      }%`,
                    }}
                    filterData={this.filterData}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </Modal>
    );
  }
}

export default BudgetProgressDetail;
