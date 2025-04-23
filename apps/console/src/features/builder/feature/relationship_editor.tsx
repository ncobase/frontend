import React, { useEffect } from 'react';

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
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { RELATION_TYPES } from './constants';
import { useFeatureBuilder } from './context';

interface RelationshipEditorProps {
  relationId?: string | null;
}

export const RelationshipEditor: React.FC<RelationshipEditorProps> = ({ relationId }) => {
  const { t } = useTranslation();
  const {
    entityRelations,
    updateEntityRelation,
    removeEntityRelation,
    featureConfig,
    addEntityRelation,
    setActiveRelationId,
    activeRelationId
  } = useFeatureBuilder();

  // Get current relation based on relationId or activeRelationId
  const relation = relationId
    ? entityRelations.find(rel => rel.id === relationId)
    : entityRelations.find(rel => rel.id === activeRelationId);

  // Only call useEffect at the component's top level
  useEffect(() => {
    // Set first relation as active if no active relation exists but relations are present
    if (!activeRelationId && entityRelations.length > 0 && !relationId) {
      setActiveRelationId(entityRelations[0].id);
    }
  }, [activeRelationId, entityRelations, relationId, setActiveRelationId]);

  // Handler for adding new relation
  const handleAddRelation = () => {
    const id = addEntityRelation();
    setActiveRelationId(id);
  };

  // Generate field name - Not a Hook
  const generateFieldName = rel => {
    if (rel && rel.fieldName === '' && rel.targetEntity) {
      let fieldName = '';
      if (rel.type === 'oneToMany' || rel.type === 'manyToMany') {
        // Pluralize collection relationships
        fieldName = rel.targetEntity.toLowerCase() + 's';
      } else {
        fieldName = rel.targetEntity.toLowerCase();
      }
      return fieldName;
    }
    return rel?.fieldName || '';
  };

  // Update field name whenever relation type or target entity changes
  useEffect(() => {
    if (relation && relation.targetEntity && relation.fieldName === '') {
      const fieldName = generateFieldName(relation);
      if (fieldName) {
        updateEntityRelation(relation.id, { fieldName });
      }
    }
  }, [
    relation?.type,
    relation?.targetEntity,
    relation?.id,
    relation?.fieldName,
    updateEntityRelation
  ]);

  // Get inverse relation name - Not a Hook
  const getInverseRelationName = () => {
    if (!relation?.targetEntity || !featureConfig.name) return '';

    if (relation.type === 'oneToOne') {
      return featureConfig.name.toLowerCase();
    } else if (relation.type === 'oneToMany') {
      return featureConfig.name.toLowerCase();
    } else if (relation.type === 'manyToMany') {
      // Pluralize many-to-many relationships
      return (featureConfig.pluralName || featureConfig.name + 's').toLowerCase();
    }
    return '';
  };

  // Display empty state if no relation is selected
  if (!relation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('feature_builder.relations.editor_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='p-8 border border-dashed border-slate-300 rounded-md text-center'>
            <Icons name='IconLink' className='mx-auto mb-2 text-slate-400' size={32} />
            {entityRelations.length === 0 ? (
              <>
                <p className='text-slate-500 mb-4'>{t('feature_builder.relations.no_relations')}</p>
                <Button onClick={handleAddRelation}>
                  <Icons name='IconPlus' className='mr-2' />
                  {t('feature_builder.relations.add_relation')}
                </Button>
              </>
            ) : (
              <p className='text-slate-500'>{t('feature_builder.relations.select_relation')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render relationship editor
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>
          {t('feature_builder.relations.edit_relation')}: {relation.name}
        </CardTitle>
        <div className='flex gap-2'>
          <Button variant='outline-danger' onClick={() => removeEntityRelation(relation.id)}>
            <Icons name='IconTrash' className='mr-2' />
            {t('feature_builder.actions.delete')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>{t('feature_builder.relations.relation_name')}</Label>
              <Input
                value={relation.name}
                onChange={e => updateEntityRelation(relation.id, { name: e.target.value })}
                placeholder={t('feature_builder.relations.relation_name_placeholder')}
              />
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.relation_name_hint')}
              </p>
            </div>

            <div>
              <Label>{t('feature_builder.relations.relation_type')}</Label>
              <Select
                value={relation.type}
                onValueChange={value =>
                  updateEntityRelation(relation.id, {
                    type: value as 'oneToOne' | 'oneToMany' | 'manyToMany'
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('feature_builder.relations.select_type')} />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {t(`feature_builder.relations.types.${type.value}`, type.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.relation_type_hint')}
              </p>
            </div>

            <div>
              <Label>{t('feature_builder.relations.target_entity')}</Label>
              <Input
                value={relation.targetEntity}
                onChange={e => updateEntityRelation(relation.id, { targetEntity: e.target.value })}
                placeholder={t('feature_builder.relations.target_entity_placeholder')}
              />
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.target_entity_hint')}
              </p>
            </div>

            <div>
              <Label>{t('feature_builder.relations.field_name')}</Label>
              <Input
                value={relation.fieldName}
                onChange={e => updateEntityRelation(relation.id, { fieldName: e.target.value })}
                placeholder={t('feature_builder.relations.field_name_placeholder')}
              />
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.field_name_hint')}
              </p>
            </div>

            <div>
              <Label>{t('feature_builder.relations.required')}</Label>
              <Select
                value={relation.isRequired ? 'yes' : 'no'}
                onValueChange={value =>
                  updateEntityRelation(relation.id, {
                    isRequired: value === 'yes'
                  })
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
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.relation_required_hint')}
              </p>
            </div>

            <div>
              <Label>{t('feature_builder.relations.cascade_delete')}</Label>
              <Select
                value={relation.cascadeDelete ? 'yes' : 'no'}
                onValueChange={value =>
                  updateEntityRelation(relation.id, {
                    cascadeDelete: value === 'yes'
                  })
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
              <p className='text-xs text-slate-400 mt-2'>
                {t('feature_builder.relations.cascade_delete_hint')}
              </p>
            </div>
          </div>

          <div className='mt-4'>
            <Tabs defaultValue='preview'>
              <TabsList>
                <TabsTrigger value='preview'>
                  {t('feature_builder.relations.relationship_preview')}
                </TabsTrigger>
                <TabsTrigger value='code'>
                  {t('feature_builder.relations.relationship_code')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='preview'>
                <div className='p-4 border border-slate-200 rounded-md bg-slate-50 mt-2'>
                  <div className='font-medium mb-2'>
                    {relation.type === 'oneToOne' && (
                      <div className='flex items-center gap-2'>
                        <div className='p-2 bg-white rounded shadow border'>
                          {featureConfig.name}
                        </div>
                        <Icons name='IconArrowLeftRight' />
                        <div className='p-2 bg-white rounded shadow border'>
                          {relation.targetEntity || t('feature_builder.relations.target_entity')}
                        </div>
                      </div>
                    )}
                    {relation.type === 'oneToMany' && (
                      <div className='flex items-center gap-2'>
                        <div className='p-2 bg-white rounded shadow border'>
                          {featureConfig.name}
                        </div>
                        <Icons name='IconArrowsRight' />
                        <div className='p-2 bg-white rounded shadow border'>
                          {relation.targetEntity || t('feature_builder.relations.target_entity')}
                        </div>
                      </div>
                    )}
                    {relation.type === 'manyToMany' && (
                      <div className='flex items-center gap-2'>
                        <div className='p-2 bg-white rounded shadow border'>
                          {featureConfig.name}
                        </div>
                        <Icons name='IconArrowsLeftRight' />
                        <div className='p-2 bg-white rounded shadow border'>
                          {relation.targetEntity || t('feature_builder.relations.target_entity')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='mt-4 text-sm text-slate-600'>
                    <h4 className='font-medium mb-2'>
                      {t('feature_builder.relations.relationship_description')}:
                    </h4>
                    {relation.type === 'oneToOne' && (
                      <p>
                        {t('feature_builder.relations.one_to_one_desc_template', {
                          source: featureConfig.name,
                          target:
                            relation.targetEntity || t('feature_builder.relations.target_entity')
                        })}
                      </p>
                    )}
                    {relation.type === 'oneToMany' && (
                      <p>
                        {t('feature_builder.relations.one_to_many_desc_template', {
                          source: featureConfig.name,
                          target:
                            relation.targetEntity || t('feature_builder.relations.target_entity')
                        })}
                      </p>
                    )}
                    {relation.type === 'manyToMany' && (
                      <p>
                        {t('feature_builder.relations.many_to_many_desc_template', {
                          source: featureConfig.name,
                          target:
                            relation.targetEntity || t('feature_builder.relations.target_entity')
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='code'>
                <div className='p-4 border border-slate-200 rounded-md bg-slate-50 mt-2'>
                  <div className='text-sm font-mono'>
                    <div className='mb-2'>
                      <span className='font-medium text-slate-600'>
                        // {t('feature_builder.relations.entity_definition')}:
                      </span>
                      <div className='bg-slate-100 p-2 rounded mt-1'>
                        <code>
                          {relation.type === 'oneToOne' && (
                            <>
                              {featureConfig.name}.{relation.name}:{' '}
                              {relation.targetEntity || 'TargetEntity'}
                              {relation.isRequired ? '' : '?'};
                            </>
                          )}
                          {relation.type === 'oneToMany' && (
                            <>
                              {featureConfig.name}.{relation.name}:{' '}
                              {relation.targetEntity || 'TargetEntity'}[]
                              {relation.isRequired ? '' : '?'};
                            </>
                          )}
                          {relation.type === 'manyToMany' && (
                            <>
                              {featureConfig.name}.{relation.name}:{' '}
                              {relation.targetEntity || 'TargetEntity'}[]
                              {relation.isRequired ? '' : '?'};
                            </>
                          )}
                        </code>
                      </div>
                    </div>

                    <div>
                      <span className='font-medium text-slate-600'>
                        // {t('feature_builder.relations.inverse_definition')}:
                      </span>
                      <div className='bg-slate-100 p-2 rounded mt-1'>
                        <code>
                          {relation.type === 'oneToOne' && (
                            <>
                              {relation.targetEntity || 'TargetEntity'}.
                              {relation.fieldName || getInverseRelationName()}: {featureConfig.name}
                              ;
                            </>
                          )}
                          {relation.type === 'oneToMany' && (
                            <>
                              {relation.targetEntity || 'TargetEntity'}.
                              {relation.fieldName || getInverseRelationName()}: {featureConfig.name}
                              ;
                            </>
                          )}
                          {relation.type === 'manyToMany' && (
                            <>
                              {relation.targetEntity || 'TargetEntity'}.
                              {relation.fieldName || getInverseRelationName()}: {featureConfig.name}
                              [];
                            </>
                          )}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipEditor;
