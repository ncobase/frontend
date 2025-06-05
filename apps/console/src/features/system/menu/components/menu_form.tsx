import { InputField, SelectField, Switch, Button } from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const MenuForm = ({ menu, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: menu || {
      type: 'sidebar',
      target: '_self',
      hidden: false,
      disabled: false,
      order: 0
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Controller
          name='name'
          control={control}
          rules={{ required: t('forms.input_required') }}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.name')}
              placeholder={t('menu.placeholders.name')}
              error={errors.name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='label'
          control={control}
          rules={{ required: t('forms.input_required') }}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.label')}
              placeholder={t('menu.placeholders.label')}
              error={errors.label?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='slug'
          control={control}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.slug')}
              placeholder={t('menu.placeholders.slug')}
              {...field}
            />
          )}
        />

        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <SelectField
              label={t('menu.fields.type')}
              options={[
                { label: t('menu.types.header'), value: 'header' },
                { label: t('menu.types.sidebar'), value: 'sidebar' },
                { label: t('menu.types.account'), value: 'account' },
                { label: t('menu.types.tenant'), value: 'tenant' }
              ]}
              {...field}
            />
          )}
        />

        <Controller
          name='path'
          control={control}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.path')}
              placeholder={t('menu.placeholders.path')}
              {...field}
            />
          )}
        />

        <Controller
          name='icon'
          control={control}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.icon')}
              placeholder={t('menu.placeholders.icon')}
              {...field}
            />
          )}
        />

        <Controller
          name='perms'
          control={control}
          render={({ field }) => (
            <InputField
              label={t('menu.fields.perms')}
              placeholder={t('menu.placeholders.perms')}
              description={t('menu.fields.perms_hint')}
              {...field}
            />
          )}
        />

        <Controller
          name='order'
          control={control}
          render={({ field }) => (
            <InputField
              type='number'
              label={t('menu.fields.order')}
              placeholder={t('menu.placeholders.order')}
              {...field}
            />
          )}
        />
      </div>

      <div className='flex items-center space-x-6'>
        <Controller
          name='hidden'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex items-center space-x-2'>
              <Switch checked={value} onCheckedChange={onChange} />
              <span>{t('menu.fields.hidden')}</span>
            </div>
          )}
        />

        <Controller
          name='disabled'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex items-center space-x-2'>
              <Switch checked={value} onCheckedChange={onChange} />
              <span>{t('menu.fields.disabled')}</span>
            </div>
          )}
        />
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button type='submit'>{menu?.id ? t('actions.update') : t('actions.create')}</Button>
      </div>
    </form>
  );
};
