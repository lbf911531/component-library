import React, { Component } from 'react';
//@ts-ignore
import httpFetch from 'share/httpFetch';
import SearchArea from '../../basic/search-area-lov';
import Table from '../../basic/table';
import { ILovProps, ILovState } from './interface';
import { messages } from '../../utils';

class Lov extends Component<ILovProps, ILovState> {
  static defaultProps = {
    extraParams: {},
    single: false,
    onSelectAll: () => {
      return;
    },
    isPage: true,
  };
  formRef: any;
  constructor(props: ILovProps) {
    super(props);
    this.state = {
      tableData: [],
      loading: false,
      page: 0,
      size: props.pagination ? props.pagination.pageSize : 10,
      pagination: {
        total: 0,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        // @ts-ignore
        showLessItems: true,
        pageSize: props.pagination ? props.pagination.pageSize : 10,
        // @ts-ignore
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
      searchParams: {},
      selectedRows: [],
      selectedRowKeys: [],
      frontPagination: {
        total: 0,
        showTotal: (total, range) =>
          messages('common.show.total', {
            params: {
              range0: `${range[0]}`,
              range1: `${range[1]}`,
              total,
            },
          }),
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
      },
      // @ts-ignore
      sorters: undefined,
    };
  }

  componentDidMount() {
    const { lov, selectedData, single, lovType } = this.props;
    let data = [];
    if (selectedData) {
      data = single && lovType === 'lov' ? [selectedData] : selectedData;
    }
    this.setState(
      {
        selectedRows: JSON.parse(JSON.stringify(data)),
        selectedRowKeys: data.map((item) =>
          lov.key && item[lov.key] ? item[lov.key] : item,
        ),
      },
      this.getList,
    );
  }

  // ????????????????????????
  filterEmptyValue = (values: any) => {
    if (values.constructor === Object) {
      const temp: any = {};
      Object.keys(values).forEach((key) => {
        if (values[key] || String(values[key]) === 'false') {
          temp[key] = values[key];
        }
      });
      return temp;
    }
    return values;
  };

  // ??????????????????
  getList = () => {
    const {
      lov: { url, key, method },
      extraParams,
      twiceSearchFlag,
      listExtraParams,
      lov,
    } = this.props;
    let { requestBody } = this.props;

    const {
      page,
      size,
      pagination: { current, pageSize },
      pagination,
      searchParams,
      selectedRows,
      selectedRowKeys,
      // @ts-ignore
      sorters,
    } = this.state;

    const finalExtraParams =
      listExtraParams && listExtraParams.constructor === Object
        ? listExtraParams
        : extraParams;

    const tempSearchParams = twiceSearchFlag
      ? this.filterEmptyValue(searchParams)
      : searchParams;
    const params = { ...finalExtraParams, ...tempSearchParams, sort: sorters };
    this.setState({ loading: true });
    if (!url || !method) {
      return;
    }

    let newUrl = url;
    const reg = /\?+/;
    let flag = false;
    // ???????????????????????????????????????????????????&
    newUrl = reg.test(newUrl)
      ? `${newUrl}&page=${(current ?? 1) - 1}&size=${pageSize}`
      : `${newUrl}?page=${(current ?? 1) - 1}&size=${pageSize}`;

    if (lov && lov.paramAsBody) {
      requestBody = { ...requestBody, ...params };
    } else if (method === 'get') {
      // get?????????params??????requestBody?????? ?????????requestBody???????????????????????????
      requestBody = params;
    } else if (
      method === 'post' &&
      params.constructor === Object &&
      Object.keys(params).length
    ) {
      flag = !!(params.constructor === Object && Object.keys(params).length);
      // post????????????????????????????????????????????????????????????flag??????true,???axios??????????????????
    }

    if (!key) return;
    httpFetch[method](newUrl, requestBody, null, null, flag ? params : {})
      .then((res: any) => {
        const isAllFlag = false;
        if (isAllFlag) {
          if (res.data) {
            res.data.forEach((o: any) => {
              if (selectedRowKeys.indexOf(o[key]) < 0) {
                selectedRowKeys.push(o[key]);
                selectedRows.push(o);
              }
            });
          }
          this.setState({
            selectedRowKeys: [...selectedRowKeys],
            selectedRows,
          });
        }
        this.setState({
          tableData: res.data || [],
          loading: false,
          pagination: {
            ...pagination,
            total: Number(res.headers['x-total-count']) || 0,
          },
        });
      })
      .catch((err: any) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  // ??????
  search = (value: any) => {
    const { pagination, searchParams } = this.state;
    const { formatParams } = this.props;
    const values = formatParams ? formatParams(value) : value;
    pagination.current = 1;
    this.setState(
      { searchParams: { ...searchParams, ...values }, page: 0, pagination },
      this.getList,
    );
  };

  // ??????????????????
  clear = () => {
    this.setState({ searchParams: {} });
  };

  // ????????????
  indexChange = (page: number, size?: number): void => {
    const { pagination } = this.state;
    pagination.current = page;
    this.setState({ page: page - 1, pagination }, this.getList);
  };

  sizeChange = (page: number, size: number): void => {
    const { pagination } = this.state;
    pagination.current = 1;
    pagination.pageSize = size;
    this.setState({ page: 0, size, pagination }, this.getList);
  };

  // table???????????????console.log(record);
  onTableClick = (record: any): void => {
    const { selectedRows, selectedRowKeys } = this.state;
    // @ts-ignore
    const { single, getCheckboxProps, disabled } = this.props;
    const {
      lov: { key },
    } = this.props;

    if (getCheckboxProps) {
      const { disabled } =
        getCheckboxProps(record, { selectedRows, selectedRowKeys }) || {};
      if (disabled) return;
    }

    // ??????
    if (!single && disabled) return;
    if (!key) return;
    // ??????
    if (single) {
      this.setState({ selectedRows: [record], selectedRowKeys: [record[key]] });
      return;
    }

    const index = selectedRowKeys.indexOf(record[key]);
    if (index >= 0) {
      selectedRows.splice(index, 1);
      selectedRowKeys.splice(index, 1);
    } else {
      selectedRows.push(record);
      selectedRowKeys.push(record[key]);
    }
    this.setState({ selectedRows, selectedRowKeys: [...selectedRowKeys] });
  };

  // ????????????
  onTagClose = (index: number) => {
    const { selectedRows, selectedRowKeys } = this.state;
    selectedRows.splice(index, 1);
    selectedRowKeys.splice(index, 1);
    this.setState({ selectedRows, selectedRowKeys: [...selectedRowKeys] });
  };

  // ??????
  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  // ??????
  onOk = () => {
    const { onOk, single, lovType } = this.props;
    const { selectedRows, type } = this.state;
    if (onOk) {
      if (single && lovType === 'lov') {
        onOk({
          result: selectedRows[0] || {},
          // @ts-ignore
          type,
        });
      } else {
        onOk({
          result: selectedRows,
          // @ts-ignore
          type,
        });
      }
    }
  };

  // ??????/????????????
  onSelectAll = (selected: boolean, rows: any[], changeRows: any[]): void => {
    const { tableData, selectedRowKeys, selectedRows } = this.state;
    const {
      lov: { key },
    } = this.props;
    if (!key) return;
    if (selected) {
      tableData.forEach((o) => {
        if (selectedRowKeys.indexOf(o[key]) < 0) {
          selectedRowKeys.push(o[key]);
          selectedRows.push(o);
        }
      });
    } else {
      tableData.forEach((o) => {
        const index = selectedRows.findIndex((item) => item[key] === o[key]);
        selectedRowKeys.splice(index, 1);
        selectedRows.splice(index, 1);
      });
    }
    this.setState({ selectedRowKeys: [...selectedRowKeys], selectedRows });

    const { onSelectAll } = this.props;
    if (onSelectAll) {
      onSelectAll(selected, selectedRows, changeRows);
    }
  };

  handleSingleRowData = (record: any) => {
    const {
      onOk,
      lov: { key },
      lovType,
      code,
    } = this.props;
    this.setState(
      {
        selectedRows: [record],
        // @ts-ignore
        selectedRowKeys: [record[key]],
      },
      () => {
        if (lovType === 'lov') {
          onOk(record || null);
        } else if (lovType === 'listSelector') {
          onOk({
            type: code || '',
            result: [record],
          });
        } else {
          // @ts-ignore
          onOk([record]);
        }
      },
    );
  };

  getDataLabel = (data: any, keys: string) => {
    let isMatch = false;
    keys = keys.replace(/\$\{(.*?)\}/g, (target, value) => {
      isMatch = true;
      return data[value] || '';
    });

    if (isMatch) {
      return keys;
    } else {
      return data[keys] || '';
    }
  };

  // @ts-ignore
  onTableChange = (pagination, filters, sorter) => {
    let sorters;
    if (sorter.field && sorter.order) {
      sorters = `${sorter.field}${sorter.order === 'ascend' ? '' : ',desc'}`;
    }
    // @ts-ignore
    this.setState({ sorters, pagination }, () => {
      this.getList();
    });
  };

  render() {
    const {
      lov: { columns = [], key = '', searchForm },
      single,
      width,
      hideRowSelect,
      onRowMouseEnter,
      onRowMouseLeave,
      isPage,
      // @ts-ignore
      getCheckboxProps,
      hideSelectAll,
      maxLength,
      disabled,
    } = this.props;

    const {
      tableData,
      loading,
      pagination,
      selectedRows,
      selectedRowKeys,
      frontPagination,
    } = this.state;

    const rowSelection: any = {
      hideSelectAll,
      type: single ? 'radio' : 'checkbox',
      selectedRowKeys,
      onSelect: this.onTableClick,
      onSelectAll: this.onSelectAll,
      getCheckboxProps:
        !single && disabled
          ? () => ({ disabled: disabled })
          : getCheckboxProps
          ? (record: any) => getCheckboxProps(record, rowSelection)
          : undefined,
    };
    const scrollX = columns.reduce(
      (pre, cur): number => pre + parseInt(String(cur.width || 200), 10),
      0,
    );

    return (
      <div>
        {searchForm && !!searchForm.length && (
          <SearchArea
            searchForm={searchForm}
            submitHandle={this.search}
            clearHandle={this.clear}
            maxLength={maxLength}
            // eslint-disable-next-line no-return-assign
            wrappedComponentRef={(inst: any) => {
              this.formRef = inst;
            }}
          />
        )}
        <div style={{ marginBottom: 12, fontSize: '12px' }}>
          {`??????${pagination.total || tableData.length}???`}
        </div>
        {columns && !!columns.length && (
          <div>
            <Table
              tableLayout="fixed"
              rowKey={(record: any) => record[key]}
              columns={columns}
              dataSource={tableData}
              loading={loading}
              size="middle"
              pagination={isPage ? pagination : frontPagination}
              rowSelection={hideRowSelect ? null : rowSelection || null}
              onRow={(record: any, index: number) => ({
                onClick: () => this.onTableClick(record),
                onDoubleClick: (e: any) => {
                  e.preventDefault();
                  if (single) {
                    this.handleSingleRowData(record);
                  }
                },
                onMouseEnter: (e: any) => {
                  if (
                    onRowMouseEnter &&
                    Object.prototype.toString.call(onRowMouseEnter) ===
                      '[object Function]'
                  ) {
                    onRowMouseEnter(record, index, e);
                  }
                },
                onMouseLeave: (e: any) => {
                  if (
                    onRowMouseLeave &&
                    Object.prototype.toString.call(onRowMouseLeave) ===
                      '[object Function]'
                  ) {
                    onRowMouseLeave(record, index, e);
                  }
                },
              })}
              scroll={{
                x: width && scrollX > width ? scrollX : false,
              }}
              onChange={this.onTableChange}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Lov;
