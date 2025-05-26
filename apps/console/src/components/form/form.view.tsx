import { Button, Container, FieldConfigProps, Form, Icons, ScrollView } from '@ncobase/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormTopbar, FormTopbarProps } from './form.topbar';

interface FormViewProps extends FormTopbarProps {
  onSubmit?: SubmitHandler<FieldValues>;
  topbar?: boolean;
  fields?: FieldConfigProps[];
}

export const FormView: React.FC<FormViewProps> = ({ title, topbar = true, onSubmit, fields }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <>
      {topbar && (
        <FormTopbar
          title={title}
          left={[
            <Button variant='outline-slate' onClick={() => history.back()}>
              <Icons name='IconArrowLeft' />
            </Button>
          ]}
          right={[
            <Button variant='outline-slate' onClick={() => history.back()}>
              {t('actions.cancel')}
            </Button>,
            <Button onClick={handleSubmit(onSubmit)}>{t('actions.submit')}</Button>
          ]}
        />
      )}
      <ScrollView className='py-4'>
        <Container className='max-w-7xl'>
          <Form
            control={control}
            fields={fields}
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
          />
        </Container>
      </ScrollView>
    </>
  );
};
