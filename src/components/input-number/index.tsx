import * as React from 'react';
import classNames from 'classnames';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import AntdComponent from 'antd';
import createReactContext from '@ant-design/create-react-context';
import { CSPConfig, RenderEmptyHandler } from 'antd/lib/config-provider';
import RcInputNumber from './RcInputNumber';

const Empty = AntdComponent.Empty;
const Number = AntdComponent.InputNumber;

export interface ConfigConsumerProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
}

const ConfigContext = createReactContext<ConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;

    return `ant-${suffixCls}`;
  },

  renderEmpty: () => <Empty />,
});

export const ConfigConsumer = ConfigContext.Consumer;

export interface InputNumberProps {
  prefixCls?: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number | string;
  defaultValue?: number;
  tabIndex?: number;
  onChange?: (value: number | undefined) => void;
  disabled?: boolean;
  size?: 'large' | 'small' | 'default';
  formatter?: (value: number | string | undefined) => string;
  parser?: (displayValue: string | undefined) => number | string;
  decimalSeparator?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  name?: string;
  id?: string;
  precision?: number;
}

export default class InputNumber extends React.Component<
  InputNumberProps,
  any
> {
  static defaultProps = {
    step: 1,
  };

  inputNumberRef: any;

  saveInputNumber = (inputNumberRef: any) => {
    this.inputNumberRef = inputNumberRef;
  };

  focus() {
    this.inputNumberRef.focus();
  }

  blur() {
    this.inputNumberRef.blur();
  }

  renderInputNumber = ({ getPrefixCls }: ConfigConsumerProps) => {
    const {
      className,
      size,
      prefixCls: customizePrefixCls,
      ...others
    } = this.props;
    const prefixCls = getPrefixCls('input-number', customizePrefixCls);
    const inputNumberClass = classNames(
      {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      },
      className,
    );
    // @ts-ignore
    const upIcon = <UpOutlined className={`${prefixCls}-handler-up-inner`} />;
    // @ts-ignore
    const downIcon = (
      <DownOutlined className={`${prefixCls}-handler-down-inner`} />
    );

    return (
      <RcInputNumber
        ref={this.saveInputNumber}
        className={inputNumberClass}
        upHandler={upIcon}
        downHandler={downIcon}
        prefixCls={prefixCls}
        type="tel"
        {...others}
      />
    );
  };

  render() {
    return <ConfigConsumer>{this.renderInputNumber}</ConfigConsumer>;
  }
}
