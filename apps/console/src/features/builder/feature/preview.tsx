import React from 'react';

import {
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Switch,
  Button,
  Icons,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  ScrollView,
  Label,
  Container,
  CardHeader
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PREVIEW_TAB_NAMES } from './constants';
import { useFeatureBuilder } from './context';

export const FeaturePreview: React.FC = () => {
  const { t } = useTranslation();
  const { featureConfig, entityFields, entityRelations, previewTab, setPreviewTab } =
    useFeatureBuilder();

  // Check if there is valid data to preview
  if (!featureConfig.name) {
    return (
      <Card>
        <CardContent>
          <div className='p-8 text-center'>
            <Icons name='IconInfoCircle' className='mx-auto mb-2 text-blue-500' size={32} />
            <p className='text-slate-600 mb-2'>{t('feature_builder.preview.configure_first')}</p>
            <p className='text-slate-500'>{t('feature_builder.preview.complete_config_hint')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderFormField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <div key={field.id} className='space-y-1'>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={t('forms.placeholders.enter', { field: field.label.toLowerCase() })}
              disabled={field.isReadOnly}
              defaultValue={field.defaultValue || ''}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className='space-y-1 col-span-2'>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={t('forms.placeholders.enter', { field: field.label.toLowerCase() })}
              disabled={field.isReadOnly}
              defaultValue={field.defaultValue || ''}
            />
          </div>
        );
      case 'select':
      case 'multi-select':
        return (
          <div key={field.id} className='space-y-1'>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <Select defaultValue={field.defaultValue || ''}>
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={t('forms.placeholders.select', { field: field.label.toLowerCase() })}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options &&
                  field.options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className='space-y-1 col-span-2'>
            <Label>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <div className='space-y-2'>
              {field.options &&
                field.options.map((option: any) => (
                  <div key={option.value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`${field.name}-${option.value}`}
                      defaultChecked={field.defaultValue === option.value}
                    />
                    <Label htmlFor={`${field.name}-${option.value}`} className='font-normal'>
                      {option.label}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className='space-y-1 col-span-2'>
            <Label>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <div className='space-y-2'>
              {field.options &&
                field.options.map((option: any) => (
                  <div key={option.value} className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      id={`${field.name}-${option.value}`}
                      name={field.name}
                      value={option.value}
                      defaultChecked={field.defaultValue === option.value}
                    />
                    <Label htmlFor={`${field.name}-${option.value}`} className='font-normal'>
                      {option.label}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        );
      case 'switch':
        return (
          <div key={field.id} className='flex items-center justify-between space-y-0'>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <Switch id={field.name} defaultChecked={field.defaultValue === 'true'} />
          </div>
        );
      case 'date':
        return (
          <div key={field.id} className='space-y-1'>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </Label>
            <Input
              id={field.name}
              type='date'
              disabled={field.isReadOnly}
              defaultValue={field.defaultValue || ''}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderDetailField = (field: any) => {
    return (
      <div key={field.id} className={field.type === 'textarea' ? 'col-span-2' : ''}>
        <div className='font-medium text-slate-500'>{field.label}</div>
        <div className='mt-1'>
          {field.type === 'select' && field.options && field.options.length > 0
            ? field.options.find((o: any) => o.value === field.defaultValue)?.label || '-'
            : field.defaultValue || '-'}
        </div>
      </div>
    );
  };

  // Render relationship field in detail view
  const renderRelationField = (relation: any) => {
    return (
      <div key={relation.id} className='col-span-2'>
        <div className='font-medium text-slate-500'>{relation.name}</div>
        <div className='mt-1 flex items-center'>
          {relation.type === 'oneToOne' ? (
            <div className='text-blue-600 hover:underline cursor-pointer'>
              {relation.targetEntity} #1
            </div>
          ) : (
            <div className='rounded p-2 w-full'>
              <div className='flex justify-between items-center mb-2'>
                <span>{relation.targetEntity} Items</span>
                <Button size='xs' variant='outline-primary'>
                  <Icons name='IconPlus' size={14} className='mr-1' />
                  {t('feature_builder.preview.add')}
                </Button>
              </div>
              <div className='space-y-1'>
                <div className='flex justify-between bg-slate-50 p-1 rounded'>
                  <span className='text-blue-600 hover:underline cursor-pointer'>
                    {relation.targetEntity} #1
                  </span>
                  <Button size='xs' variant='outline-danger'>
                    <Icons name='IconTrash' size={14} />
                  </Button>
                </div>
                <div className='flex justify-between bg-slate-50 p-1 rounded'>
                  <span className='text-blue-600 hover:underline cursor-pointer'>
                    {relation.targetEntity} #2
                  </span>
                  <Button size='xs' variant='outline-danger'>
                    <Icons name='IconTrash' size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const tableFields = entityFields.filter(field => field.showInTable);
    const displayName = featureConfig.displayName || featureConfig.name;

    return (
      <div className='rounded-md overflow-hidden'>
        <div className='bg-slate-100 p-4 flex justify-between items-center'>
          <h3 className='font-medium'>
            {displayName} {t('feature_builder.preview.list_view')}
          </h3>
          <Button size='sm'>
            <Icons name='IconPlus' className='mr-2' size={16} />
            {t('feature_builder.preview.create')} {displayName}
          </Button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50'>
                {tableFields.map(field => (
                  <th
                    key={field.id}
                    className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                  >
                    {field.label}
                  </th>
                ))}
                <th className='px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  {t('actions.title')}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {[1, 2, 3].map(item => (
                <tr key={item} className='hover:bg-slate-50'>
                  {tableFields.map(field => (
                    <td key={field.id} className='px-4 py-3'>
                      {field.isPrimary ? (
                        <a href='#' className='text-blue-600 hover:underline'>
                          {field.name === 'id' ? `${item}` : `Example ${field.name} ${item}`}
                        </a>
                      ) : field.type === 'select' && field.options && field.options.length > 0 ? (
                        field.options[item % field.options.length]?.label || 'Option'
                      ) : field.type === 'date' ? (
                        `2023-0${item}-0${item + 1}`
                      ) : (
                        `Example ${field.name} ${item}`
                      )}
                    </td>
                  ))}
                  <td className='px-4 py-3 text-right space-x-1'>
                    <Button variant='outline-slate' size='xs'>
                      <Icons name='IconEye' size={14} />
                    </Button>
                    <Button variant='outline-slate' size='xs'>
                      <Icons name='IconPencil' size={14} />
                    </Button>
                    <Button variant='outline-danger' size='xs'>
                      <Icons name='IconTrash' size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='bg-slate-50 p-3 flex justify-between items-center border-t border-slate-200'>
          <div className='text-slate-500'>
            {t('feature_builder.preview.showing')} 1-3 {t('feature_builder.preview.of')} 3{' '}
            {t('feature_builder.preview.items')}
          </div>
          <div className='flex space-x-1'>
            <Button variant='outline-slate' size='sm' disabled>
              <Icons name='IconChevronLeft' size={14} />
            </Button>
            <Button variant='outline-primary' size='sm'>
              1
            </Button>
            <Button variant='outline-slate' size='sm' disabled>
              <Icons name='IconChevronRight' size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateForm = () => {
    const formFields = entityFields.filter(field => field.showInForm && !field.isReadOnly);
    const displayName = featureConfig.displayName || featureConfig.name;

    // Get relationships that can be shown on the form (typically oneToOne or manyToOne relationships)
    const formRelations = entityRelations.filter(rel => rel.type === 'oneToOne');

    return (
      <div className='rounded-md overflow-hidden'>
        <div className='bg-slate-100 p-4'>
          <h3 className='font-medium'>
            {t('feature_builder.preview.create')} {displayName}
          </h3>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-2 gap-4'>
            {formFields.map(renderFormField)}

            {/* Render relationship selects */}
            {formRelations.map(relation => (
              <div key={relation.id} className='space-y-1'>
                <Label htmlFor={relation.name}>
                  {relation.name}
                  {relation.isRequired && <span className='text-red-500'>*</span>}
                </Label>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder={t('forms.placeholders.select', {
                        field: relation.name.toLowerCase()
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>{relation.targetEntity} #1</SelectItem>
                    <SelectItem value='2'>{relation.targetEntity} #2</SelectItem>
                    <SelectItem value='3'>{relation.targetEntity} #3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className='mt-6 flex justify-end space-x-2'>
            <Button variant='outline-slate'>{t('actions.cancel')}</Button>
            <Button>{t('actions.submit')}</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    const formFields = entityFields.filter(field => field.showInForm);
    const displayName = featureConfig.displayName || featureConfig.name;

    // Get relationships that can be shown on the form (typically oneToOne or manyToOne relationships)
    const formRelations = entityRelations.filter(rel => rel.type === 'oneToOne');

    return (
      <div className='rounded-md overflow-hidden'>
        <div className='bg-slate-100 p-4'>
          <h3 className='font-medium'>
            {t('feature_builder.preview.edit')} {displayName}
          </h3>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-2 gap-4'>
            {formFields.map(renderFormField)}

            {/* Render relationship selects */}
            {formRelations.map(relation => (
              <div key={relation.id} className='space-y-1'>
                <Label htmlFor={relation.name}>
                  {relation.name}
                  {relation.isRequired && <span className='text-red-500'>*</span>}
                </Label>
                <Select defaultValue='1'>
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder={t('forms.placeholders.select', {
                        field: relation.name.toLowerCase()
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>{relation.targetEntity} #1</SelectItem>
                    <SelectItem value='2'>{relation.targetEntity} #2</SelectItem>
                    <SelectItem value='3'>{relation.targetEntity} #3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className='mt-6 flex justify-end space-x-2'>
            <Button variant='outline-slate'>{t('actions.cancel')}</Button>
            <Button>{t('feature_builder.preview.save_changes')}</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    const visibleFields = entityFields.filter(field => field.isVisible);
    const displayName = featureConfig.displayName || featureConfig.name;

    return (
      <div className='rounded-md overflow-hidden'>
        <div className='bg-slate-100 p-4 flex justify-between items-center'>
          <h3 className='font-medium'>
            {displayName} {t('feature_builder.preview.detail_view')}
          </h3>
          <div className='space-x-2'>
            <Button variant='outline-primary' size='sm'>
              <Icons name='IconPencil' className='mr-2' size={16} />
              {t('actions.edit')}
            </Button>
            <Button variant='outline-danger' size='sm'>
              <Icons name='IconTrash' className='mr-2' size={16} />
              {t('actions.delete')}
            </Button>
          </div>
        </div>

        <div className='p-6'>
          <div className='flex items-center border-b border-slate-100 pb-4 mb-4'>
            <div className='bg-blue-500 w-1 self-stretch mr-2'></div>
            <h4 className='font-medium text-slate-800'>
              {t('feature_builder.preview.basic_info')}
            </h4>
          </div>

          <div className='grid grid-cols-2 gap-4'>{visibleFields.map(renderDetailField)}</div>

          {/* Render relations section if any exist */}
          {entityRelations.length > 0 && (
            <>
              <div className='flex items-center border-b border-slate-100 pb-4 mb-4 mt-6'>
                <div className='bg-blue-500 w-1 self-stretch mr-2'></div>
                <h4 className='font-medium text-slate-800'>
                  {t('feature_builder.preview.related_entities')}
                </h4>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {entityRelations.map(renderRelationField)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <Tabs value={previewTab} onValueChange={setPreviewTab} asChild>
          <TabsList className='w-full justify-start'>
            <TabsTrigger value={PREVIEW_TAB_NAMES.LIST}>
              {t('feature_builder.preview.list_view')}
            </TabsTrigger>
            <TabsTrigger value={PREVIEW_TAB_NAMES.CREATE}>
              {t('feature_builder.preview.create_form')}
            </TabsTrigger>
            <TabsTrigger value={PREVIEW_TAB_NAMES.EDIT}>
              {t('feature_builder.preview.edit_form')}
            </TabsTrigger>
            <TabsTrigger value={PREVIEW_TAB_NAMES.DETAIL}>
              {t('feature_builder.preview.detail_view')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollView className='py-4'>
          <Container>
            {previewTab === PREVIEW_TAB_NAMES.LIST && renderListView()}
            {previewTab === PREVIEW_TAB_NAMES.CREATE && renderCreateForm()}
            {previewTab === PREVIEW_TAB_NAMES.EDIT && renderEditForm()}
            {previewTab === PREVIEW_TAB_NAMES.DETAIL && renderDetailView()}
            {/* Fallback content if no tab is selected */}
            {!previewTab && renderListView()}
          </Container>
        </ScrollView>
      </CardContent>
    </Card>
  );
};

export default FeaturePreview;
