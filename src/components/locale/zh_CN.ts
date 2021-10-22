/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-22 15:13:14
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-10-22 16:08:16
 * @Version: 1.0.0
 * @Description: 定义公有的多语言
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

/**
 *
 * （想法）TODO: 全部抽离到这里是想后续某天，可以将locale下的做得更加灵活，
 * 目前仅打算支持 中文，英文；如果后续要支持更多的语言，可以考虑由项目定义好，
 * 然后借助localeProvider传入
 */
export default {
  'common.please.enter': '请输入',
  'common.please.select': '请选择',
  'common.all': '全部',
  'common.cannot.be.less.than': '不能小于',
  'common.no.empty': '{name}不可为空',
  'common.no.matching.result': '无匹配结果',
  'common.fold': '收起',
  'common.expand': '展开',
  'common.Illegal.digital': '{label}为非法数字',
};
