/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-28 14:23:21
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-04 16:43:38
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';
import { Modal, message, Radio, Tabs } from 'antd';
import { messages } from '../../utils';
import LocaleContext from '../../locale-lan-provider/context';
import Table from '../../basic/table';
import { IProps, IState } from './interface';

const { TabPane } = Tabs;

// 数据导出组件
class ExcelExporter extends React.Component<IProps, IState> {
  static contextType = LocaleContext;
  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    columns: [],
    fileName: 'excel',
    excelItem: '',
    canCheckVersion: true,
    visible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      excelVersion: 'xlsx',
      multiple: false, // 是否是多页签导出
      sheetKey: null,
    };
  }

  componentWillMount() {
    const { columns } = this.props;
    this.initHandle(columns);
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;
    if (nextProps.visible && !visible) {
      this.initHandle(nextProps.columns);
    }
  }

  initHandle = (propsColumns) => {
    let multiple = false;
    let selectedRowKeys: Array<string> | { [key: string]: Array<string> } = [];
    let sheetKey = null;
    if (Array.isArray(propsColumns)) {
      propsColumns.forEach((col) => {
        if (col.sheetName && Array.isArray(col.columns)) {
          // 多页签导出
          const keys = col.columns.map((c) => c.dataIndex);
          if (Array.isArray(selectedRowKeys)) {
            selectedRowKeys = { [col.sheetName]: keys };
          } else {
            selectedRowKeys[col.sheetName] = keys;
          }
          multiple = true;
        } else if (col.dataIndex && Array.isArray(selectedRowKeys)) {
          selectedRowKeys.push(col.dataIndex);
        }
      });
      if (multiple) {
        sheetKey = propsColumns[0].sheetName;
      }
    }
    this.setState({
      multiple,
      selectedRowKeys,
      excelVersion: 'xlsx',
      sheetKey,
    });
  };

  exportResult = () => {
    const { columns, fileName, excelItem, onOk, onCancel } = this.props;
    const { selectedRowKeys, excelVersion, multiple } = this.state;

    const itemResult = { fileName, excelType: excelVersion, excelItem };
    const result = multiple ? [] : { ...itemResult, columnsInfo: [] };
    let isEmpty = false;

    if (!multiple && selectedRowKeys.length === 0) {
      message.error(
        messages('common.select.export.column', { context: this.context }),
      ); /** 请选择导出列 */
      return;
    }

    columns.forEach((item) => {
      if (multiple) {
        const keys = selectedRowKeys[item.sheetName] || [];
        if (keys.length === 0) {
          /** 请选择导出列 */
          message.error(
            messages('base.please.select.the.export.column.of.tab.sheet', {
              params: { sheet: item.sheetName },
              context: this.context,
            }),
          );
          isEmpty = true;
          return;
        }
        const columnsInfo = [];
        if (Array.isArray(item.columns)) {
          item.columns.forEach((col) => {
            keys.forEach((key) => {
              if (col.dataIndex === key) {
                columnsInfo.push(this.handColumn(col));
              }
            });
          });
        }
        // @ts-ignore
        result.push({ ...itemResult, columnsInfo, sheetName: item.sheetName });
      } else if (Array.isArray(selectedRowKeys)) {
        selectedRowKeys.forEach((key) => {
          if (item.dataIndex === key) {
            // @ts-ignore
            result.columnsInfo.push(this.handColumn(item));
          }
        });
      }
    });

    if (isEmpty) return;

    onOk(result);
    onCancel();
  };

  handChildren = (children) => {
    const childrenColumns = [];
    children.forEach((col) => {
      childrenColumns.push(this.handColumn(col));
    });
    return childrenColumns;
  };

  handColumn = (item) => {
    const columnInfo: { title: string; name: string; columnsInfo?: any } = {
      title: item.title,
      name: item.dataIndex,
    };
    if (item.children && item.children.length > 0) {
      columnInfo.columnsInfo = this.handChildren(item.children);
    }
    return columnInfo;
  };

  handleRowClick = (record) => {
    const { selectedRowKeys, multiple, sheetKey } = this.state;
    if (multiple) {
      const keys = selectedRowKeys[sheetKey] || [];
      const index = keys.findIndex((key) => key === record.dataIndex);
      if (index > -1) {
        keys.splice(index, 1);
      } else {
        keys.push(record.dataIndex);
      }
      this.setState({
        selectedRowKeys: { ...selectedRowKeys, [sheetKey]: [...keys] },
      });
    } else if (Array.isArray(selectedRowKeys)) {
      const index = selectedRowKeys.findIndex(
        (key) => key === record.dataIndex,
      );
      if (index > -1) {
        selectedRowKeys.splice(index, 1);
      } else {
        selectedRowKeys.push(record.dataIndex);
      }
      this.setState({ selectedRowKeys: [...selectedRowKeys] });
    }
  };

  onSelectItem = (rowKeys) => {
    const { multiple, sheetKey, selectedRowKeys } = this.state;
    if (multiple) {
      this.setState({
        selectedRowKeys: { ...selectedRowKeys, [sheetKey]: rowKeys },
      });
    } else {
      this.setState({ selectedRowKeys: rowKeys });
    }
  };

  renderTable = (columns, selectedRowKeys) => {
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectItem,
      preserveSelectedRowKeys: true,
      checkStrictly: false,
    };
    return (
      <Table
        dataSource={columns}
        rowSelection={rowSelection}
        pagination={false}
        columns={[
          {
            title: messages('column.name', {
              context: this.context,
            }) /** 列名 */,
            dataIndex: 'title',
            align: 'left',
          },
        ]}
        rowKey="dataIndex"
        size="middle"
        onRow={(record) => ({
          onClick: () => this.handleRowClick(record),
        })}
        style={{ cursor: 'pointer' }}
        bordered
      />
    );
  };

  render() {
    const { visible, columns, onCancel, canCheckVersion } = this.props;
    const { excelVersion, selectedRowKeys, multiple, sheetKey } = this.state;

    return (
      <Modal
        visible={visible}
        width={800}
        destroyOnClose
        onCancel={onCancel}
        onOk={this.exportResult}
        title={messages('common.columns.to.export', {
          context: this.context,
        })} /** 选择要导出的列 */
        bodyStyle={{
          height: '70vh',
          overflowY: 'scroll',
          padding: '16px 24px',
        }}
        okText={messages('common.export', {
          context: this.context,
        })} /** 导出 */
        cancelText={messages('common.cancel', { context: this.context })}
      >
        {canCheckVersion && (
          /** 导出为 */
          <div style={{ marginBottom: 12 }}>
            {messages('common.export.as', { context: this.context })}：
            <Radio.Group
              onChange={(e) => this.setState({ excelVersion: e.target.value })}
              value={excelVersion}
            >
              <Radio value="xls">Excel 2003</Radio>
              <Radio value="xlsx">Excel 2007</Radio>
            </Radio.Group>
          </div>
        )}
        {multiple ? (
          <Tabs
            defaultActiveKey={sheetKey}
            onChange={(activeKey) => this.setState({ sheetKey: activeKey })}
            tabBarStyle={{ marginTop: -15 }}
          >
            {columns.map((col) => {
              return (
                <TabPane tab={col.sheetName} key={col.sheetName}>
                  {this.renderTable(
                    col.columns,
                    selectedRowKeys[col.sheetName] || [],
                  )}
                </TabPane>
              );
            })}
          </Tabs>
        ) : (
          this.renderTable(columns, selectedRowKeys)
        )}
      </Modal>
    );
  }
}

export default ExcelExporter;
