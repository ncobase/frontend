import { useEffect } from 'react';

import { Button, Container, ScrollView, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ProductEditorForm } from '../../forms/product_editor';
import { useGetProduct, useUpdateProduct } from '../../service';

export const ProductEditPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();
  const { data: product, isLoading } = useGetProduct(slug || '');
  const updateMutation = useUpdateProduct();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<any>();

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const onSubmit = handleSubmit((data: any) => {
    updateMutation.mutate(
      { ...data, id: slug },
      {
        onSuccess: () => {
          toast.success(t('messages.success'), {
            description: t('payment.messages.product_updated', 'Product updated')
          });
          navigate('/pay/products');
        },
        onError: (error: any) => {
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  });

  if (isLoading) {
    return <div className='p-6 text-slate-400'>{t('common.loading', 'Loading...')}</div>;
  }

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-600 font-medium'>
            {t('payment.product.edit_title', 'Edit Product')}
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.save', 'Save')}
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
