/* eslint-disable react/sort-comp */
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, Checkbox, Dropdown, Menu, Tree, Button } from 'antd';
import {
  MoreOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useSelections } from 'ahooks';
import httpFetch from 'share/httpFetch';
import config from 'config';
import Table from '../table';
import SettingSvg from './images/setting';
import './style.less';

/**
 * 表格行操作菜单，鼠标移入才显示
 */
export function OperateMenus(props) {
  const {
    tableProps: { operateMenus, onEditHandle, onCopyHandle, onDeleteHandle },
  } = props;

  const menus = useMemo(() => {
    if (Array.isArray(operateMenus)) {
      return operateMenus;
    } else {
      return [
        { label: '编辑', onClick: onEditHandle }, // 编辑
        { label: '复制', onClick: onCopyHandle }, // 复制
        { label: '删除', onClick: onDeleteHandle, className: 'menu-delete' }, // 删除
      ];
    }
  }, [operateMenus]);

  const handleMenuClick = (e) => {
    e.domEvent.stopPropagation();
    const operate = menus.find((menu) => e.key === menu.label);
    if (operate?.onClick) {
      const { record, index } = props;
      operate.onClick(record, index);
    }
  };

  const overlay = (
    <Menu onClick={handleMenuClick}>
      {menus.map((menu) => (
        <Menu.Item {...menu} key={menu.label}>
          {menu.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={overlay}
      overlayClassName="operate-menus-wrap"
      trigger={['click']}
      getPopupContainer={(node) => node.parentElement}
    >
      <MoreOutlined onClick={(e) => e.stopPropagation()} />
    </Dropdown>
  );
}

/**
 * 表头设置
 */

export function HeaderSettingsDropDown(props) {
  const { columns, tableColumns, onChange } = props;
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // 获取 固定在 左边和右边的选项
  // 当 columns 改变的时候 触发这个函数
  useEffect(() => {
    const left = [];
    const right = [];
    columns.forEach((col) => {
      if (col.fixed === 'left') left.push(col.dataIndex);
      else if (col.fixed === 'right') right.push(col.dataIndex);
    });
    setFixedColumns({ left, right });
  }, [columns]);

  // 获取 必选项，提前渲染出来
  const { allCols } = useMemo(() => {
    const required = [];
    const all = columns
      .filter((col) => col.title)
      .map((col) => {
        if (col.requiredFlag) required.push(col.dataIndex);
        return col.dataIndex;
      });
    return { allCols: all, requiredCols: required };
  }, [columns]);

  // 获取 选择到的 选项
  const selectedCol = useMemo(() => {
    return tableColumns.filter((col) => col.title).map((col) => col.dataIndex);
  }, [tableColumns]);

  const [popoverVisible, setPopoverVisible] = useState(false);

  const { selected, isSelected, toggle, setSelected } = useSelections(
    allCols,
    selectedCol,
  );

  const settingIconRef = useRef();

  // 请求数据
  const onSave = (data) => {
    const { headSettingKey, headerValues } = props;
    const params = {
      ...headerValues,
      settingValue: JSON.stringify(data),
      settingKey: headSettingKey,
      settingName: 'config',
      settingType: 'TABLE',
    };
    httpFetch
      .post(`${config.baseUrl}/api/user/component/setting`, params)
      .then((res) => {
        if (!window?.g_app?._store) return;
        const search = window.g_app._store.getState()?.search;
        if (search.all && search.all[headSettingKey]) {
          const tableIndex = search.all[headSettingKey].findIndex(
            (item) => item.settingType === 'TABLE',
          );
          const result = res.data?.[0];
          if (~tableIndex) search.all[headSettingKey][tableIndex] = result;
          else search.all[headSettingKey].push(result);
          const { dispatch } = window?.g_app?._store;
          if (dispatch) {
            dispatch({
              type: 'search/saveAllSearchData',
              payload: search.all,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 点击 确认后，根据 left temp right 来重排 表格列的顺序
  const onOKHandle = (e) => {
    if (e.preventDefault) e.preventDefault();
    // 重排cols顺序
    const left = [];
    const right = [];
    let temp = [];
    const { getTableColumnDataIndex } = props;
    const originColumns = getTableColumnDataIndex();
    columns.forEach((col) => {
      if (col.fixed === 'left') left.push(col);
      else if (col.fixed === 'right') right.push(col);
      else {
        const index = originColumns.findIndex(
          (dataIndex) => dataIndex === col.dataIndex,
        );
        temp[index] = col;
      }
      // else temp.push(col);
    });
    temp = temp.filter((col) => col);
    const final = left.concat(temp).concat(right);
    // 滤出勾选的数据
    const result = final.filter((col) => {
      const bool = col.requiredFlag || selected.includes(col.dataIndex);
      if (bool) {
        col.isSelected = true;
      }
      return bool;
    });
    onSave(final);
    if (onChange) {
      onChange(final, result);
    }
    onVisibleTurnFalse();
    // onClose();
  };

  // 重置 表格列
  const onResetHandle = (e) => {
    if (e.preventDefault) e.preventDefault();
    setSelected(allCols);
    setFixedColumns({ left: [], right: [] });
    const { onReset } = props;
    onReset();
  };

  // 点击 icon 图标后 ，关闭气泡窗
  // const onClose = () => {
  //   settingIconRef.current.click();
  // }

  // 控制 气泡窗 是否可见
  const onVisibleChange = (visible) => {
    setPopoverVisible(visible);
    if (visible) {
      setSelected(selectedCol);
    }
  };

  // 手动 控制 气泡窗的显示
  const onVisibleTurnFalse = () => {
    setPopoverVisible(false);
  };

  // 阻止冒泡
  const onStopClick = (e) => {
    e.stopPropagation();
  };

  // 记录了 修改后的数组
  const arrayMove = (arr, from, to) => {
    const newArr = arr.slice();
    const startIndex = to < 0 ? newArr.length + to : to;
    const item = newArr.splice(from, 1)[0];
    newArr.splice(startIndex, 0, item);
    return newArr;
  };

  // 排序后 重置表格列
  const handleResetColsAfterSort = (info) => {
    const [, oldIndex] = info.dragNode.pos.split('-');
    let [, newIndex] = info.node.pos.split('-');
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    if (oldIndex > newIndex && dropPosition >= 0) {
      newIndex = Number(newIndex) + 1;
    }
    const temp = arrayMove(columns, Number(oldIndex), Number(newIndex));
    if (onChange) {
      onChange(temp, temp);
    }
  };

  // 格式化 处理表格列
  const formatColumns = () => {
    const temp = columns.filter((col) => !col.fixed);
    const originColumns = props.getTableColumnDataIndex();
    const treeNodes = [];
    temp.forEach((col) => {
      const index = originColumns.findIndex(
        (dataIndex) => dataIndex === col.dataIndex,
      );
      col.key = col.dataIndex;
      treeNodes[index] = col;
    });
    return treeNodes.filter((col) => col);
  };

  // 固定 表格列中 选中的选项
  const handleFixColumn = (item, type) => {
    // 借用引用数据类型特性
    const anotherType = type === 'left' ? 'right' : 'left';
    item.fixed = type;
    item.ellipsis = true;
    if (Array.isArray(fixedColumns[type])) {
      fixedColumns[type].push(item.dataIndex);
    } else fixedColumns[type] = [item.dataIndex];
    const index = fixedColumns[anotherType].findIndex(
      (col) => col === item.dataIndex,
    );
    if (~index) {
      fixedColumns[anotherType].splice(index, 1);
    }
    setFixedColumns({
      [type]: fixedColumns[type],
      [anotherType]: fixedColumns[anotherType],
    });
  };

  // 取消 表格列中 被固定的选项
  const handleCancelFix = (col, type) => {
    const index = fixedColumns[type].findIndex(
      (item) => item === col.dataIndex,
    );
    if (~index) fixedColumns[type].splice(index, 1);
    col.fixed = '';
    col.ellipsis = false;
    setFixedColumns({
      ...fixedColumns,
      [type]: fixedColumns[type],
    });
  };

  // 渲染 进行列控制的节点树上的 节点
  const renderTreeNode = (item) => {
    return (
      <div key={item.dataIndex} className="checkbox-item">
        {item.requiredFlag ? ( // 必须要勾选的列
          <Checkbox disabled checked>
            {item.title}
          </Checkbox>
        ) : (
          <Checkbox
            checked={isSelected(item.dataIndex)}
            onClick={() => toggle(item.dataIndex)}
          >
            {item.title}
          </Checkbox>
        )}
        <span className="fixed-col-ico-group">
          {item.fixed === 'left' ? (
            <VerticalAlignMiddleOutlined
              title="取消固定"
              onClick={() => {
                handleCancelFix(item, 'left');
              }}
            />
          ) : (
            <VerticalAlignTopOutlined
              title="左固定"
              onClick={() => {
                handleFixColumn(item, 'left');
              }}
            />
          )}
          {item.fixed === 'right' ? (
            <VerticalAlignMiddleOutlined
              title="取消固定"
              onClick={() => {
                handleCancelFix(item, 'right');
              }}
            />
          ) : (
            <VerticalAlignBottomOutlined
              title="右固定"
              onClick={() => {
                handleFixColumn(item, 'right');
              }}
            />
          )}
        </span>
      </div>
    );
  };

  // 根据固定左右的类型 渲染 列控制节点树上的分组
  const renderFixedColsByType = (type) => {
    const fixed = columns.filter((col) => col.fixed === type);
    const text = type === 'left' ? '固定在左侧' : '固定在右侧';
    if (fixed.length) {
      return (
        <>
          <div className="col-group-title">{text}</div>
          {fixed.map((leftCol) => renderTreeNode(leftCol))}
        </>
      );
    }
  };

  // 渲染 列控制节点树
  const content = (
    <div
      onClick={onStopClick}
      style={{ maxHeight: 250, display: 'flex', flexDirection: 'column' }}
    >
      <div
        className="checkbox-wrap"
        style={{
          borderBottom: '1px solid #f0f0f0',
          overflow: 'auto',
          maxHeight: 200,
        }}
      >
        {renderFixedColsByType('left')}
        {!!(fixedColumns?.left?.length || fixedColumns?.right?.length) && (
          <div className="col-group-title">不固定</div>
        )}
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          selectable={false}
          treeData={formatColumns()}
          titleRender={renderTreeNode}
          onDrop={handleResetColsAfterSort}
          style={{ padding: '4px 0px 12px' }}
        />
        {renderFixedColsByType('right')}
      </div>
      <div
        className="table-header-footer"
        style={{ overflow: 'hidden', padding: '12px 16px' }}
      >
        <div style={{ float: 'right' }}>
          <Button size="small" onClick={onResetHandle}>
            重置
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={onOKHandle}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      overlayClassName="table-header-settings"
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
            padding: '7px 0px 8px',
          }}
        >
          <span style={{ fontWeight: 600 }}>表头集中展示设置</span>
          <CloseOutlined
            style={{ fontSize: 12, color: '#7A828D' }}
            onClick={onVisibleTurnFalse}
          />
        </div>
      }
      content={content}
      trigger={['click']}
      placement="bottomRight"
      onVisibleChange={onVisibleChange}
      visible={popoverVisible}
    >
      <SettingSvg
        onClick={onStopClick}
        className="setting-icon hover-theme-color"
        title="设置"
        ref={settingIconRef}
      />
    </Popover>
  );
}

class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tableColumns: [],
      pagination: {
        total: 0,
        showTotal: (total, range) => `显示${range[0]}-${range[1]} 共${total}条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: props.pagination ? props.pagination.pageSize || 10 : 10,
        current: 1,
        pageSizeOptions: this.$pageSizeOptions,
        ...props.pagination,
      },
      frontPagination: {
        total: 0,
        showTotal: (total, range) => `显示${range[0]}-${range[1]} 共${total}条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
      },
      loading: false,
      params: {},
      sortColumn: {
        title: '序号',
        dataIndex: 'sort',
        width: 90,
        align: 'left',
        render: (value, record, index) => {
          const {
            pagination: { current, pageSize },
          } = this.state;
          return <span>{(current - 1) * pageSize + index + 1}</span>;
        },
      },
      sorters: undefined,
      bodyParams: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
    this.headerValues = {};
  }

  componentDidMount() {
    const { columns, params = {} } = this.props;
    columns.forEach((item) => {
      if (item.fixed) {
        item.originFixed = item.fixed;
      } else {
        item.originFixed = undefined;
      }
    });
    this.getTableColumns(columns, this.props);
    this.setState({ params }, () => {
      const { defaultGetList = true } = this.props;
      if (defaultGetList) {
        this.getList();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { url, columns, refreshColumns } = this.props;
    if (nextProps.url !== url) {
      this.getList(nextProps.url);
    }
    // 表格列有变动时
    if (
      nextProps.columns !== columns ||
      nextProps.columns.length !== columns.length ||
      nextProps.refreshColumns !== refreshColumns
    ) {
      nextProps.columns.forEach((item) => {
        if (item.fixed) {
          item.originFixed = item.fixed;
        } else {
          item.originFixed = undefined;
        }
      });
      this.getTableColumns(nextProps.columns, nextProps);
    }
  }

  // 从 后端 获取 表格列
  getTableColumnsFromBackend = (props) => {
    const { headSettingKey, columns } = props || this.props;
    return new Promise((resolve) => {
      if (headSettingKey) {
        if (!window?.g_app?._store) {
          resolve({ columns, isDefault: true });
          return;
        }
        const search = window.g_app._store.getState()?.search;
        if (search.all && search.all[headSettingKey]) {
          const tableConfig = search.all[headSettingKey].find(
            (item) => item.settingType === 'TABLE',
          );
          if (tableConfig) {
            const flag = Array.isArray(tableConfig) && tableConfig.length;
            resolve({
              columns: flag ? tableConfig : columns,
              isDefault: !flag,
            });
            return;
          }
        }
        httpFetch
          .get(
            `${config.baseUrl}/api/user/component/setting/list?key=${headSettingKey}&type=TABLE`,
          )
          .then((res) => {
            if (Array.isArray(res.data)) {
              const flag = Array.isArray(res.data) && res.data[0];
              resolve({
                columns: flag ? res.data[0] : columns,
                isDefault: !flag,
              });
            } else {
              resolve({ columns, isDefault: true });
            }
          })
          .catch((err) => {
            console.log(err);
            resolve({ columns, isDefault: true });
          });
      } else {
        resolve(columns);
      }
    });
  };

  // 获取表格列
  getTableColumns = (columns, nextProps, reset) => {
    const { showNumber, headSettingKey, operateMenus } = nextProps;
    const { sortColumn } = this.state;
    (columns || []).forEach((items) => {
      const item = items;
      if (item.tooltips) {
        item.render = (value) => {
          return (
            <Popover
              content={value}
              getPopupContainer={(node) => node.parentNode}
              overlayStyle={{ maxWidth: 500, wordWrap: 'break-word' }}
            >
              <div className="over-range">{value}</div>
            </Popover>
          );
        };
      } else if (item.fixed) {
        item.ellipsis = true;
        if (item.render) {
          const tempRender = item.render;
          item.render = (values, record, index) => (
            <div className="over-range">
              {tempRender(values, record, index)}
            </div>
          );
        } else {
          item.render = (values) => <div className="over-range">{values}</div>;
        }
      }
      if (item.key && !item.dataIndex) {
        item.dataIndex = item.key;
      }
      if (item.align !== 'right') {
        item.align = 'left';
      }
    });
    let tableColumns = [...columns];
    if (showNumber) {
      tableColumns = [sortColumn, ...columns];
    }
    if (operateMenus) {
      // 操作列下拉菜单
      const fixed = tableColumns.find((col) => col.fixed === 'left')
        ? 'left'
        : undefined;
      tableColumns = [
        {
          dataIndex: 'operate-menus',
          className: 'operate-menus',
          requiredFlag: true,
          fixed,
          ellipsis: !!fixed,
          render: (value, record, index) => (
            <OperateMenus
              tableProps={this.props}
              record={record}
              index={index}
            />
          ),
        },
        ...tableColumns,
      ];
    }
    if (reset) {
      tableColumns.forEach((item) => {
        if (item.fixed !== item.originFixed) {
          item.fixed = undefined;
        }
      });
      this.setState({ tableColumns, allColumns: [...columns] });
      return;
    }
    this.setState({ tableColumns });
    if (headSettingKey) {
      // 显示标题设置
      this.getHeaderSettings(tableColumns, nextProps);
    }
  };

  // 获取 表格列的 原始Index 并处理
  getTableColumnDataIndex = () => {
    const { columns, showNumber, operateMenus } = this.props;
    const { sortColumn } = this.state;
    let tempColumns = [...columns];
    if (showNumber) {
      tempColumns = [sortColumn, ...columns];
    }
    tempColumns = tempColumns.map((col) => col.dataIndex);
    if (operateMenus) tempColumns.unshift('operate-menus');
    return tempColumns;
  };

  // 获取设置的表头数据
  getHeaderSettings = async (allColumns, props) => {
    // 接口返回值 当前设置要显示的列
    const { columns: data, isDefault } = await this.getTableColumnsFromBackend(
      props,
    );
    const target = data.settingValue ? JSON.parse(data.settingValue) : data;
    if (data.settingValue) this.headerValues = data;

    const currentColumns = [];
    const newAllColumns = [];
    target.forEach((item) => {
      const column = allColumns.find((col) => col.dataIndex === item.dataIndex);
      if (column && item.isSelected)
        currentColumns.push({
          ...column,
          fixed: item.fixed || column.fixed,
          ellipsis: !!(item.fixed || column.fixed),
        });
      newAllColumns.push({
        ...column,
        fixed: item.fixed || column.fixed,
        ellipsis: !!(item.fixed || column.fixed),
      });
    });
    this.setState({
      allColumns: newAllColumns,
      tableColumns: isDefault ? allColumns : currentColumns,
    });
  };

  handleResetCols = () => {
    const { columns } = this.props;
    this.getTableColumns(columns, this.props, true);
  };

  // 最后一列添加 表头设置按钮
  setHeaderSettings = () => {
    const { allColumns, tableColumns } = this.state;
    const { headSettingKey } = this.props;
    if (headSettingKey) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#f7f8fa',
            padding: '15px 12px 9px',
            zIndex: 900,
          }}
        >
          <HeaderSettingsDropDown
            {...this.props}
            columns={allColumns || []}
            tableColumns={tableColumns}
            onChange={(cols, results) => {
              this.setState({
                allColumns: [...cols],
                tableColumns: [...results],
              });
            }}
            headerValues={this.headerValues}
            onReset={this.handleResetCols}
            getTableColumnDataIndex={this.getTableColumnDataIndex}
          />
        </div>
      );
    }
  };

  // 获取选中的id数组
  getSelectedKeys = (callback) => {
    const { rowSelection } = this.state;
    if (callback) {
      callback(rowSelection.selectedRowKeys);
    } else {
      return rowSelection.selectedRowKeys;
    }
  };

  // 用于删除后查询当前页 处理了最后一条删除后的翻页问题
  searchAfterDelete = (params, bodyParams) => {
    const { pagination } = this.state;
    const total = pagination.total - 1;
    if (total % pagination.pageSize === 0 && pagination.current !== 1) {
      pagination.current =
        pagination.current === 1 ? pagination.current : pagination.current - 1;
    }
    this.setState(
      { pagination: { ...pagination }, params, bodyParams },
      this.getList,
    );
  };

  // 搜索 ,flag是否需要留在当前页
  search = (params, flag = false, bodyParams) => {
    const { pagination } = this.state;
    pagination.current = flag ? pagination.current : 1;
    if (params?.lastPage) {
      // 使用lastPage用以区分正常逻辑中传入的page,size和缓存的页码
      pagination.current = params.lastPage;
    }
    if (params?.lastSize) {
      pagination.pageSize = params.lastSize;
    }
    this.setState(
      { pagination: { ...pagination }, params, bodyParams },
      this.getList,
    );
  };

  // 重新加载数据
  reload = () => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: { ...pagination, current: 1 },
        params: {},
        selectedRowKeys: [],
        selectedRows: [],
      },
      this.getList,
    );
  };

  getList = (url) => {
    const { url: urlFromProps, paramAsBody = true } = this.props;
    if (!urlFromProps) return;
    const {
      notStartFromZero,
      filterData,
      onLoadData,
      params: paramsFromProps,
    } = this.props; // page从1开始分页
    this.setState({ loading: true });
    const {
      params,
      pagination: statePagination,
      pagination: { current, pageSize },
      sorters,
      bodyParams: body,
    } = this.state;
    let requestBody = [];
    const searchParams = {
      page: notStartFromZero ? current : current - 1,
      size: pageSize,
      ...paramsFromProps,
      sort: sorters,
      ...params,
    };
    const { methodType, dataKey, getAmountInfo, bodyParams } = this.props;
    const urlTemp = url || urlFromProps;
    // 增加数组对象判断
    if (bodyParams && Array.isArray(bodyParams) && bodyParams.length !== 0) {
      requestBody = methodType === 'post' ? bodyParams : searchParams;
    } else {
      requestBody =
        methodType === 'post'
          ? { ...bodyParams, ...body, ...(paramAsBody ? searchParams : {}) }
          : searchParams;
    }
    httpFetch[methodType || 'get'](
      urlTemp,
      requestBody,
      null,
      null,
      searchParams,
    )
      .then((res) => {
        const pagination = {
          ...statePagination,
          total: Number(res.headers['x-total-count']) || 0,
        };

        let data = dataKey
          ? typeof dataKey === 'string '
            ? res.data[dataKey]
            : res.data.dataKey
          : res.data;
        if (filterData) {
          data = filterData(data);
        }
        if (getAmountInfo) {
          getAmountInfo(res.headers['amount-info']);
        }
        this.setState(
          {
            dataSource: data,
            loading: false,
            pagination,
          },
          () => {
            if (onLoadData) {
              onLoadData(res.data, pagination);
            }
          },
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  tableChange = (pagination, filters, sorter) => {
    let sorters;
    if (sorter.field && sorter.order) {
      sorters = `${sorter.field}${sorter.order === 'ascend' ? '' : ',desc'}`;
    }
    const { pagination: paginationFromState } = this.state;
    this.setState(
      { sorters, pagination: { ...paginationFromState, ...pagination } },
      () => {
        this.getList();
        this.pageCaching(pagination);
      },
    );
  };

  /**
   * 缓存页码
   * @param {object} pagination
   */
  pageCaching = (pagination) => {
    if (!window?.g_app?._store) return;
    const { current, pageSize } = pagination;
    const { dispatch, getState } = window.g_app._store;
    const { searchCodeKey } = this.props;
    const searchData = getState()?.search?.data || {};
    dispatch({
      type: 'search/addSearchData',
      payload: {
        [searchCodeKey]: {
          ...searchData[searchCodeKey],
          lastPage: current,
          lastSize: pageSize,
        },
      },
    });
  };

  onSelect = (record) => {
    const { selectedRows, selectedRowKeys } = this.state;
    const { single, tableKey = 'id', onSelectChange } = this.props;

    // 单选
    if (single) {
      this.setState({
        selectedRows: [record],
        selectedRowKeys: [record[tableKey]],
      });
    } else {
      const index = selectedRowKeys.indexOf(record[tableKey]);
      if (index >= 0) {
        selectedRows.splice(index, 1);
        selectedRowKeys.splice(index, 1);
      } else {
        selectedRows.push(record);
        selectedRowKeys.push(record[tableKey]);
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
    const { tableKey = 'id', onSelectChange } = this.props;
    if (selected) {
      dataSource.forEach((o) => {
        if (selectedRowKeys.indexOf(o[tableKey]) < 0) {
          selectedRowKeys.push(o[tableKey]);
          selectedRows.push(o);
        }
      });
    } else {
      dataSource.forEach((o) => {
        const index = selectedRows.findIndex(
          (item) => item[tableKey] === o[tableKey],
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
   * 清空 selectedRowKeys 配合onSelectChange方法将值传递出去执行操作后清除勾选数据
   */
  onClearSelectedRowKeys = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  getDataLabel(data, keys) {
    let isMatch = false;
    keys = keys.replace(/\$\{(.*?)\}/g, (target, value) => {
      isMatch = true;
      return this.getValue(data, value) || '';
    });

    if (isMatch) {
      return keys;
    } else {
      return this.getValue(data, keys) || '';
    }
  }

  getValue = (data, key) => {
    const result = JSON.stringify(data);
    // eslint-disable-next-line no-new-func
    return new Function(`try {return ${result}.${key} } catch(e) {}`)();
  };

  render() {
    const {
      dataSource,
      pagination,
      loading,
      tableColumns,
      selectedRowKeys,
      frontPagination,
    } = this.state;
    const {
      onClick,
      tableKey,
      tableSize,
      allowChecked,
      rowSelection,
      scrollXWidth,
      onRow,
      single,
      isFrontPage,
      headSettingKey,
    } = this.props;

    const customSelection = {
      ...rowSelection,
      type: single ? 'radio' : 'checkbox',
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };

    return (
      <div style={{ position: 'relative' }} className="custom-table">
        <Table
          tableLayout="fixed"
          rowKey={(record) => this.getDataLabel(record, tableKey || 'id')}
          scroll={{ x: scrollXWidth || 1000 }}
          {...this.props}
          rowSelection={allowChecked ? customSelection : rowSelection}
          loading={loading}
          dataSource={dataSource}
          columns={tableColumns || []}
          pagination={
            isFrontPage
              ? frontPagination
              : pagination.total
              ? pagination
              : false
          }
          size={tableSize || 'middle'}
          bordered={!headSettingKey}
          onChange={this.tableChange}
          onRow={(record) => {
            return {
              ...(typeof onRow === 'function' ? onRow(record) : {}),
              onClick: () => {
                if (onClick) {
                  onClick(record);
                }
              },
            };
          }}
        />
        {this.setHeaderSettings()}
      </div>
    );
  }
}

export default CustomTable;
