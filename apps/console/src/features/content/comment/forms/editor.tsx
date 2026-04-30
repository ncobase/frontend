import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryComment } from '../service';

export const EditorCommentForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryComment(record);

  const fields: FieldConfigProps[] = [
    {
      title: t('comment.fields.content', 'Content'),
      name: 'content',
      defaultValue: '',
      placeholder: t('comment.placeholders.content', 'Write the comment content'),
      type: 'textarea',
      className: 'col-span-full',
      rules: { required: t('forms.input_required') }
    },
    {
      title: t('comment.fields.reply_to', 'Reply To'),
      name: 'reply_to',
      defaultValue: '',
      type: 'text',
      placeholder: t('comment.placeholders.reply_to', 'Comment ID to reply to')
    },
    {
      title: t('comment.fields.parent', 'Parent'),
      name: 'parent',
      defaultValue: '',
      type: 'text',
      placeholder: t('comment.placeholders.parent', 'Parent thread ID')
    },
    {
      title: t('comment.fields.approved', 'Approved'),
      name: 'approved',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: '创建时间',
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: '更新时间',
      name: 'updated_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: '扩展字段',
      name: 'extras',
      defaultValue: [],
      type: 'hidden'
    }
  ];

  useEffect(() => {
    if (!data) return;
    setValue('id', data?.id);
    setValue('content', data?.content);
    setValue('reply_to', data?.reply_to);
    setValue('parent', data?.parent);
    setValue('approved', data?.approved);
    setValue('extras', data?.extras);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
  }, [setValue, data]);

  return (
    <Form
      id='create-user'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
