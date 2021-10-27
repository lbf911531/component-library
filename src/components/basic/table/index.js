import React from 'react';
import { Table, ConfigProvider, Empty } from 'antd';
import { Resizable } from 'react-resizable';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      draggableOpts={{ enableUserSelectHack: false }}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class BasicTable extends React.Component {
  state = {
    columns: [],
    expandedRows: [],
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  componentDidMount() {
    const { columns: columnsFromProps } = this.props;
    this.setState({
      columns: columnsFromProps,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns,
    });
  }

  handleResize =
    (index) =>
    (e, { size }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return { columns: nextColumns };
      });
    };

  /**
   * 切换页码
   * @param pagination1
   */
  onTableChange = (pagination1, ...rest) => {
    const { pagination, onChange } = this.props;
    if (onChange) {
      onChange({ ...pagination, ...pagination1 }, ...rest);
    }
  };

  onExpandedRowsChange = (keys) => {
    const { onExpandedRowsChange } = this.props;
    if (onExpandedRowsChange) {
      onExpandedRowsChange(keys);
    } else {
      this.setState({ expandedRows: keys });
    }
  };

  render() {
    const { noReSize, onExpandedRowsChange, expandedRowKeys, pagination } =
      this.props;
    const { columns: columnsFromState } = this.state;
    const columns = noReSize
      ? columnsFromState
      : columnsFromState &&
        columnsFromState.map((col, index) => ({
          ...col,
          onHeaderCell: (column) => ({
            width: parseInt(column.width, 10) || 120,
            onResize: this.handleResize(index),
          }),
        }));
    const { expandedRows } = this.state;

    return (
      <ConfigProvider renderEmpty={() => <Empty />}>
        <Table
          components={this.components}
          {...this.props}
          pagination={pagination}
          onChange={this.onTableChange}
          columns={columns}
          expandedRowKeys={
            onExpandedRowsChange ? expandedRowKeys : expandedRows
          }
          onExpandedRowsChange={this.onExpandedRowsChange}
        />
      </ConfigProvider>
    );
  }
}

BasicTable.defaultProps = {
  dataSource: [],
  prefixCls: 'ant-table',
  useFixedHeader: false,
  className: '',
  size: 'default',
  loading: false,
  bordered: true,
  locale: {},
  dropdownPrefixCls: '',
  onChange: () => {},
  columns: [],
};

export default BasicTable;
