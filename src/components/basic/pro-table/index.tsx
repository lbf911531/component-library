import React from 'react';
import { Row, Col, Input } from 'antd';

import { messages } from '@/components/utils';
import SearchArea from '../search-area';
import CustomTable from '../custom-table';
import {
  formatParams,
  getColumnsAndSearchForm,
  combineSearchForm,
} from './utils';
import { ProTableProps, ProTableState } from './interface';

class ProTable extends React.Component<ProTableProps, ProTableState> {
  static defaultProps = {
    placeholder: messages('common.please.enter'),
  };

  table = null;

  constructor(props: ProTableProps) {
    super(props);
    this.state = {
      searchForm: [],
      columns: [],
      selectRow: { selectedRowKeys: [], selectedRows: [] },
    };
  }

  componentDidMount() {
    this.initHandle(this.props);
  }

  componentWillReceiveProps(nextProps: ProTableProps) {
    const { columns: propsColumns, searchForm } = this.props;
    const { columns: nextColumns, searchForm: nextSearchForm } = nextProps;
    if (propsColumns !== nextColumns) {
      this.initHandle(nextProps);
    }
    if (searchForm !== nextSearchForm) {
      const { searchForm: stateSearchForm } = this.state;
      const result = combineSearchForm(nextSearchForm, stateSearchForm); // 保留select的options
      this.setState({ searchForm: result });
    }
  }

  initHandle = (props: ProTableProps) => {
    const { columns: propsColumns, searchForm: propsSearchForm } = props;
    const { searchForm: stateSearchForm } = this.state;
    const { columns, searchForm } = getColumnsAndSearchForm(propsColumns);
    const result = combineSearchForm(
      propsSearchForm || searchForm,
      stateSearchForm,
    ); // 保留select的options
    this.setState({ columns, searchForm: result });
  };

  // 点击搜索
  search = (values: Object, extraFlag) => {
    const { method, beforeSearchSubmit, submitHandle } = this.props;
    const { searchForm } = this.state;
    let result = formatParams(values, searchForm);

    if (!extraFlag) {
      if (beforeSearchSubmit) {
        result = beforeSearchSubmit(result);
      }
      if (submitHandle) {
        submitHandle(result);
      }
    }

    if (method === 'post') {
      this.table.search({}, null, result);
    } else {
      this.table.search(result);
    }
  };

  // 额外字段搜索
  extraSearch = (value) => {
    const { extraSearchField } = this.props;
    this.search({ [extraSearchField]: value }, true);
  };

  // 选择 change
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectChange } = this.props;
    this.setState({ selectRow: { selectedRowKeys, selectedRows } });
    if (onSelectChange) {
      onSelectChange(selectedRowKeys, selectedRows);
    }
  };

  // 渲染工具栏，显示在table上方
  toolBarRender = () => {
    const { toolBarRender } = this.props;
    const { selectRow } = this.state;
    if (toolBarRender) {
      return toolBarRender(selectRow.selectedRowKeys, selectRow.selectedRows);
    }
    return null;
  };

  render() {
    const {
      tableRef,
      searchRef,
      extraSearchField,
      placeholder,
      children,
      ...rest
    } = this.props;
    const { searchForm, columns } = this.state;

    return (
      <div>
        <SearchArea
          {...rest}
          searchForm={searchForm}
          onRef={searchRef}
          submitHandle={this.search}
        />

        {extraSearchField ? (
          <Row style={{ marginBottom: 12 }}>
            <Col span={18}>{children}</Col>
            <Col span={6}>
              <Input.Search
                placeholder={placeholder}
                style={{ width: '100%' }}
                onSearch={this.extraSearch}
                enterButton
              />
            </Col>
          </Row>
        ) : (
          children
        )}

        {/* 工具栏 */}
        {this.toolBarRender()}

        <CustomTable
          {...rest}
          ref={(ref) => {
            if (ref) {
              this.table = ref;
              if (tableRef) {
                tableRef(ref);
              }
            }
          }}
          columns={columns}
          onSelectChange={this.onSelectChange}
        />
      </div>
    );
  }
}

export default ProTable;
