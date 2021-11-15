import React, { Component } from 'react';
import { Button, Modal, Divider, message, Popconfirm, Popover } from 'antd';
import Table from '../table';
import httpFetch from 'share/httpFetch';
import ExcelExporter from '../../other/excel-export';
import CommonImporter from '../../other/common-import';
import FileSaver from 'file-saver';
import moment from 'moment';
import WrappedForm from '../../wrapped-form';
import _ from 'lodash';
import TableFormItem from './table-form-item';
import HoverOperation from './extra/hover-operation';
import { validation } from './utils';
import ErrorTooltip from './error-tooltip';
import SaveSvg from './images/save';
import CancelSvg from './images/cancel';
import { messages } from '../../utils';

import './index.less';

class EditTable extends Component {
  static defaultProps = {
    createButtonText: 'base.establish',
    hideButton: false,
    rowKey: 'id',
    addOrder: 'front',
    renderOption: null,
    editWithCellFlag: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          messages('common.show.total', {
            params: {
              range0: `${range[0]}`,
              range1: `${range[1]}`,
              total,
            },
          }),
        pageSizeOptions: ['5', '10', '20', '50', '100', '200', '500'],
        ...props.pagination,
      },
      addKeys: [],
      changeKeys: [],
      loading: false,
      selectOptions: [],
      attrs: {},
      editRows: {},
      excelVisible: false,
      importerVisible: false,
      optionColumn: {
        title: messages('common.operation' /* 操作 */),
        dataIndex: 'id',
        width: 120,
        align: 'center',
        ...(props.optionAttr && props.optionAttr),
        render: (value, record, index) => {
          const { onDisabledEdit, onDisabledDelete, customHide } = this.props;
          let disabledEdit = false;
          let disabledDelete = false;
          const hideDelete = !!(customHide && customHide === 'delete');
          const hideEdit = !!(customHide && customHide === 'edit');

          if (onDisabledEdit) {
            disabledEdit = onDisabledEdit(value, record, index);
          }

          if (onDisabledDelete) {
            disabledDelete = onDisabledDelete(value, record, index);
          }

          return ['NEW', 'EDIT'].includes(record._status) ? (
            <span>
              {/* 确定 */}
              <a
                onClick={() => {
                  this.okRowHandle(record, index);
                }}
              >
                {messages('common.ok')}
              </a>
              <Divider type="vertical" />
              {/* 取消 */}
              <a
                onClick={() => {
                  this.cancleRowHandle(value, record, index);
                }}
              >
                {messages('common.cancel')}
              </a>
            </span>
          ) : (
            <span>
              {/* 编辑 */}
              {hideEdit ? null : (
                <a
                  disabled={disabledEdit}
                  onClick={() => {
                    this.editRowHandle(value, record, index);
                  }}
                >
                  {messages('common.edit')}
                </a>
              )}
              {!hideEdit && !hideDelete ? <Divider type="vertical" /> : null}
              {hideDelete ? null : (
                <Popconfirm
                  title={messages('common.delete.warning')} /** 确认删除？ */
                  okText={messages('common.ok')} /** 确认 */
                  cancelText={messages('common.cancel')} /** 取消 */
                  onConfirm={() =>
                    this.deleteRowHandle(record[props.rowKey], record, index)
                  }
                >
                  {/* 删除 */}
                  <a disabled={disabledDelete}>{messages('common.delete')}</a>
                </Popconfirm>
              )}
            </span>
          );
        },
      },
      selectedRowKeys: [],
      newRecord: null,
      editRecords: [],
      bodyParamsState: {},
      cellStatusMap: {},
      selectedRows: [],
    };
    this.id = -1;
    this.errorMap = {};
    this._dataSource = [];
    this.originDataSource = [];
  }

  componentDidMount() {
    this.initColumns(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    const { columns, hiddenOption } = this.props;
    if (
      columns !== nextProps.columns ||
      nextProps.hiddenOption !== hiddenOption
    ) {
      this.initColumns(nextProps);
    }
  }

  disableEditWhenInLine = (record) => {
    const { operationMap } = this.props;
    if (operationMap?.edit) {
      if (operationMap?.edit?.disabled) {
        return typeof operationMap.edit.disabled === 'function'
          ? operationMap.edit.disabled(record)
          : operationMap.edit.disabled;
      } else return false;
    }
  };

  /**
   * 初始化表格列，根据外界配置column props 重设column
   * @param {object} props
   * @returns array
   */
  initEveryTableColumn = (props) => {
    const { columns, rowKey } = props;
    const { addKeys } = this.state;

    const nextColumns = columns.map((column) => {
      column.rules = column.rules || [
        {
          required: column.required,
          message: messages('common.no.empty', {
            params: { name: column.title },
          }), // `${column.title}不能为空`,
          ...(column.whitespace
            ? { whitespace: column?.whitespace }
            : column.required &&
              (column.type === 'language' || column.type === 'input')
            ? { whitespace: true }
            : {}),
          ...(column.type === 'language'
            ? { transform: (val) => val?.value }
            : {}),
        },
      ];

      return {
        ...column,
        ellipsis: true,
        title: this.renderTitle(column),
        align: column.type === 'amount' ? 'right' : column.align,
        render: (value, record, index) => {
          // 设定一个 disabled 用于判断
          let disabled = false;
          // 判断 column 的 disabled 值,同时需要判断当前行是否是整行禁用编辑
          if (
            !this.disableEditWhenInLine(record) ||
            ['NEW'].includes(record._status)
          ) {
            // 如果行不是新建的，并且行编辑没有禁用则考虑column中的disabled
            if (column.disabled) {
              if (typeof column.disabled === 'function') {
                const result = column.disabled(record);
                disabled = result;
              } else if (typeof column.disabled === 'boolean') {
                const { disabled: columnDisabled } = column;
                disabled = columnDisabled;
              }
            }
          } else disabled = true; // 如果行编辑禁用了，则直接设置每个单元格都被禁用
          // 开放 renderNormalCell方法，renderEditCell方法，分别渲染文本状态及 编辑状态下,用于兼容外界自定义复杂逻辑的表单时
          let result;
          if (column.render) {
            result = column.render(
              value,
              record,
              index,
              addKeys.indexOf(record[rowKey]) >= 0,
            );
          } else if (column.renderNormalCell && column.renderEditCell) {
            result = undefined;
          } else
            result = this.renderCell(column, value, record, index, disabled);

          const { cellStatusMap } = this.state;
          const isCustomProps = result?.props && result?.children;
          if (
            !['NEW', 'EDIT'].includes(record._status) &&
            column.tooltips &&
            !cellStatusMap[`${record[rowKey]}|${column.dataIndex}`]
          ) {
            return {
              children: (
                <Popover
                  content={result}
                  getPopupContainer={(node) => node.parentNode}
                  overlayStyle={{ maxWidth: 500, wordWrap: 'break-word' }}
                >
                  <div>{isCustomProps ? result.children : result}</div>
                </Popover>
              ),
              props: {
                // 在 props 给 column 传属性
                ...(isCustomProps ? result.props : {}),
                className: disabled ? '' : 'no-disabled',
              },
            };
          } else {
            let cellRenderResult;
            if (isCustomProps) {
              cellRenderResult = result.children;
            } else if (column.isCusRenderFormItem) {
              // 当外界自定义render或表单不打算封装到可编辑表格组件中时，提供两个渲染方法替代 render函数，分别渲染普通状态和编辑状态
              // 且提供切换单元格编辑状态与 单元格数据保存的方法以便外界通过ref实例调用，具体方法： onAfterBlur, onChangeTdStatus
              if (
                cellStatusMap[`${record[rowKey]}|${column.dataIndex}`] ||
                ['NEW', 'EDIT'].includes(record._status)
              ) {
                cellRenderResult = column.renderEditCell(
                  value,
                  record,
                  index,
                  addKeys.indexOf(record[rowKey]) >= 0,
                );
              } else
                cellRenderResult = column.renderNormalCell(
                  value,
                  record,
                  index,
                  addKeys.indexOf(record[rowKey]) >= 0,
                );
            } else cellRenderResult = result;
            return {
              children: cellRenderResult,
              props: {
                // 在 props 给 column 传属性
                ...(isCustomProps ? result.props : {}),
                className: disabled ? '' : 'no-disabled',
              },
            };
          }
        },
        shouldCellUpdate: () => true,
        hasCustomRender: !!column.render || !!column.renderNormalCell, // 内部增加属性判断外界是否有自定义render
      };
    });
    return nextColumns;
  };

  // 渲染表格头
  renderTitle = (column) => {
    return column.required ? (
      <span>
        <span style={{ color: '#ff4d4f', paddingRight: 4 }}>*</span>
        <span>{column.title}</span>
      </span>
    ) : (
      <span>{column.title}</span>
    );
  };

  /**
   * 维护临时_dataSource列表，获取renderCell时，通过valueMap等外界干涉得到的最新值
   * @param {number} index dataSource下标，确定行
   * @param {string} col column.dataIndex 确定列
   * @param {any} value 当前单元格数据
   * @param {object} record 行数据
   */
  setLatestDataListWhenRenderCell = (index, col, value, record) => {
    const { rowKey } = this.props;
    // 这里会有个问题 versionNumber跟不上
    if (
      this._dataSource[index] &&
      this._dataSource[index].constructor === Object
    ) {
      this._dataSource[index][col] = value;
      // 确保onRowSave的时候，如果外界自定义了行保存方法且没有回传index的情况下，需要实时更新rowKey方便find
      this._dataSource[index][rowKey] = record[rowKey];
    } else {
      // 仅在初始化时会走一次
      this._dataSource[index] = {
        ...record,
        [col]: value,
      };
    }
  };

  // 渲染表格单元格内容
  renderCell = (column, value, record, index, disabled) => {
    const options = {
      initialValue: record[column.dataIndex],
    };
    const { rowKey } = this.props;
    const latestAttr = this.getLatestCellAttr(column, record[rowKey]);

    if (latestAttr.valueMapKey) {
      options.initialValue = record[latestAttr.valueMapKey]
        ? {
            value: record[latestAttr.valueMapKey],
            label: record[latestAttr.valueMapLabel],
          }
        : undefined;
    } else if (latestAttr.valueMap) {
      const { attrs } = this.state;
      const attr = attrs[`${record[rowKey]}|${column.dataIndex}`];
      const type = (attr && attr.type) || column.type;
      let flag =
        ['select', 'lov'].includes(type) &&
        (value?.constructor === Object || Array.isArray(value));
      flag = latestAttr.inverseValueMap ? false : flag;
      /**
       * getList之后将数据组装成组件能接受的类型，但修改时，如果是下拉框会回抛对象，
       * 此时仍触发当前函数，如果仍然执行columns.valueMap，则会导致数据错误
       * 这是历史遗留问题，
       * TODO:解决方案：
       * 给出一个反映射的方法，在onChange那里执行，但这样就需要外界修改一下代码
       * 这边加flag判断临时处理，等后续统一修改后可以删除这段逻辑
       */

      // 如果 value 不为 undefined 或 null，才去执行 valueMap
      const valueMapData =
        value === undefined || value === null
          ? undefined
          : latestAttr.valueMap(record);
      options.initialValue = flag ? value : valueMapData;
    } else if (![null, undefined, ''].includes(record[column.dataIndex])) {
      if (latestAttr.type === 'select' && column.options) {
        const val = record[column.dataIndex];
        const row = (column.options || []).find(
          (o) => o[latestAttr.valueKey] === val,
        );
        options.initialValue = row
          ? { key: row[latestAttr.valueKey], label: row[latestAttr.labelKey] }
          : undefined;
      } else if (latestAttr.type === 'selectPartLoad') {
        if (!record[latestAttr.valueKey]) {
          options.initialValue = undefined;
        } else if (record[latestAttr.valueKey].constructor === Object) {
          options.initialValue = record[latestAttr.valueKey];
        } else {
          options.initialValue = {
            key: record[latestAttr.valueKey],
            label: record[latestAttr.labelKey],
          };
        }
      } else if (latestAttr.type === 'language') {
        options.initialValue = record[column.dataIndex]
          ? record[column.dataIndex].constructor === Object
            ? record[column.dataIndex]
            : {
                value: record[column.dataIndex],
                i18n: record.i18n && record.i18n[column.dataIndex],
              }
          : undefined;
      }
    }
    if (record._status === 'NEW' && column.initialValue) {
      options.initialValue = column.initialValue;
    }
    const formValue = options.initialValue ?? value;
    const errorMsg = this.errorMap?.[record[rowKey]]?.[column.dataIndex];

    this.setLatestDataListWhenRenderCell(
      index,
      column.dataIndex,
      formValue,
      record,
    );
    return (
      <ErrorTooltip info={errorMsg}>
        <div
          className={
            errorMsg
              ? 'ant-form-item-has-error custom-td-style'
              : 'custom-td-style'
          }
        >
          {this.renderFormItem(column, formValue, record, index, disabled)}
        </div>
      </ErrorTooltip>
    );
  };

  getLatestCellAttr = (column, rowKey) => {
    const { attrs } = this.state;
    const attr = attrs[`${rowKey}|${column.dataIndex}`];
    const {
      valueMap = column.valueMap,
      inverseValueMap = column.inverseValueMap,
      type = column.type,
      valueMapKey = column.valueMapKey,
      valueMapLabel = column.valueMapLabel,
      valueKey = column.valueKey,
      labelKey = column.labelKey,
    } = attr || {};
    return {
      valueMap,
      inverseValueMap,
      type,
      valueMapKey,
      valueMapLabel,
      valueKey,
      labelKey,
    };
  };

  // 渲染表单元素
  renderFormItem = (column, value, record, index, disabled) => {
    const { attrs, cellStatusMap } = this.state;
    const { rowKey, editWithCellFlag, onEditRowData } = this.props;
    return (
      <TableFormItem
        onSelectDataLoaded={this.onSelectDataLoaded}
        onChange={(values, option, options) =>
          this.valueChange(column, values, record, index, record[rowKey], {
            record: option,
            dataSource: options,
          })
        }
        column={column}
        disabled={disabled}
        attr={attrs[`${record[rowKey]}|${column.dataIndex}`]}
        record={record}
        index={index}
        onClickCell={(cellKey) => {
          if (onEditRowData) {
            const formData = this.tableDataToFormData(
              this._dataSource?.[index] || {},
            );
            onEditRowData(value, record, index, formData);
          }
          // 如果 column 里配置了 isEditRow 属性，点击单元格 会触发行编辑, 没配置则触发 单元格编辑
          column.isEditRow
            ? this.editRowHandle(record[rowKey], record, index)
            : this.changeCellStatus(cellKey, column, record);
        }}
        // afterBlur={(values, cellKey) => {
        //   if (record._status === "NEW" || record._status === "EDIT") return;
        //   if (this.errorMap?.[record[rowKey]]?.[column.dataIndex]) return;
        //   this.afterCellBlur(
        //     values,
        //     cellKey,
        //     { column, record, index, id: record[rowKey] },
        //   )
        // }}
        afterBlur={(values) => {
          this.onAfterBlur(
            values,
            record[rowKey],
            column.dataIndex,
            record,
            index,
          );
        }}
        cellStatusMap={cellStatusMap}
        cellKey={`${record[rowKey]}|${column.dataIndex}`}
        editWithCellFlag={editWithCellFlag}
        value={value}
      />
    );
  };

  /**
   * 单元格编辑下渲染 行普通状态下的操作栏
   * @param {*} columns
   */
  appendOperationCol = (columns) => {
    const { operationMap, hideEdit, hideDelete, hideEditMore } = this.props;
    columns.unshift({
      title: '',
      dataIndex: 'id',
      width: 30,
      align: 'center',
      render: (value, record, index) => {
        const { rowKey } = this.props;
        return (
          <HoverOperation
            value={value}
            record={record}
            index={index}
            onEdit={this.editRowHandle}
            onDelete={() => this.deleteRowHandle(record[rowKey], record, index)}
            operationMap={operationMap}
            hideEdit={hideEdit}
            hideDelete={hideDelete}
            onCopy={this.handleCopy}
            hideEditMore={hideEditMore}
            rowKey={rowKey}
          />
        );
      },
    });
  };

  /**
   * 单元格编辑下渲染 行编辑状态下的操作栏
   * @param {*} columns
   */
  appendOperationColWhenEditing = (columns) => {
    columns.push({
      title: '',
      dataIndex: 'icon',
      className: 'operation-group-box',
      width: 10,
      align: 'center',
      fixed: 'right',
      render: (value, record, index) =>
        ['NEW', 'EDIT'].includes(record._status) && (
          <div className="cell-outer-box expand-cell">
            <div className="cell-inner-box" style={{ marginLeft: 30 }}>
              <span style={{ display: 'inline' }}>
                {/* 确定 */}
                <SaveSvg
                  onClick={() => {
                    this.okRowHandle(record, index);
                  }}
                />
                {/* 取消 */}
                <CancelSvg
                  onClick={() => {
                    this.cancleRowHandle(value, record, index);
                  }}
                  style={{ marginLeft: 12, marginRight: 12 }}
                />
              </span>
            </div>
          </div>
        ),
    });
  };

  /**
   * 设定当前行操作栏的展开与收缩
   * @param {number} index dataSource下标
   */
  handleExpand = (index, flag) => {
    const { dataSource } = this.state;
    dataSource[index]._expand = flag ?? !dataSource[index]._expand;
    this.setState({ dataSource: [...dataSource] });
  };

  /**
   * 添加列维：序列号
   * @param {*} columns
   * @param {*} props
   */
  appendNumberCol = (columns, props) => {
    const { serialNumberAttr } = props;
    columns.unshift({
      title: messages('common.sequence'),
      dataIndex: 'sort',
      width: 90,
      align: 'center',
      ...serialNumberAttr,
      render: (value, record, index) => {
        const { pagination } = this.state;
        return (
          <span>
            {(pagination.current - 1) * pagination.pageSize + index + 1}
          </span>
        );
      },
    });
  };

  /**
   * 格式化所有的表格列表项
   * @param {*} props
   * @param {boolean} flag true则调用接口，获取列表数据
   */
  initColumns = (props, flag) => {
    const { optionColumn } = this.state;
    const {
      showNumber,
      hiddenOption,
      renderOption,
      defaultGetList = true,
      editWithCellFlag,
    } = props;
    const nextColumns = this.initEveryTableColumn(props);
    if (showNumber) {
      this.appendNumberCol(nextColumns, props);
    }
    // 入参引用类型，可以直接unshift，push等操作，如果改为拷贝，则需要对下面append方法做出修改
    if (editWithCellFlag) {
      this.appendOperationCol(nextColumns);
      if (!hiddenOption) this.appendOperationColWhenEditing(nextColumns);
    }
    if (!editWithCellFlag) {
      if (renderOption) {
        nextColumns.push({
          ...renderOption,
          title: renderOption.title,
          dataIndex: renderOption.dataIndex,
          render: (value, record, index) => {
            if (['NEW', 'EDIT'].includes(record._status)) {
              return renderOption.editRender(value, record, index);
            } else {
              return renderOption.normalRender(value, record, index);
            }
          },
        });
      } else if (!hiddenOption) {
        nextColumns.push(optionColumn);
      }
    }
    this.setState({ columns: nextColumns }, () => {
      if (defaultGetList && flag) {
        this.getList();
      }
    });
  };

  /**
   * 设置请求的参数
   * @returns
   */
  getInterfaceParams = () => {
    const { params: paramsFromProps } = this.props;
    const {
      pagination: { pageSize, current },
      params,
      bodyParamsState,
    } = this.state;
    let requestBody = [];
    const searchParams = {
      page: current - 1,
      size: pageSize,
      ...paramsFromProps,
      ...params,
    };
    const { methodType, bodyParams, paramAsBody = true } = this.props;
    // 增加数组对象判断
    if (bodyParams && Array.isArray(bodyParams) && bodyParams.length !== 0) {
      requestBody = methodType === 'post' ? bodyParams : searchParams;
    } else {
      requestBody =
        methodType === 'post'
          ? {
              ...bodyParams,
              ...bodyParamsState,
              ...(paramAsBody ? searchParams : {}),
            }
          : searchParams;
    }

    return {
      body: requestBody, // get请求下，body就是query
      query: searchParams,
    };
  };

  // 获取数据
  getList = (cbUrl, callback) => {
    const { url: urlFromProps, onFilterData, onLoadData } = this.props;
    const { pagination: paginationFromState } = this.state;
    if (!urlFromProps) return;
    this.setState({ loading: true });

    const { dataKey, rowKey, methodType } = this.props;
    const { body, query } = this.getInterfaceParams();
    const url = cbUrl || urlFromProps;
    httpFetch[methodType || 'get'](url, body, null, null, query)
      .then((res) => {
        const pagination = {
          ...paginationFromState,
          total: Number(res.headers['x-total-count']) || 0,
        };
        let data = dataKey
          ? typeof dataKey === 'string'
            ? res.data[dataKey]
            : res.data.dataKey
          : res.data;

        if (onFilterData) {
          data = onFilterData(data);
        }
        const { newRecord, editRecords } = this.state;
        if (newRecord) {
          data.unshift(newRecord);
        }

        if (editRecords && !!editRecords.length) {
          editRecords.forEach((item) => {
            const index = data.findIndex((o) => o[rowKey] === item[rowKey]);
            if (~index) {
              data[index] = item;
            }
          });
        }
        // 清空临时副本，确保每次renderCell初始化 _dataSource的值没有问题
        this._dataSource.length = [];
        this.originDataSource = _.cloneDeep(data);
        this.setState(
          {
            dataSource: data,
            loading: false,
            pagination,
            newRecord: null,
            editRecords: [],
            cellStatusMap: {},
          },
          () => {
            if (onLoadData) onLoadData(res, pagination);
            if (callback) callback();
          },
        );
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  // 搜索 ,flag是否需要留在当前页
  search = (params = {}, flag = false, bodyParamsState) => {
    const { pagination, dataSource } = this.state;
    const { total, pageSize, current } = pagination;
    pagination.current = flag ? current : 1;
    if (dataSource.some((o) => ['EDIT', 'NEW'].includes(o._status))) {
      Modal.confirm({
        title: messages('common.info'),
        content: messages(
          'common.table.search.warning',
        ) /** 您当前有未保存的更改，如果执行搜索，数据将会重置。 */,
        okText: messages('common.ok'),
        cancelText: messages('common.cancel'),
        onOk: () => {
          if (flag) {
            const isLast =
              current > 1 &&
              total % pageSize === 1 &&
              Math.ceil(total / pageSize) === current;
            if (dataSource.some((o) => o._status === 'NEW') && isLast) {
              pagination.current -= 1;
            }
          }
          this.setState(
            {
              pagination: { ...pagination },
              addKeys: [],
              changeKeys: [],
              params,
              bodyParamsState,
            },
            this.getList,
          );
        },
      });
    } else {
      this.setState(
        {
          pagination: { ...pagination },
          addKeys: [],
          changeKeys: [],
          params,
          bodyParamsState,
        },
        this.getList,
      );
    }
  };

  /**
   * 分页、排序、筛选变化时触发
   */
  onTableChange = (pagination) => {
    const { dataSource, pagination: paginationFromState } = this.state;
    if (dataSource.some((o) => ['EDIT', 'NEW'].includes(o._status))) {
      Modal.confirm({
        title: messages('common.info'),
        content: messages('common.table.save.warning'),
        okText: messages('common.ok'),
        cancelText: messages('common.cancel'),
        onOk: () => {
          const { total, pageSize, current } = pagination;
          const isLast =
            current > 1 &&
            total % pageSize === 1 &&
            Math.ceil(total / pageSize) === current;
          if (dataSource.some((o) => o._status === 'NEW') && isLast) {
            pagination.current -= 1;
          }
          this.setState(
            {
              pagination: { ...paginationFromState, ...pagination },
              addKeys: [],
              changeKeys: [],
            },
            this.getList,
          );
        },
      });
    } else {
      this.setState(
        {
          pagination: { ...paginationFromState, ...pagination },
          addKeys: [],
          changeKeys: [],
        },
        this.getList,
      );
    }
  };

  // 刷新数据
  reloadData = () => {
    const { pagination } = this.state;
    pagination.current = 1;
    pagination.pageSize = 10;
    this.setState(
      {
        pagination,
        addKeys: [],
        changeKeys: [],
      },
      this.getList,
    );
  };

  // 表格数据转成表单数据
  tableDataToFormData = (tableData) => {
    const { columns } = this.state;
    const result = { id: tableData.id };
    columns.forEach((item) => {
      if (item.valueMapKey) {
        result[item.dataIndex] = {
          value: tableData[item.valueMapKey],
          label: tableData[item.valueMapLabel],
        };
      } else if (item.valueMap) {
        result[item.dataIndex] = item.valueMap(tableData);
      } else if (item.type === 'select' && item.options) {
        const value = tableData[item.dataIndex];
        if (value === undefined || value === null) {
          result[item.dataIndex] = null;
        } else if (value && value.constructor === Object) {
          result[item.dataIndex] = value;
        } else {
          const record = (item.options || []).find(
            (o) => o[item.valueKey] === value,
          );
          result[item.dataIndex] = record
            ? { key: record[item.valueKey], label: record[item.labelKey] }
            : undefined;
        }
      } else if (item.type === 'selectPartLoad') {
        result[item.dataIndex] = tableData[item.valueKey]
          ? { key: tableData[item.valueKey], label: tableData[item.labelKey] }
          : undefined;
      } else if (item.type === 'language') {
        result[item.dataIndex] = tableData[item.dataIndex]
          ? {
              value: tableData[item.dataIndex],
              i18n: tableData.i18n && tableData.i18n[item.dataIndex],
            }
          : undefined;
      } else {
        result[item.dataIndex] = tableData[item.dataIndex];
      }
    });
    return result;
  };

  /**
   * 切换到行编辑状态
   * 1. 备份修改前的行数据；
   * 2. 为当前行数据设置状态为 “EDIT”
   * @param {*} value
   * @param {*} record
   * @param {*} index
   */
  editRowHandle = (value, record, index) => {
    const { editRows, dataSource } = this.state;
    const { rowKey, onEditRowData } = this.props;
    // 编辑前存储当前数据，方便取消编辑时还原
    editRows[record[rowKey]] = { ...record };
    // 转换处理行数据
    // const _value = this.tableDataToFormData(record);
    dataSource[index] = { ...dataSource[index], _status: 'EDIT' };

    this.setState({ editRows, dataSource: [...dataSource] }, () => {
      if (onEditRowData) {
        const formData = this.tableDataToFormData(
          this._dataSource?.[index] || {},
        );
        onEditRowData(value, record, index, formData);
      }
    });
  };

  /**
   * 取消行编辑
   * @param {*} value
   * @param {*} record
   * @param {*} index
   */
  cancleRowHandle = (value, record, index) => {
    const { dataSource, editRows, pagination, cellStatusMap } = this.state;
    const { rowKey, cancleHandle } = this.props;

    const _dataSource = [...dataSource];

    if (record._status === 'NEW') {
      _dataSource.splice(index, 1);
      this._dataSource.splice(index, 1);
      this.originDataSource.splice(index, 1);
      pagination.total -= 1;
      pagination.pageSize = 10;
      this.setState({ dataSource: _dataSource, pagination });
      /**
       * 重构时发现之前有人写了以下代码，只处理了新建状态下，回抛dataSource
       * 本打算提出来，使得编辑状态下也执行这个函数，但担心外界使用时没有区分状态，影响原逻辑
       * 因此搁置。TODO: 正常写法理应 cancleHandle(_dataSource, record._status);
       */
      if (cancleHandle) {
        cancleHandle(_dataSource);
      }
      this.resetCurRowsError(record[rowKey]);
      this.deleteById(record[rowKey]);
    } else {
      _dataSource[index] = { ...editRows[record[rowKey]] };
      Object.keys(cellStatusMap).forEach((cellKey) => {
        if (cellKey.includes(record[rowKey])) {
          cellStatusMap[cellKey] = false;
        }
      });
      delete editRows[record[rowKey]];
      this.resetCurRowsError(record[rowKey]);
      this.setState({ dataSource: _dataSource, editRows, cellStatusMap });
    }
  };

  /**
   * 取消时，需要将当前行的错误信息删掉
   * @param {*} row
   * @param {*} col
   */
  resetCurRowsError = (row) => {
    this.errorMap[row] = {};
  };

  // 删除一行
  deleteRowHandle = (id, record, index) => {
    const { onDeleteRow } = this.props;
    this.setState({ loading: true });

    if (onDeleteRow) {
      onDeleteRow(
        id,
        (flag) => {
          this.afterDeleteLineData(flag, id);
        },
        record,
        index,
      );
    }
  };

  afterDeleteLineData = (flag, id) => {
    const { dataSource, pagination } = this.state;
    const { cancleHandle, rowKey } = this.props;
    this.setState({ loading: false });
    if (flag === 'delete') {
      // 不调接口删除
      pagination.total -= 1;
      if (
        pagination.total % pagination.pageSize === 0 &&
        pagination.current !== 1
      ) {
        pagination.current -= 1;
      }
      this.setState(
        {
          loading: false,
          pagination: { ...pagination },
        },
        () => {
          this.deleteById(id);
          const dataIndex = dataSource.findIndex((o) => o[rowKey] === id);
          const _dataIndex = this._dataSource.findIndex(
            (o) => o[rowKey] === id,
          );
          if (~dataIndex) {
            dataSource.splice(dataIndex, 1);
            this.setState({ dataSource: [...dataSource] });
          }
          if (~_dataIndex) {
            this._dataSource.splice(_dataIndex, 1);
          }
        },
      );
      return;
    }
    if (!flag) return;
    // 删除成功后执行的操作
    pagination.total -= 1;
    this.deleteById(id);
    if (
      pagination.total % pagination.pageSize === 0 &&
      pagination.current !== 1
    ) {
      this.setState(
        {
          loading: false,
          pagination: {
            ...pagination,
            current: pagination.current - 1,
          },
        },
        this.getList,
      );
    } else {
      const newRecord = dataSource.find((o) => o._status === 'NEW');
      const editRecords = dataSource.filter((o) => o._status === 'EDIT') || [];

      this.setState({ loading: false, newRecord, editRecords }, this.getList);
    }
    if (cancleHandle) {
      cancleHandle(dataSource);
    }
  };

  // 删除多余的选中行
  deleteById = (id) => {
    const { selectedRowKeys, selectedRows } = this.state;
    const { rowKey, onSelectChange } = this.props;
    const index = selectedRowKeys.findIndex((o) => id === o);
    const rowIndex = selectedRows.findIndex((row) => row[rowKey] === id);
    if (index >= 0) {
      selectedRowKeys.splice(index, 1);
      if (rowIndex >= 0) {
        selectedRows.splice(rowIndex, 1);
      }
      this.setState({ selectedRowKeys, selectedRows }, () => {
        if (onSelectChange) {
          onSelectChange(selectedRowKeys, selectedRows);
        }
      });
    }
  };

  // 创建一行
  create = (...rest) => {
    const { dataSource, pagination } = this.state;
    const flag = dataSource.some((o) => ['NEW'].includes(o._status));
    if (flag) {
      message.error(messages('common.table.new.warning'));
      return;
    }

    if (pagination.current > 1) {
      pagination.current = 1;
      this.setState({ pagination }, () => {
        this.getList('', () => {
          this.createRow(...rest);
        });
      });
    } else {
      this.createRow(...rest);
    }
  };

  // 创建一行
  createRow = (value, callback) => {
    const { dataSource, pagination, columns, addKeys } = this.state;
    const { rowKey, addOrder } = this.props;

    let data = columns.reduce(
      (pre, current) => {
        const prev = pre;
        if (current.defaultValue) {
          prev[current.dataIndex] = current.defaultValue;
        }
        return prev;
      },
      { [rowKey]: String(this.id) },
    );
    data = { ...data, ...(value || {}), _status: 'NEW' };

    if (addOrder === 'front') {
      dataSource.unshift(data);
      this._dataSource.unshift(data);
      this.originDataSource.unshift(data);
    } else if (addOrder === 'after') {
      dataSource.push(data);
      this._dataSource.push(data);
      this.originDataSource.push(data);
    }

    this.id -= 1;
    pagination.total += 1;
    addKeys.push(data[rowKey]);
    this.setState({ dataSource: [...dataSource], pagination, addKeys }, () => {
      if (callback) {
        callback(data);
      }
    });
  };

  // 下拉框数据加载回调，把下拉框的数据缓存起来
  onSelectDataLoaded = ({ dataIndex }, data) => {
    const { selectOptions } = this.state;
    this.setState({ selectOptions: { ...selectOptions, [dataIndex]: data } });
  };

  // 表单值改变
  valueChange = (column, value, record, index, row, extraData) => {
    const { changeKeys, addKeys, dataSource } = this.state;
    const { onValueChange, rowKey } = this.props;
    const lastAttr = this.getLatestCellAttr(column, record[rowKey]);
    if (lastAttr.tableValueMap) {
      const result = column.tableValueMap(column, value, record, index, row);
      if (Object.prototype.toString.call(result) === '[object String]') {
        dataSource[index][column.dataIndex] = result;
      } else {
        dataSource[index] = { ...dataSource[index], ...result };
      }
    } else if (lastAttr.inverseValueMap) {
      // 与valueMap相对应，当值发生修改时，同名字段需要处理成getList返回的数据格式
      // 如：booksId : valueMap => ({value: record.booksId, label: record.booksName});
      // inverseValueMap => ({ booksId: record.booksId.value, booksName: record.booksId.label})
      dataSource[index] = {
        ...dataSource[index],
        ...lastAttr.inverseValueMap(value, dataSource[index]),
      };
    } else if (lastAttr.valueMapKey) {
      const temp = value && value.constructor === Object ? value : {};
      dataSource[index][lastAttr.valueMapKey] = temp?.value;
      dataSource[index][lastAttr.valueMapLabel] = temp?.label;
    } else {
      dataSource[index][column.dataIndex] = value;
    }
    if (
      addKeys.indexOf(record[rowKey]) < 0 &&
      changeKeys.indexOf(record[rowKey]) < 0
    ) {
      changeKeys.push(record[rowKey]);
      this.setState({ changeKeys });
    }
    this.onValueCheckCell(column, value, record[rowKey]);

    this.setState({ dataSource: [...dataSource] }, () => {
      if (onValueChange) {
        onValueChange(
          column,
          value,
          dataSource[index],
          index,
          row,
          dataSource,
          extraData,
        );
      }
    });
  };

  changeCellStatus = (cellKey, col, record) => {
    const { cellStatusMap, editRows } = this.state;
    if (typeof col.disabled === 'function') {
      if (col.disabled({ ...record, _status: 'EDIT' })) return;
    }
    const { rowKey } = this.props;
    // 编辑前存储当前数据，方便取消编辑时还原
    editRows[record[rowKey]] = { ...record };
    cellStatusMap[cellKey] = true;
    this.setState({
      cellStatusMap: { ...cellStatusMap },
      editRows,
    });
  };

  /**
   * 方法：外界自行控制当前单元格的编辑状态，仅用于单元格编辑模式下，
   * 配置 属性 (isCusRenderFormItem: true)
   * @param {*} row record[rowKey || "id"]
   * @param {*} col column.dataIndex
   * @param {*} record 行数据
   * @param {boolean} isEdit: 是否编辑
   */
  onChangeTdStatus = (row, col, record, isEdit) => {
    const { columns, cellStatusMap } = this.state;
    const curColumn = columns.find((column) => column.dataIndex === col);
    if (curColumn) {
      // 判断当前单元格是否禁用
      if (typeof curColumn.disabled === 'function') {
        if (col.disabled({ ...record, _status: 'EDIT' })) return;
      } else if (curColumn.disabled === true) return;
      cellStatusMap[`${row}|${col}`] = isEdit;
      this.setState({
        cellStatusMap: { ...cellStatusMap },
      });
    }
  };

  /**
   * 方法： 单元格失焦后保存逻辑，同时也可由外界自定义render时配合 onChangeTdStatus 调用
   * @param {*} values 当前单元格表单组件的数据
   * @param {*} row record[rowKey]
   * @param {*} col column.dataIndex
   * @param {*} record 当前行数据
   * @returns
   */
  onAfterBlur = (values, row, col, record, index) => {
    if (record._status === 'NEW' || record._status === 'EDIT') return;
    const { rowKey } = this.props;
    const { columns } = this.state;
    const curColumn = columns.find((column) => column.dataIndex === col);

    if (this.errorMap?.[record[rowKey]]?.[curColumn.dataIndex]) return;
    this.afterCellBlur(values, `${record[rowKey]}|${curColumn.dataIndex}`, {
      column: curColumn,
      record,
      index,
      id: record[rowKey],
    });
  };

  handleCopy = (row, index) => {
    const { dataSource, pagination } = this.state;
    const flag = dataSource.some((o) => ['NEW'].includes(o._status));
    if (flag) {
      message.error(messages('common.table.new.warning'));
      return;
    }
    const { rowKey } = this.props;
    this.id -= 1;
    const rowFormData = { ...row };
    rowFormData._status = 'NEW';
    rowFormData[rowKey] = String(this.id);
    dataSource.splice(index + 1, 0, rowFormData);
    pagination.total += 1;
    pagination.pageSize += 1;
    this.setState({ dataSource: [...dataSource], pagination });
  };

  afterCellBlur = (value, cellKey, params) => {
    const { onRowSave } = this.props;
    if (onRowSave) {
      const { index, id } = params;
      let values;
      if (index >= 0) {
        values = this._dataSource[index];
      }
      const formData = this.tableDataToFormData(
        this.originDataSource?.[index] || {},
      );
      const originValue = formData?.[params.column.dataIndex];
      values = { ...values, [params.column.dataIndex]: value };
      if (moment.isMoment(value) && value.isSame(moment(originValue))) {
        this.changeStatus(cellKey, id);
        return;
      }
      // 如果输入的值 与 原始值 一样 则不触发保存函数，而直接退出可编辑状态
      if (
        JSON.stringify(value, this.valueReplace) ===
        JSON.stringify(originValue, this.valueReplace)
      ) {
        this.changeStatus(cellKey, id);
        return;
      }
      this.okRowHandle(
        { ...values, [params.column.dataIndex]: value },
        index,
        () => {
          this.changeStatus(cellKey, id);
        },
      );
    }
  };

  // 用于 JSON.stringify 来判断值是否为 ''、null、undefined, 如果是 都转为 Null
  valueReplace = (key, value) => {
    // debugger
    if (value === '' || value === undefined) {
      value = null;
    } else if (value?.constructor === Object) {
      const isNull = Object.values(value).every((item) => !item);
      if (isNull) value = null;
    }
    return value;
  };

  changeStatus = (cellKey) => {
    const { cellStatusMap } = this.state;
    cellStatusMap[cellKey] = false;
    // 失焦设置单元格状态为非编辑，且需要对值做保存
    this.setState({
      cellStatusMap: { ...cellStatusMap },
    });
  };

  // 保存
  getTableData = (callback) => {
    const { rowKey } = this.props;
    const { dataSource, addKeys, changeKeys } = this.state;

    const flag = dataSource.some((o) => ['NEW', 'EDIT'].includes(o._status));
    if (flag) {
      message.error(messages('common.table.new.warning'));
      return;
    }

    const addRows = dataSource.filter((o) => addKeys.includes(o[rowKey]));
    const changeRows = dataSource.filter((o) => changeKeys.includes(o[rowKey]));

    if (callback) callback({ addRows, changeRows, allData: dataSource });
  };

  // 设置dataSource单元格数据
  setCellValueByIndex = (index, dataIndex, value) => {
    const { dataSource } = this.state;
    dataSource[index][dataIndex] = value;
    this.setState({ dataSource: [...dataSource] });
    this._dataSource[index][dataIndex] = value;
  };

  // 设置单元格数据
  setCellValue = (row, column, value) => {
    const { rowKey } = this.props;
    const { dataSource } = this.state;
    const index = dataSource.findIndex((o) => o[rowKey] === row);
    if (~index) {
      dataSource[index][column] = value;
      this.setState({ dataSource: [...dataSource] });
    }
    const _index = this._dataSource.findIndex((_data) => _data[rowKey] === row);
    if (~_index) {
      this._dataSource[_index][column] = value;
    }
  };

  // 批量设置单元格数据
  setCellsValue = (row, columnAndValue) => {
    const { rowKey } = this.props;
    const { dataSource } = this.state;

    const index = dataSource.findIndex((o) => o[rowKey] === row);
    if (~index) {
      dataSource[index] = { ...dataSource[index], ...columnAndValue };
      this.setState({ dataSource: [...dataSource] });
    }
    const _index = this._dataSource.findIndex((_data) => _data[rowKey] === row);
    if (~_index) {
      this._dataSource[_index] = {
        ...this._dataSource[index],
        ...columnAndValue,
      };
    }
  };

  // 设置单元格属性
  setCellAttr = (row, column, attr) => {
    const { attrs } = this.state;
    this.setState({ attrs: { ...attrs, [`${row}|${column}`]: attr } });
  };

  // 批量设置单元格属性
  setCellsAttr = (row, columnAndAttr, callback) => {
    const { attrs } = this.state;
    const result = {};
    if (row && typeof row === 'object') {
      for (const currentRow in row) {
        const curRowColumnAndAttr = row[currentRow];
        for (const column in curRowColumnAndAttr) {
          result[`${currentRow}|${column}`] = curRowColumnAndAttr[column];
        }
      }
    } else {
      for (const column in columnAndAttr) {
        result[`${row}|${column}`] = columnAndAttr[column];
      }
    }
    this.setState({ attrs: { ...attrs, ...result } }, callback);
  };

  /**
   * 将外界处理的attrs与内部的合并，相同字段以外界传入为主，一般用于批量设置多行
   * @param {*} result
   * @param {*} callback
   */
  combineCellsAttr = (result, callback) => {
    const { attrs } = this.state;
    const tempAttrs = { ...attrs };

    Object.keys(result).forEach((cellAttr) => {
      if (tempAttrs[cellAttr]) {
        tempAttrs[cellAttr] = { ...tempAttrs[cellAttr], ...result[cellAttr] };
      } else tempAttrs[cellAttr] = result[cellAttr];
    });

    this.setState({ attrs: tempAttrs }, callback);
  };

  createAttrsKey = (row, column) => {
    return `${row}|${column}`;
  };

  // 设置行数据
  /**
   * @param {*} refresh : 配置为true，表示需要将当前数据更新到原始数据中，默认只有调用接口后才更新
   * @returns
   */
  setRowValue = (row, status, value, noTransform, refresh) => {
    const { dataSource } = this.state;
    const { rowKey } = this.props;
    this._dataSource = [];
    if (!value) {
      const index = dataSource.findIndex((o) => o[rowKey] === row);
      if (index >= 0) {
        dataSource[index]._status = status;
      }
      return;
    }

    const index = dataSource.findIndex((o) => o[rowKey] === row);
    if (index >= 0) {
      dataSource[index] = { ...dataSource[index], ...value, _status: status };
    }
    if (refresh) {
      const originIndex = this.originDataSource.findIndex(
        (data) => data[rowKey] === row,
      );
      if (originIndex >= 0) {
        this.originDataSource[originIndex] = {
          ...this.originDataSource[originIndex],
          ..._.cloneDeep(value),
          _status: status,
        };
      }
    }

    this.setState({ dataSource: [...dataSource] });
  };

  // 获取dataSource
  getDataSource = () => {
    const { dataSource } = this.state;
    return dataSource;
  };

  // 确认导入
  onConfirmImport = (transactionId) => {
    const { importConfig } = this.props;
    httpFetch
      .post(`${importConfig.confirmUrl}/${transactionId}`)
      .then(() => {
        this.setState({ importerVisible: false });
        this.getList();
        message.success(messages('common.import.success')); /* 导入成功 */
      })
      .catch((err) => {
        this.setState({ importerVisible: false });
        console.error(err);
      });
  };

  onOk = (exportConfig) => {
    const { searchParams: exportParams } = this.state;
    const hide = message.loading(
      messages('common.spanned.file' /* 正在生成文件.. */),
    );
    let {
      exporterConfig: { url },
    } = this.props;
    for (const searchName in exportParams) {
      if (Object.prototype.hasOwnProperty.call(exportParams, searchName)) {
        url += exportParams[searchName]
          ? `&${searchName}=${exportParams[searchName]}`
          : '';
      }
    }
    httpFetch
      .post(url, exportConfig, {}, { responseType: 'arraybuffer' })
      .then((res) => {
        const fileName =
          res.headers['content-disposition'].split('filename=')[1];
        const f = new Blob([res.data]);
        FileSaver.saveAs(f, decodeURIComponent(fileName));
        hide();
      })
      .catch(() => {
        hide();
      });
  };

  // 确定事件
  // callback 只在单元格编辑失焦时调用该方法时会存在此函数，用于将当前单元格切换成文本状态
  okRowHandle = (record, index, callback) => {
    const { rowKey, onRowSave } = this.props;
    const { pagination } = this.state;
    // const curRecordErrorInfo = this.errorMap[record[rowKey]];
    // if (curRecordErrorInfo && Object.keys(curRecordErrorInfo).length) return;

    let values;
    if (index >= 0) {
      values = this._dataSource[index];
    } else {
      values = this._dataSource.find((data) => data[rowKey] === record[rowKey]);
    }

    if (this.onValueCheckLine({ ...record, ...values })) return;

    this.setState({ loading: true });
    if (onRowSave) {
      onRowSave(
        { ...record, ...values },
        record.id > 0 ? 'EDIT' : 'NEW',
        (value) => {
          pagination.pageSize = 10;
          this.setState({ loading: false, pagination });
          if (!value) return;
          if (callback) callback();

          // 保存成功之后的操作
          this.deleteById(record[rowKey]);
          this.setRowValue(record[rowKey], 'NORMAR', value, null, true);
        },
        index,
      );
    }
  };

  onValueCheckLine = (record) => {
    const { columns } = this.state;
    const { rowKey } = this.props;
    const row = record[rowKey];
    let error = false;
    columns.forEach((col) => {
      // 避免外界自定义render且没有设置校验规则的情况，如自定义表单不需校验或
      if (col.hasCustomRender) return;
      // 如果true，校验交给外界（外界可能会自己写form，也可能该render只是渲染文本，内部识别不了）
      if ((col.type && !col.hasCustomRender) || col.rules) {
        const errorMsg = validation(col.rules, record[col.dataIndex]);
        if (errorMsg) {
          error = true;
          // 存在错误信息，需要给当前单元格设置错误的样式
          if (row in this.errorMap) {
            this.errorMap[row][col.dataIndex] = errorMsg;
          } else {
            this.errorMap[row] = {
              [col.dataIndex]: errorMsg,
            };
          }
        }
      }
    });
    this.setState({});
    return error;
  };

  onValueCheckCell = (column, value, row) => {
    const errorMsg = validation(column.rules, value);
    let errorFlag; // 用来返回给外部 判断 该单元格是否检验成功
    if (errorMsg) {
      // 存在错误信息，需要给当前单元格设置错误的样式
      if (row in this.errorMap) {
        this.errorMap[row][column.dataIndex] = errorMsg;
      } else {
        this.errorMap[row] = {
          [column.dataIndex]: errorMsg,
        };
      }
      errorFlag = true;
    } else if (this.errorMap?.[row]?.[column.dataIndex]) {
      delete this.errorMap[row][column.dataIndex];
      errorFlag = false;
    }
    return errorFlag;
  };

  validateForm = () => {
    return new Promise((resolve, reject) => {
      let flag = false;
      this._dataSource.forEach((row) => {
        flag = this.onValueCheckLine(row);
      });
      if (!flag) {
        resolve(this._dataSource);
      } else reject();
    });
  };

  setDataSource = (data) => {
    const { pagination } = this.state;
    this.setState({
      dataSource: data,
      pagination: { ...pagination, total: data.length },
    });
  };

  onSelectLineValue = (record) => {
    const { selectedRows, selectedRowKeys } = this.state;
    const { single, rowKey = 'id', onSelectChange } = this.props;

    // 单选
    if (single) {
      this.setState({
        selectedRows: [record],
        selectedRowKeys: [record[rowKey]],
      });
    } else {
      const index = selectedRowKeys.indexOf(record[rowKey]);
      if (index >= 0) {
        selectedRows.splice(index, 1);
        selectedRowKeys.splice(index, 1);
      } else {
        selectedRows.push(record);
        selectedRowKeys.push(record[rowKey]);
      }
      this.setState({ selectedRows, selectedRowKeys: [...selectedRowKeys] });
    }

    if (onSelectChange) {
      if (single) {
        onSelectChange(record.id, record);
      } else {
        onSelectChange([...selectedRowKeys], [...selectedRows]);
      }
    }
  };

  onSelectAll = (selected) => {
    const { dataSource, selectedRowKeys, selectedRows } = this.state;
    const { rowKey = 'id', onSelectChange } = this.props;
    if (selected) {
      dataSource.forEach((o) => {
        if (selectedRowKeys.indexOf(o[rowKey]) < 0) {
          selectedRowKeys.push(o[rowKey]);
          selectedRows.push(o);
        }
      });
    } else {
      dataSource.forEach((o) => {
        const index = selectedRows.findIndex(
          (item) => item[rowKey] === o[rowKey],
        );
        selectedRowKeys.splice(index, 1);
        selectedRows.splice(index, 1);
      });
    }
    this.setState({ selectedRowKeys: [...selectedRowKeys], selectedRows });

    if (onSelectChange) {
      onSelectChange([...selectedRowKeys], [...selectedRows]);
    }
  };

  /**
   * 提供方法使外界能重设勾选数据，
   * @param {Array<string>} keys
   * @param {Array<object>} rows
   */
  onResetSelectedRowKeys = (keys = [], rows = []) => {
    this.setState({ selectedRowKeys: keys, selectedRows: rows });
  };

  render() {
    const {
      columns,
      dataSource,
      pagination,
      loading,
      excelVisible,
      importerVisible,
      selectedRowKeys,
      cellStatusMap,
      editRows,
    } = this.state;
    const {
      createButtonText,
      hideButton,
      rowKey,
      disabledCreate,
      disablePaging,
      exporterConfig,
      templateCode,
      editWithCellFlag,
      allowChecked,
      rowSelection,
      single,
      onRowClick,
    } = this.props;

    const customSelection = {
      ...rowSelection,
      type: single ? 'radio' : 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelectLineValue,
      onSelectAll: this.onSelectAll,
    };

    return (
      <div
        className={
          !editWithCellFlag
            ? 'edit-table edit-table-no-cell-edit'
            : 'edit-table'
        }
      >
        {!hideButton && (
          <div>
            <Button
              style={{ marginBottom: 12 }}
              type="primary"
              onClick={() => this.create()}
              disabled={!!disabledCreate}
            >
              {messages(createButtonText)}
            </Button>
            {templateCode && (
              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                onClick={() => this.setState({ importerVisible: true })}
              >
                {messages('common.import')}
              </Button>
            )}
            {exporterConfig && (
              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                onClick={() => this.setState({ excelVisible: true })}
              >
                {messages('common.export')}
              </Button>
            )}
          </div>
        )}
        <Table
          size="small"
          rowSelection={allowChecked ? customSelection : rowSelection}
          {...this.props}
          columns={columns}
          dataSource={dataSource}
          rowKey={(record) => record[rowKey]}
          pagination={disablePaging ? false : pagination}
          loading={loading}
          onChange={this.onTableChange}
          bordered={false}
          onRow={(record) => {
            return {
              onClick: () => {
                const isEditCell = Object.values(cellStatusMap).some(
                  (item) => item,
                ); // 判断是否有单元格 在单元格编辑状态
                const isEditRows = Object.keys(editRows).length; // 判断是否有行 在行编辑状态
                // 如果处在 单元格编辑 或 行编辑状态 就阻塞 onRowClick
                if (
                  onRowClick &&
                  !isEditCell &&
                  !isEditRows &&
                  !['NEW', 'EDIT'].includes(record._status)
                )
                  onRowClick(record);
              },
            };
          }}
        />

        {/*  导出  */}
        {exporterConfig && (
          <ExcelExporter
            visible={excelVisible}
            onOk={this.onOk}
            {...exporterConfig}
            columns={exporterConfig.exportColumns || []}
            canCheckVersion={false}
            onCancel={() => this.setState({ excelVisible: false })}
          />
        )}
        {/** 导入 */}
        {templateCode && (
          <CommonImporter
            visible={importerVisible}
            templateCode={templateCode}
            onClose={() => this.setState({ importerVisible: false })}
            afterSuccess={() => this.search()}
          />
        )}
      </div>
    );
  }
}

// EditTable.propTypes = {
//   createButtonText: PropTypes.string,
//   hideButton: PropTypes.bool,
//   rowKey: PropTypes.string,
//   addOrder: PropTypes.string,
//   renderOption: PropTypes.object,
//   editWithCellFlag: PropTypes.bool,
// };

export default WrappedForm(EditTable);
