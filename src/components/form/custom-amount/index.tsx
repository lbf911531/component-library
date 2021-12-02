import React from 'react';
import InputNumber from '../input-number';
import { messages } from '../../utils';
import { IProps } from './interface';

class CustomAmount extends React.Component<IProps, {}> {
  static defaultProps = {
    disabled: false,
    step: 0.01,
    precision: 2,
    min: 0,
    ignoreMin: true,
    style: { width: '100%' },
    onChange: () => {},
    maxLength: 20,
  };

  render() {
    const { value, min, ignoreMin, precision, maxLength, inputRef, ...rest } =
      this.props;
    const integerLength = maxLength - precision; // 现在限制 整数位 加 小数位 共20位
    return (
      <InputNumber
        placeholder={messages('common.please.enter')}
        value={value}
        min={ignoreMin ? undefined : min}
        formatter={(values) =>
          `${values}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        parser={(values) => values.replace(/(,*)/g, '')}
        precision={precision}
        maxLength={integerLength} // 整数 位数
        {...rest}
        ref={inputRef}
      />
    );
  }
}

export default CustomAmount;
