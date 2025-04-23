import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

type StatusValue = 'Normal' | 'Disabled' | 'Unknown';
type ProcessStatusValue =
  | 'Normal'
  | 'Pending'
  | 'InProgress'
  | 'Cancelled'
  | 'Rejected'
  | 'Recalled'
  | 'Completed'
  | 'Submitted'
  | 'Unknown';
type PublishStatusValue = 'Published' | 'Unpublished' | 'Draft' | 'Deleted' | 'Unknown';

type InputStatusType = StatusValue | boolean | number | string | null | undefined;
type InputProcessStatusType = number;
type InputPublishStatusType = number | boolean | Date;

const getStatusMap = (t: TFunction): Record<string, StatusValue> => ({
  '': t('enums.status.unknown') as StatusValue,
  undefined: t('enums.status.unknown') as StatusValue,
  false: t('enums.status.disabled') as StatusValue,
  0: t('enums.status.disabled') as StatusValue,
  true: t('enums.status.normal') as StatusValue,
  1: t('enums.status.normal') as StatusValue
});

const getProcessStatusMap = (t: TFunction): Record<number, ProcessStatusValue> => ({
  0: t('enums.processStatus.normal') as ProcessStatusValue,
  1: t('enums.processStatus.pending') as ProcessStatusValue,
  2: t('enums.processStatus.inProgress') as ProcessStatusValue,
  3: t('enums.processStatus.cancelled') as ProcessStatusValue,
  4: t('enums.processStatus.rejected') as ProcessStatusValue,
  5: t('enums.processStatus.recalled') as ProcessStatusValue,
  6: t('enums.processStatus.completed') as ProcessStatusValue,
  7: t('enums.processStatus.submitted') as ProcessStatusValue
});

const getPublishStatusMap = (t: TFunction): Record<string, PublishStatusValue> => ({
  published: t('enums.publishStatus.published') as PublishStatusValue,
  unpublished: t('enums.publishStatus.unpublished') as PublishStatusValue,
  draft: t('enums.publishStatus.draft') as PublishStatusValue,
  deleted: t('enums.publishStatus.deleted') as PublishStatusValue,
  unknown: t('enums.publishStatus.unknown') as PublishStatusValue
});

const parseBaseValue = (t: TFunction, value: unknown): StatusValue => {
  if (value === null || value === undefined || value === '')
    return t('enums.status.unknown') as StatusValue;
  if (typeof value === 'boolean')
    return value
      ? (t('enums.status.normal') as StatusValue)
      : (t('enums.status.disabled') as StatusValue);
  if (typeof value === 'number')
    return value > 0
      ? (t('enums.status.normal') as StatusValue)
      : (t('enums.status.disabled') as StatusValue);
  // For strings, direct return may not be expected behavior unless it's exactly 'Normal' or 'Disabled'
  // Here we assume non-boolean/number/empty values are treated as Unknown
  return t('enums.status.unknown') as StatusValue;
};

const parsePublishValue = (t: TFunction, value: InputPublishStatusType): PublishStatusValue => {
  const map = getPublishStatusMap(t);
  if (typeof value === 'boolean') {
    return value ? map.published : map.unpublished;
  }
  if (typeof value === 'number') {
    if (value === 0) return map.draft;
    if (value === 1) return map.deleted;
    // Assume other positive numbers (possibly timestamps) indicate published status
    if (value > 1) {
      const date = new Date(value);
      // Check if it's a valid timestamp
      if (!isNaN(date.getTime()) && date.getTime() > 0) {
        return map.published;
      }
    }
  }
  // Handle Date objects (though not in type definition, included in original logic)
  if (value instanceof Date && !isNaN(value.getTime())) {
    return map.published;
  }

  return map.unknown; // Default to unknown
};

type StatusParserType = 'status' | 'publishStatus' | 'processStatus';

/**
 * Custom Hook for parsing various status values and returning localized strings.
 * @param value - The status value to parse.
 * @param type - Type of status ('status', 'publishStatus', 'processStatus').
 * @returns Localized status string.
 */
export const useParseStatus = () => {
  const { t } = useTranslation();

  const parseStatus = (
    value: InputStatusType | InputProcessStatusType | InputPublishStatusType,
    type: StatusParserType = 'status'
  ): string => {
    const unknownString = t('enums.status.unknown');

    switch (type) {
      case 'status': {
        const map = getStatusMap(t);
        // Handle ExplicitAny case, prioritize mapping
        const stringValue = String(value);
        if (stringValue in map) {
          return map[stringValue];
        }
        // If not in mapping, try basic parsing
        return parseBaseValue(t, value);
      }
      case 'processStatus': {
        const map = getProcessStatusMap(t);
        return map[value as number] || unknownString;
      }
      case 'publishStatus': {
        return parsePublishValue(t, value as InputPublishStatusType);
      }
      default:
        // For unknown types, use basic parsing logic
        return parseBaseValue(t, value);
    }
  };

  return { parseStatus };
};

/**
 * Function for parsing various status values and returning localized strings.
 * @param value - The status value to parse.
 * @param type - Type of status ('status', 'publishStatus', 'processStatus').
 * @returns Localized status string.
 */
export const parseStatus = (value: any, type: StatusParserType = 'status'): string => {
  const parser = useParseStatus();
  return parser.parseStatus(value, type);
};

export type {
  StatusValue,
  ProcessStatusValue,
  PublishStatusValue,
  InputStatusType,
  InputProcessStatusType,
  InputPublishStatusType,
  StatusParserType
};
