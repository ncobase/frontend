import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';
import { useSpaceContext } from '@/features/space/context';

export const CreateCommentForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { space_id } = useSpaceContext();

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
      title: '所属空间',
      name: 'space_id',
      defaultValue: space_id,
      type: 'hidden'
    }
  ];

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
