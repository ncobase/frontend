import { ExplicitAny } from '@/types';

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

type PublishStatusType = '已发布' | '未发布' | '草稿' | '已删除';

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

const publishStatusMap = (value: number | bigint | Date | boolean): PublishStatusType => {
  if (typeof value === 'boolean') {
    return value ? '已发布' : '未发布';
  } else if (typeof value === 'number') {
    if (value === 0) {
      return '草稿';
    } else if (value === 1) {
      return '已删除';
    } else {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return '已发布'; // formatDateTime(date, 'dateTime');
      }
    }
  }
};

/**
 * 解析状态值
 * @param value 状态值
 * @param type 状态类型
 * @returns 状态字符串
 */
export const parseStatus = (
  value: StatusType,
  type: 'status' | 'publishStatus' | 'processStatus' = 'status'
): string | number | bigint => {
  switch (type) {
    case 'status':
      return statusMap[value as ExplicitAny] || '未知';
    case 'processStatus':
      return processStatusMap[value as number] || '未知';
    case 'publishStatus':
      return publishStatusMap(value as bigint) || '未知';
    default:
      return '未知';
  }
};
