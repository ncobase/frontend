import { Button, Container, ScrollView, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ProductEditorForm } from '../../forms/product_editor';
import { useCreateProduct } from '../../service';

export const ProductCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();
  const createMutation = useCreateProduct();

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<any>();

  const onSubmit = handleSubmit((data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('messages.success'), {
          description: t('payment.messages.product_created', 'Product created')
        });
        navigate('/pay/products');
      },
      onError: (error: any) => {
        toast.error(t('messages.error'), {
          description: error?.message || t('messages.unknown_error')
        });
      }
    });
  });

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-600 font-medium'>
            {t('payment.product.create_title', 'Create Product')}
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.submit', 'Submit')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <ProductEditorForm onSubmit={onSubmit} control={control} errors={errors} />
        </Container>
      </ScrollView>
    </>
  );
};
