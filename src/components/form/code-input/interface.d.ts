export enum SizeMap {
  large = 'large',
  middle = 'middle',
  small = 'small',
}

export interface IProps {
  placeholder?: string;
  disabled?: boolean;
  size?: SizeMap;
  inputRef?: any;
  onBlur?: (e: any) => {};
  onFocus?: (e: any) => {};
  value?: string | undefined;
  supportPoint: boolean;
  checkReg?: any; // 正则
  onChange?: (value: string | number) => {};
}

export interface IState {
  value: string | undefined;
}
