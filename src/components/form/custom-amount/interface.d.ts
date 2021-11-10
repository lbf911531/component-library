export interface IProps {
  disabled: boolean; // 是否可用
  onChange: (value) => void; // 输入后的回调
  precision: number; // 小数位数
  ignoreMin: boolean; // 是否取消最小为0的限制
  maxLength: number; // 整数位 加 小数位 共20位
  min: number;
  step: number;
  style: any;
  value: string | number;
  inputRef?: any;
}
