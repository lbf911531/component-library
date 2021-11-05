/**
 * 凭证表格
 */
import React, { Component } from 'react';
import { Popover } from 'antd';
import config from '@/config/config';
import moment from 'moment';
import httpFetch from '@/share/httpFetch';
import { messages } from '../../utils';
import CustomTable from '../../basic/table';

class VoucherTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: messages('common.description' /* 说明 */),
          dataIndex: 'dimension1',
          align: 'left',
          render: (value) => {
            return value;
          },
        },
        {
          title: messages('common.voucher.date' /* 凭证日期 */),
          dataIndex: 'accountingDate',
          align: 'center',
          render: (text) => {
            return (
              <Popover content={text ? moment(text).format('YYYY-MM-DD') : '-'}>
                {text ? moment(text).format('YYYY-MM-DD') : '-'}
              </Popover>
            );
          },
        },
        {
          title: messages('common.currency'), // 币种
          dataIndex: 'currencyCode',
          align: 'left',
        },
        {
          title: messages('common.original.currency.debit' /* 原币借方 */),
          dataIndex: 'enteredAmountDr',
          align: 'right',
        },
        {
          title: messages('common.original.currency.credit' /* 原币贷方 */),
          dataIndex: 'enteredAmountCr',
          align: 'right',
        },
        {
          title: messages('common.local.currency.debit' /* 本币借方 */),
          dataIndex: 'functionalAmountDr',
          align: 'right',
        },
        {
          title: messages('common.local.currency.credit' /* 本币贷方 */),
          dataIndex: 'functionalAmountCr',
          align: 'right',
        },
      ],
      scrollX: false,
      refreshColumns: undefined,
    };
  }

  componentDidMount() {
    this.getTableColumns();
  }

  componentWillReceiveProps(nextProps) {
    const {
      params: { transactionNumber },
      refresh,
    } = this.props;
    const {
      params: { transactionNumber: next },
      refresh: nextRefresh,
    } = nextProps;
    if (transactionNumber !== next || refresh !== nextRefresh) {
      this.table.reload();
    }
  }

  // 获取凭证表格的字段
  getTableColumns = () => {
    const { transactionType, columnsUrl } = this.props;
    const url =
      columnsUrl ||
      `${config.expenseUrl}/api/expense/report/query/elements/of/accounting/model`;
    httpFetch
      .get(url, { transactionType })
      .then((res) => {
        const fixed1 = [
          {
            title: messages('common.description' /* 说明 */),
            dataIndex: 'dimension1',
            align: 'left',
          },
          {
            title: messages('common.voucher.date' /* 凭证日期 */),
            dataIndex: 'accountingDate',
            align: 'center',
            render: (text) => {
              return (
                <Popover
                  content={text ? moment(text).format('YYYY-MM-DD') : '-'}
                >
                  {text ? moment(text).format('YYYY-MM-DD') : '-'}
                </Popover>
              );
            },
          },
        ];
        const fixed2 = [
          { title: messages('common.currency'), dataIndex: 'currencyCode' }, // 币种
          {
            title: messages('common.original.currency.debit' /* 原币借方 */),
            dataIndex: 'enteredAmountDr',
            align: 'right',
            render: (value) =>
              value ? (
                <Popover content={this.filterMoney(value)}>
                  {this.filterMoney(value)}
                </Popover>
              ) : (
                '-'
              ),
          },
          {
            title: messages('common.original.currency.credit' /* 原币贷方 */),
            dataIndex: 'enteredAmountCr',
            align: 'right',
            render: (value) =>
              value ? (
                <Popover content={this.filterMoney(value)}>
                  {this.filterMoney(value)}
                </Popover>
              ) : (
                '-'
              ),
          },
          {
            title: messages('common.local.currency.debit' /* 本币借方 */),
            dataIndex: 'functionalAmountDr',
            align: 'right',
            render: (value) =>
              value ? (
                <Popover content={this.filterMoney(value)}>
                  {this.filterMoney(value)}
                </Popover>
              ) : (
                '-'
              ),
          },
          {
            title: messages('common.local.currency.credit' /* 本币贷方 */),
            dataIndex: 'functionalAmountCr',
            align: 'right',
            render: (value) =>
              value ? (
                <Popover content={this.filterMoney(value)}>
                  {this.filterMoney(value)}
                </Popover>
              ) : (
                '-'
              ),
          },
        ];
        const entity = {};
        const element = {};
        const dimension = {};

        res.data.map((item) => {
          switch (item.elementCatagory) {
            case 'ACCOUNT_ENTITY':
              if (!item.enabled) {
                delete entity[item.elementCode];
              } else {
                entity[item.elementCode] = {
                  title: item.elementName,
                  dataIndex: item.elementCode,
                };
              }
              break;
            case 'ACCOUNT_ELEMENT':
              if (!item.enabled) {
                delete element[item.elementCode];
              } else {
                element[item.elementCode] = {
                  title: item.elementName,
                  dataIndex: item.elementCode,
                };
              }
              break;
            case 'DIMENSION':
              if (item.elementCode === 'dimension1') {
                fixed1[0].title = item.elementName;
              } else if (item.enabled) {
                dimension[item.elementCode] = {
                  title: item.elementName,
                  dataIndex: item.elementCode,
                };
              }
              break;
            default:
          }
          if (item.elementCode === 'accountingDate') {
            fixed1[1].title = item.elementName;
          } else if (item.elementCode === 'currencyCode') {
            fixed2[0].title = item.elementName;
          }
          return true;
        });

        let result = [
          ...fixed1,
          ...Object.values(entity),
          ...Object.values(element),
          ...fixed2,
          ...Object.values(dimension),
        ];
        result = result.map((item) => {
          return {
            ...item,
            width: '120px',
            align: item.align || 'left',
            render:
              item.render ||
              ((value) => {
                const date =
                  /^[0-9]{4}-[0-9]{2}-[0-9]{2}.*$/.test(value) &&
                  moment(value).isValid()
                    ? moment(value).format('YYYY-MM-DD')
                    : value;
                return value ? <Popover content={date}>{date}</Popover> : '-';
              }),
          };
        });
        this.setState({
          columns: result,
          scrollX: result.length * 120,
          refreshColumns: new Date(),
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 获取数据
  getList = () => {
    this.table.reload();
  };

  render() {
    const { columns, scrollX, refreshColumns } = this.state;
    const { url, params, isQuery, emptyFlag } = this.props;

    return emptyFlag && !isQuery ? (
      <CustomTable
        key="empty"
        ref={(ref) => {
          this.table = ref;
        }}
        columns={columns}
        scroll={{ x: scrollX }}
        refreshColumns={refreshColumns}
        pagination={{ pageSize: 5 }}
      />
    ) : (
      <CustomTable
        key="normal"
        ref={(ref) => {
          this.table = ref;
        }}
        columns={columns}
        url={isQuery && url}
        params={params}
        scroll={{ x: scrollX }}
        refreshColumns={refreshColumns}
        pagination={{ pageSize: 5 }}
      />
    );
  }
}

export default VoucherTable;
