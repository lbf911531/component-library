import React, { Component } from 'react';
import { Button, Input, Popover, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { IProps } from './interface';
import ListSelector from './list-selector';
import ClearIcon from './clear-icon';
import './style.less';

/**
 * 弹框组件
 */
interface IState {
  visible: boolean;
  value: string;
}
class Lov extends Component<IProps, IState> {
  input: any;

  static defaultProps = {
    placeholder: '请输入',
    disabled: false,
    extraParams: {},
    single: false,
    allowClear: true,
    showDetail: true,
    lovType: 'lov',
    cancelDoubleClick: false,
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: false,
      value: '',
    };
  }

  componentDidMount() {
    // @ts-ignore
    const { value, single, labelKey, lovType, valueText } = this.props;

    if (value) {
      if (!single) {
        this.setState({
          value: `已选择 ${value.length} 条`,
        });
      } else {
        // 单选情况下且类型为chooser时，value是个数组
        this.setState({
          value:
            lovType !== 'lov' && Array.isArray(value) && value[0]
              ? this.getDataLabel(value[0], labelKey)
              : this.getDataLabel(value, labelKey),
        });
      }
    } else {
      this.setState({
        value: valueText || ``,
      });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { value, single, labelKey, lovType, valueText } = nextProps;
    if (value) {
      if (!single) {
        this.setState({
          // value: messages("base.has.choose.count", { count: nextProps.value.length }),
          value: `已选择${nextProps.value.length}条`,
        });
      } else {
        this.setState({
          value:
            lovType !== 'lov' && Array.isArray(value) && value[0]
              ? this.getDataLabel(value[0], labelKey)
              : this.getDataLabel(value, labelKey),
        });
      }
    } else {
      this.setState({
        value: valueText || ``,
      });
    }
  }

  // 处理labelKey,以便 传入 `${userCode}-${userName}`这种格式的labelKey可以获取到值
  getDataLabel = (data: any, key: string) => {
    let isMatch = false;
    let keys = key;
    keys = keys.replace(/\$\{(.*?)\}/g, (target, value) => {
      isMatch = true;
      return data[value] || '';
    });

    if (isMatch) {
      return keys;
    } else {
      const value = data[keys];
      return [undefined, null, ''].includes(value) ? '' : value.toString();
    }
  };

  // 输入框获取焦点，显示弹出框
  focusHandle = () => {
    const { disabled, single, onFocus } = this.props;
    if (single && disabled) {
      return;
    }
    this.input.blur();
    if (onFocus) onFocus();
    this.setState({ visible: true });
  };

  // 确定的回调
  okHandle = (values: any[] | any | null): void => {
    const { onChange, afterOk } = this.props;
    if (onChange) {
      onChange(values);
      this.setState({ visible: false });
    }
    if (afterOk) afterOk(values);
  };

  // 取消的回调
  cancelHandle = () => {
    this.setState({ visible: false });
    const { afterCancel, value } = this.props;
    if (afterCancel) afterCancel(value);
  };

  // 清除
  onChange = (e: any) => {
    if (!e.target.value) {
      const { single } = this.props;
      if (single) {
        this.okHandle(null);
      } else {
        this.okHandle(null);
      }
    }
  };

  render() {
    const { visible, value } = this.state;
    /* @ts-ignore */
    const {
      allowClear,
      placeholder,
      disabled,
      single,
      customChooserTextValue,
      inputStyle,
    } = this.props;
    const {
      value: propsValue,
      labelKey,
      showPopover,
      cusSuffixIcon,
      cusRemoveIcon,
    } = this.props;
    const popList = Array.isArray(propsValue)
      ? propsValue
          .map((val) => this.getDataLabel(val, labelKey))
          .filter((val) => val)
      : [];
    return (
      <div className="lov-wrap">
        <Popover
          content={popList.map((op) => (
            <Tag key={op} style={{ margin: '4px' }}>
              {op}
            </Tag>
          ))}
          visible={popList?.length && showPopover ? undefined : false}
          overlayStyle={{ maxWidth: 300, maxHeight: 300, overflowY: 'auto' }}
        >
          {/* eslint-disable-next-line react/jsx-indent */}
          <div style={{ position: 'relative' }}>
            {!disabled && allowClear && (
              <span
                className={
                  !value || (value && value.length === 0)
                    ? 'ant-select-selection__clear lov-none-clear'
                    : 'ant-select-selection__clear lov-clear'
                }
                onClick={() => {
                  if (value && value.length) {
                    this.onChange({ target: { value: '' } });
                  }
                }}
              >
                {cusRemoveIcon || <ClearIcon />}
              </span>
            )}
            <Input
              value={value}
              title={value}
              ref={(ref) => {
                this.input = ref;
              }}
              onFocus={this.focusHandle}
              placeholder={placeholder}
              disabled={disabled}
              onChange={this.onChange}
              className="ant-input-search"
              style={{
                padding: '0 0 0 11px',
                lineHeight: '32px',
                ...inputStyle,
              }}
              suffix={
                cusSuffixIcon ? null : (
                  <Button
                    className="ant-btn-icon-only ant-input-search-button"
                    disabled={(single && disabled) || !!customChooserTextValue}
                    onClick={this.focusHandle}
                    style={{ border: 0 }}
                  >
                    <DownOutlined
                      style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.25)' }}
                    />
                  </Button>
                )
              }
            />
            {cusSuffixIcon ? (
              <span onClick={this.focusHandle}>{cusSuffixIcon}</span>
            ) : null}
          </div>
        </Popover>
        <ListSelector
          // @ts-ignore
          onOk={this.okHandle}
          onCancel={this.cancelHandle}
          visible={visible}
          {...this.props}
        />
      </div>
    );
  }
}

export default Lov;
