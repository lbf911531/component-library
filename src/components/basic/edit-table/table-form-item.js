import React, { Component } from 'react';
import moment from 'moment';
import Input from './components/input';
import Switch from './components/switch';
import Select from './components/select';
import SelectPartLoad from './components/select-part-load';
import InputNumber from './components/input-number';
import DatePicker from './components/data-picker';
import Lov from './components/lov';
import CustomAmountInput from './components/input-amount';
import CustomCheckbox from './components/checkbox';
import InputLanguage from './components/input-language';
import CodeInput from './components/code-input';
import Cascader from './components/cascader';

class TableFormItem extends Component {
  state = { getParams: {} };

  componentDidMount() {
    const { column, record } = this.props;
    // if (column.disabled) {
    //   if (typeof column.disabled === 'function') {
    //     const result = column.disabled(record);
    //     this.setState({ disabled: result });
    //   } else if (typeof column.disabled === 'boolean') {
    //     this.setState({ disabled: column.disabled });
    //   }
    // }

    if (column.getParams) {
      if (typeof column.getParams === 'function') {
        const result = column.getParams(record);
        this.setState({ getParams: result });
      } else if (typeof column.getParams === 'object') {
        this.setState({ getParams: column.getParams });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { column, record } = nextProps;
    // if ({}.hasOwnProperty.call(column,'disabled')) {
    //   if (typeof column.disabled === 'function') {
    //     const result = column.disabled(record);
    //     this.setState({ disabled: result });
    //   } else if (typeof column.disabled === 'boolean') {
    //     this.setState({ disabled: column.disabled });
    //   }
    // } else {
    //   this.setState({ disabled: false });
    // }

    if (column.getParams) {
      if (typeof column.getParams === 'function') {
        const result = column.getParams(record);
        this.setState({ getParams: result });
      } else if (typeof column.getParams === 'object') {
        this.setState({ getParams: column.getParams });
      }
    }
  }

  renderFormItem = () => {
    // const { attr, column: col, ...newProps } = this.props;
    // const { disabled, getParams } = this.state;
    const { attr, disabled, column: col, ...newProps } = this.props;
    const { getParams } = this.state;
    const { type: colType, ...column } = col;
    // const common = { ...newProps, ...column, ...attr, disabled: disabled || attr?.disabled, allowClear: !col.required };
    const common = {
      ...newProps,
      ...column,
      ...attr,
      disabled,
      allowClear: !col.required,
    };
    const type = (attr && attr.type) || colType;
    switch (type) {
      case 'input':
        return <Input {...common} />;
      case 'number':
        return <InputNumber {...common} />;
      case 'select':
        return <Select {...common} getParams={getParams} />;
      case 'selectPartLoad':
        return (
          <SelectPartLoad
            {...common}
            // Select中的valueKey和labelKey需要重新设定下
            valueKey={col.valueKeySelect || col.valueKey}
            labelKey={col.labelKeySelect || col.labelKey}
          />
        );
      case 'date':
        return (
          <DatePicker
            {...common}
            disabledDate={(cur) => {
              if (!cur) return false;
              let dateRange = {};
              if (column.dateLimit) {
                if (typeof column.dateLimit === 'function') {
                  dateRange = column.dateLimit(newProps.record);
                } else {
                  dateRange = column.dateLimit;
                }
              }
              const precision = column.datePrecision || 'day';
              const lowerLimit =
                cur.isBefore(
                  moment(dateRange.min || '1970-01-01 00:00:00'),
                  precision,
                ) ||
                cur.isAfter(
                  moment(dateRange.max || '2038-01-01 00:00:01'),
                  precision,
                );
              if (lowerLimit) return true;
              return false;
            }}
          />
        );
      case 'lov':
        return <Lov {...common} getParams={getParams} />;
      case 'switch':
        return <Switch {...common} />;
      case 'amount':
        return <CustomAmountInput {...common} />;
      case 'checkbox':
        return <CustomCheckbox {...common} />;
      case 'language':
        return <InputLanguage {...common} />;
      case 'codeInput':
        return <CodeInput {...common} disabledFn={column.disabled} />;
      case 'custom':
        return col.renderCell ? col.renderCell(common) : null;
      case 'cascader':
        return (
          <Cascader {...common} disabled={disabled} getParams={getParams} />
        );
      default:
        return <span>{newProps.value}</span>;
    }
  };

  render() {
    return this.renderFormItem();
  }
}

export default TableFormItem;
