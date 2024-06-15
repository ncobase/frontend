import { ExplicitAny } from '@ncobase/types';

type StatusType = '正常' | '禁用' | '未知' | unknown;
type ProcessStatusType =
  | '正常'
  | '待审批'
  | '审批中'
  | '已取消'
  | '驳回'
  | '召回'
  | '审批完成'
  | '已提交';

const statusMap: Record<ExplicitAny, string> = {
  '': '未知',
  undefined: '未知',
  false: '禁用',
  0: '禁用',
  true: '正常',
  1: '正常'
};

const processStatusMap: Record<number, ProcessStatusType> = {
  0: '正常',
  1: '待审批',
  2: '审批中',
  3: '已取消',
  4: '驳回',
  5: '召回',
  6: '审批完成',
  7: '已提交'
};

/**
 * 解析状态值
 * @param value 状态值
 * @param type 状态类型
 * @returns 状态字符串
 */
export const parseStatus = (
  value: StatusType,
  type: 'status' | 'processStatus' = 'status'
): string => {
  switch (type) {
    case 'status':
      return statusMap[value as ExplicitAny] || '未知';
    case 'processStatus':
      return processStatusMap[value as number] || '未知';
    default:
      return '未知';
  }
};
