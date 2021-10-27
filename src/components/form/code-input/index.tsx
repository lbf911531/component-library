import React from 'react';
import { Input } from 'antd';
import { IProps, IState } from './interface';

class CodeInput extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({ value });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  handleChange = (e) => {
    // 如果传入的 supportPoint={false} 正则中就不能有 .
    const { value: preValue, supportPoint = true } = this.props;
    // 支持传入 reg
    let { checkReg } = this.props;

    if (checkReg === null || checkReg === undefined) {
      if (!supportPoint) {
        checkReg = /^[\w-]+$/;
      } else {
        checkReg = /^[\w.-]+$/;
      }
    }

    // 用于 判断传入的 是否是 正则表达式
    let isReg;
    try {
      // eslint-disable-next-line no-eval
      isReg = eval(checkReg) instanceof RegExp;
    } catch {
      isReg = false;
    }

    if (isReg) {
      if (e && (checkReg.test(e.target.value) || !e.target.value)) {
        const { value } = e.target;
        this.setState({ value }, () => {
          const { onChange } = this.props;
          if (onChange) {
            onChange(value);
          }
        });
      } else {
        this.setState({ value: preValue || '' });
      }
    }
  };

  render() {
    const { placeholder, disabled, size, inputRef, onBlur, onFocus } =
      this.props;
    const { value } = this.state;

    return (
      <Input
        size={size}
        value={value}
        onChange={this.handleChange}
        placeholder={placeholder}
        disabled={disabled}
        ref={inputRef}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }
}

export default CodeInput;
