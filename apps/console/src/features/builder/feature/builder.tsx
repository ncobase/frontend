import { useState, useEffect } from 'react';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FIELD_TYPES, TAB_NAMES } from './constants';
import { useFeatureBuilder } from './context';
import { FeaturePreview } from './preview';
import { RelationshipEditor } from './relationship_editor';
import { RelationshipList } from './relationship_list';

export const FeatureBuilder = () => {
  const { t } = useTranslation();

  const {
    featureConfig,
    updateFeatureConfig,
    entityFields,
    addEntityField,
    updateEntityField,
    removeEntityField,
    reorderEntityFields,
    activeFieldId,
    setActiveFieldId,
    entityRelations,
    activeRelationId,
    setActiveRelationId,
    activeTab,
    setActiveTab,
    generateCode,
    downloadFeatureZip
  } = useFeatureBuilder();

  // Navigate to fields tab if switching to edit but no field is selected
  useEffect(() => {
    if (activeTab === TAB_NAMES.FIELDS && !activeFieldId && entityFields.length > 0) {
      setActiveFieldId(entityFields[0].id);
    }

    if (activeTab === TAB_NAMES.RELATIONS && !activeRelationId && entityRelations.length > 0) {
      setActiveRelationId(entityRelations[0].id);
    }
  }, [
    activeTab,
    activeFieldId,
    entityFields,
    activeRelationId,
    entityRelations,
    setActiveFieldId,
    setActiveRelationId
  ]);

  // Active field for editing
  const activeField = entityFields.find(field => field.id === activeFieldId);

  // Handle feature config changes
  const handleConfigChange = (field, value) => {
    updateFeatureConfig({
      [field]: value
    });
  };

  // Handle drag end from @hello-pangea/dnd
  const handleDragEnd = result => {
    if (!result.destination) return;

    reorderEntityFields(result.source.index, result.destination.index);
  };

  // Field editor component
  const FieldEditor = () => {
    if (!activeField)
      return (
        <div className='p-4 text-center border border-dashed border-slate-300 rounded'>
          <p className='text-slate-500'>{t('feature_builder.fields.select_field')}</p>
        </div>
      );

    return (
      <div className='space-y-4'>
        <h3 className='text-base font-medium'>
          {t('feature_builder.fields.edit_field')}: {activeField.label}
        </h3>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label>{t('feature_builder.fields.field_name')}</Label>
            <Input
              value={activeField.name}
              onChange={e => updateEntityField(activeField.id, { name: e.target.value })}
              disabled={activeField.isPrimary}
            />
          </div>

          <div>
            <Label>{t('feature_builder.fields.display_label')}</Label>
            <Input
              value={activeField.label}
              onChange={e => updateEntityField(activeField.id, { label: e.target.value })}
            />
          </div>

          <div>
            <Label>{t('feature_builder.fields.field_type')}</Label>
            <Select
              value={activeField.type}
              onValueChange={value => updateEntityField(activeField.id, { type: value })}
              disabled={activeField.isPrimary}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('feature_builder.fields.select_field_type')} />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {t(`feature_builder.fields.types.${type.value}`, type.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('feature_builder.fields.required')}</Label>
            <Select
              value={activeField.required ? 'yes' : 'no'}
              onValueChange={value =>
                updateEntityField(activeField.id, { required: value === 'yes' })
              }
              disabled={activeField.isPrimary}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                <SelectItem value='no'>{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('feature_builder.fields.show_in_table')}</Label>
            <Select
              value={activeField.showInTable ? 'yes' : 'no'}
              onValueChange={value =>
                updateEntityField(activeField.id, { showInTable: value === 'yes' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                <SelectItem value='no'>{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('feature_builder.fields.show_in_form')}</Label>
            <Select
              value={activeField.showInForm ? 'yes' : 'no'}
              onValueChange={value =>
                updateEntityField(activeField.id, { showInForm: value === 'yes' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                <SelectItem value='no'>{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('feature_builder.fields.read_only')}</Label>
            <Select
              value={activeField.isReadOnly ? 'yes' : 'no'}
              onValueChange={value =>
                updateEntityField(activeField.id, { isReadOnly: value === 'yes' })
              }
              disabled={activeField.isPrimary}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                <SelectItem value='no'>{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('feature_builder.fields.default_value')}</Label>
            <Input
              value={activeField.defaultValue}
              onChange={e => updateEntityField(activeField.id, { defaultValue: e.target.value })}
              disabled={activeField.isPrimary || activeField.isReadOnly}
            />
          </div>
        </div>

        {(activeField.type === 'select' ||
          activeField.type === 'radio' ||
          activeField.type === 'checkbox' ||
          activeField.type === 'multi-select') && (
          <div className='mt-4'>
            <Label>{t('feature_builder.fields.options')}</Label>
            <div className='border rounded p-3 mt-1 space-y-2'>
              {activeField.options.map((option, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    value={option.label}
                    onChange={e => {
                      const newOptions = [...activeField.options];
                      newOptions[index].label = e.target.value;
                      updateEntityField(activeField.id, { options: newOptions });
                    }}
                    placeholder={t('feature_builder.fields.option_label')}
                    className='flex-1'
                  />
                  <Input
                    value={option.value}
                    onChange={e => {
                      const newOptions = [...activeField.options];
                      newOptions[index].value = e.target.value;
                      updateEntityField(activeField.id, { options: newOptions });
                    }}
                    placeholder={t('feature_builder.fields.option_value')}
                    className='flex-1'
                  />
                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={() => {
                      const newOptions = [...activeField.options];
                      newOptions.splice(index, 1);
                      updateEntityField(activeField.id, { options: newOptions });
                    }}
                  >
                    <Icons name='IconTrash' />
                  </Button>
                </div>
              ))}
              <Button
                variant='outline-slate'
                size='sm'
                onClick={() => {
                  const newOptions = [
                    ...activeField.options,
                    {
                      label: t('feature_builder.fields.new_option'),
                      value: `option_${activeField.options.length + 1}`
                    }
                  ];
                  updateEntityField(activeField.id, { options: newOptions });
                }}
              >
                <Icons name='IconPlus' className='mr-2' />
                {t('feature_builder.fields.add_option')}
              </Button>
            </div>
          </div>
        )}

        {!activeField.isPrimary && (
          <div className='mt-4 flex justify-end'>
            <Button variant='outline-danger' onClick={() => removeEntityField(activeField.id)}>
              <Icons name='IconTrash' className='mr-2' />
              {t('feature_builder.actions.delete_field')}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Draggable field component
  const DraggableField = ({ field, index }) => {
    return (
      <Draggable draggableId={field.id} index={index} isDragDisabled={field.isPrimary}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`p-4 border rounded-md mb-2 ${snapshot.isDragging ? 'shadow-lg' : ''}
                       ${activeFieldId === field.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
            onClick={() => setActiveFieldId(field.id)}
          >
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                {!field.isPrimary && (
                  <div {...provided.dragHandleProps} className='mr-2 cursor-move'>
                    <Icons name='IconGripVertical' className='text-slate-400' />
                  </div>
                )}
                <Icons
                  name={FIELD_TYPES.find(t => t.value === field.type)?.icon || 'IconForms'}
                  className='mr-2'
                />
                <div>
                  <h3 className='font-medium'>
                    {field.label}
                    {field.isPrimary && (
                      <span className='ml-2 text-xs bg-blue-100 text-blue-800 rounded px-1'>
                        {t('feature_builder.fields.primary')}
                      </span>
                    )}
                    {field.required && !field.isPrimary && (
                      <span className='ml-2 text-xs bg-amber-100 text-amber-800 rounded px-1'>
                        {t('feature_builder.fields.required')}
                      </span>
                    )}
                  </h3>
                  <p className='text-slate-500'>
                    {t(`feature_builder.fields.types.${field.type}`, field.type)} - {field.name}
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant={activeFieldId === field.id ? 'primary' : 'outline-slate'}
                  onClick={() => setActiveFieldId(field.id)}
                >
                  {activeFieldId === field.id ? t('actions.editing') : t('actions.edit')}
                </Button>
                {!field.isPrimary && (
                  <Button
                    size='sm'
                    variant='outline-danger'
                    onClick={e => {
                      e.stopPropagation();
                      removeEntityField(field.id);
                    }}
                  >
                    <Icons name='IconTrash' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Generated code component
  const GeneratedCode = () => {
    const codeFiles = generateCode();
    const [selectedFile, setSelectedFile] = useState(Object.keys(codeFiles)[0]);

    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger className='min-w-[300px]'>
                <SelectValue placeholder={t('feature_builder.code.select_file')} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(codeFiles).map(fileName => (
                  <SelectItem key={fileName} value={fileName}>
                    {fileName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline-slate' onClick={downloadFeatureZip}>
              <Icons name='IconDownload' className='mr-2' />
              {t('feature_builder.actions.download_files')}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className='p-0'>
            <pre className='p-4 bg-slate-900 text-slate-50 rounded overflow-auto max-h-[600px]'>
              {codeFiles[selectedFile]}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>{t('feature_builder.title')}</h1>
        <div className='flex items-center gap-4'>
          <Button
            variant={activeTab === TAB_NAMES.CONFIG ? 'primary' : 'outline-slate'}
            className='py-2.5'
            onClick={() => setActiveTab(TAB_NAMES.CONFIG)}
          >
            <Icons name='IconSettings' className='mr-2' />
            {t('feature_builder.tabs.config')}
          </Button>
          <Button
            variant={activeTab === TAB_NAMES.FIELDS ? 'primary' : 'outline-slate'}
            className='py-2.5'
            onClick={() => setActiveTab(TAB_NAMES.FIELDS)}
          >
            <Icons name='IconForms' className='mr-2' />
            {t('feature_builder.tabs.fields')}
          </Button>
          <Button
            variant={activeTab === TAB_NAMES.RELATIONS ? 'primary' : 'outline-slate'}
            className='py-2.5'
            onClick={() => setActiveTab(TAB_NAMES.RELATIONS)}
          >
            <Icons name='IconLink' className='mr-2' />
            {t('feature_builder.tabs.relations')}
          </Button>
          <Button
            variant={activeTab === TAB_NAMES.PREVIEW ? 'primary' : 'outline-slate'}
            className='py-2.5'
            onClick={() => setActiveTab(TAB_NAMES.PREVIEW)}
          >
            <Icons name='IconEye' className='mr-2' />
            {t('feature_builder.tabs.preview')}
          </Button>
          <Button
            variant={activeTab === TAB_NAMES.CODE ? 'primary' : 'outline-slate'}
            className='py-2.5'
            onClick={() => setActiveTab(TAB_NAMES.CODE)}
          >
            <Icons name='IconCode' className='mr-2' />
            {t('feature_builder.tabs.code')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={TAB_NAMES.CONFIG}>
          <Card>
            <CardHeader>
              <CardTitle>{t('feature_builder.config.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>{t('feature_builder.config.entity_name')}</Label>
                  <Input
                    value={featureConfig.name}
                    onChange={e => handleConfigChange('name', e.target.value)}
                    placeholder={t('feature_builder.config.entity_name_placeholder')}
                  />
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.entity_name_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.display_name')}</Label>
                  <Input
                    value={featureConfig.displayName}
                    onChange={e => handleConfigChange('displayName', e.target.value)}
                    placeholder={t('feature_builder.config.display_name_placeholder')}
                  />
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.display_name_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.plural_name')}</Label>
                  <Input
                    value={featureConfig.pluralName}
                    onChange={e => handleConfigChange('pluralName', e.target.value)}
                    placeholder={t('feature_builder.config.plural_name_placeholder')}
                  />
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.plural_name_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.api_prefix')}</Label>
                  <Input
                    value={featureConfig.apiPrefix}
                    onChange={e => handleConfigChange('apiPrefix', e.target.value)}
                    placeholder='/api'
                  />
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.api_prefix_hint')}
                  </p>
                </div>

                <div className='col-span-2'>
                  <Label>{t('feature_builder.config.description')}</Label>
                  <Input
                    value={featureConfig.description}
                    onChange={e => handleConfigChange('description', e.target.value)}
                    placeholder={t('feature_builder.config.description_placeholder')}
                  />
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.description_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.custom_api')}</Label>
                  <Select
                    value={featureConfig.hasCustomApi ? 'yes' : 'no'}
                    onValueChange={value => handleConfigChange('hasCustomApi', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                      <SelectItem value='no'>{t('common.no')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.custom_api_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.file_uploads')}</Label>
                  <Select
                    value={featureConfig.hasFiles ? 'yes' : 'no'}
                    onValueChange={value => handleConfigChange('hasFiles', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                      <SelectItem value='no'>{t('common.no')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.file_uploads_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.pagination')}</Label>
                  <Select
                    value={featureConfig.hasPagination ? 'yes' : 'no'}
                    onValueChange={value => handleConfigChange('hasPagination', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                      <SelectItem value='no'>{t('common.no')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.pagination_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.search_filters')}</Label>
                  <Select
                    value={featureConfig.hasSearch ? 'yes' : 'no'}
                    onValueChange={value => handleConfigChange('hasSearch', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='yes'>{t('common.yes')}</SelectItem>
                      <SelectItem value='no'>{t('common.no')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.search_filters_hint')}
                  </p>
                </div>

                <div>
                  <Label>{t('feature_builder.config.default_view')}</Label>
                  <Select
                    value={featureConfig.defaultViewMode}
                    onValueChange={value => handleConfigChange('defaultViewMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='table'>
                        {t('feature_builder.config.view_modes.table')}
                      </SelectItem>
                      <SelectItem value='grid'>
                        {t('feature_builder.config.view_modes.grid')}
                      </SelectItem>
                      <SelectItem value='kanban'>
                        {t('feature_builder.config.view_modes.kanban')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-slate-400 mt-2'>
                    {t('feature_builder.config.default_view_hint')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={TAB_NAMES.FIELDS}>
          <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle>{t('feature_builder.fields.title')}</CardTitle>
                  <Button variant='outline-primary' onClick={addEntityField}>
                    <Icons name='IconPlus' className='mr-2' />
                    {t('feature_builder.actions.add_field')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='fields'>
                      {provided => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='space-y-2'
                        >
                          {entityFields.map((field, index) => (
                            <DraggableField key={field.id} field={field} index={index} />
                          ))}
                          {provided.placeholder}

                          {entityFields.length === 0 && (
                            <div className='p-8 border border-dashed border-slate-300 rounded-md text-center'>
                              <Icons
                                name='IconForms'
                                className='mx-auto mb-2 text-slate-400'
                                size={32}
                              />
                              <p className='text-slate-500'>
                                {t('feature_builder.fields.no_fields')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>

            <div className='col-span-1'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('feature_builder.fields.properties')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldEditor />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value={TAB_NAMES.RELATIONS}>
          <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2'>
              <RelationshipList />
            </div>

            <div className='col-span-1'>
              <RelationshipEditor relationId={activeRelationId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value={TAB_NAMES.PREVIEW}>
          <FeaturePreview />
        </TabsContent>

        <TabsContent value={TAB_NAMES.CODE}>
          <GeneratedCode />
        </TabsContent>
      </Tabs>
    </>
  );
};
