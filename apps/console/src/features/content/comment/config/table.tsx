import { Badge, Button, TableViewProps, Tooltip } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import type { Comment } from '../comment';

export const tableColumns = ({
  handleView,
  handleDelete,
  handleToggleApproved
}): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('comment.fields.content', 'Content'),
      dataIndex: 'content',
      parser: (value: string, record: Comment) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='line-clamp-2 max-w-md text-left'>
            {value || t('comment.empty_content', 'Empty comment')}
          </span>
        </Button>
      ),
      icon: 'IconMessageCircle'
    },
    {
      title: t('comment.fields.author', 'Author'),
      dataIndex: 'author',
      parser: value => renderAuthor(value),
      icon: 'IconUser'
    },
    {
      title: t('comment.fields.approved', 'Approval'),
      dataIndex: 'approved',
      parser: value =>
        value ? (
          <Badge variant='success'>{t('comment.status.approved', 'Approved')}</Badge>
        ) : (
          <Badge variant='warning'>{t('comment.status.pending', 'Pending')}</Badge>
        ),
      icon: 'IconShieldCheck'
    },
    {
      title: t('comment.fields.reply_to', 'Reply To'),
      dataIndex: 'reply_to',
      parser: value => <span className='font-mono text-xs text-slate-600'>{value || '-'}</span>,
      icon: 'IconCornerDownRight'
    },
    {
      title: t('comment.fields.created_at', 'Created'),
      dataIndex: 'created_at',
      parser: value =>
        value ? (
          <Tooltip content={formatDateTime(value, 'dateTime')}>
            <span>{formatRelativeTime(new Date(value))}</span>
          </Tooltip>
        ) : (
          '-'
        ),
      icon: 'IconCalendarMonth'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Comment) => handleView(record, 'view')
        },
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Comment) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate'),
          icon: 'IconCopy',
          onClick: (record: Comment) =>
            handleView({ ...record, id: undefined, content: record.content || '' }, 'create')
        },
        {
          title: (record: Comment) =>
            record.approved
              ? t('comment.actions.mark_pending', 'Mark Pending')
              : t('comment.actions.approve', 'Approve'),
          icon: (record: Comment) => (record.approved ? 'IconClockPause' : 'IconCircleCheck'),
          onClick: (record: Comment) => handleToggleApproved(record)
        },
        {
          title: t('actions.delete'),
          icon: 'IconTrash',
          onClick: (record: Comment) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};

const renderAuthor = (author: any) => {
  if (!author) return '-';
  if (typeof author === 'string') return author;
  return (
    <div className='min-w-0'>
      <div className='truncate font-medium'>
        {author.name || author.username || author.id || '-'}
      </div>
      {author.email && <div className='truncate text-xs text-slate-500'>{author.email}</div>}
    </div>
  );
};
