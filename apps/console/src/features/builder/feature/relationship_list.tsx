import React from 'react';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useFeatureBuilder } from './context';
import { EntityRelation } from './service';

export const RelationshipList: React.FC = () => {
  const { t } = useTranslation();
  const {
    entityRelations,
    addEntityRelation,
    removeEntityRelation,
    featureConfig,
    activeRelationId,
    setActiveRelationId
  } = useFeatureBuilder();

  const handleAddRelation = () => {
    const id = addEntityRelation();
    setActiveRelationId(id);
  };

  // Handle relation reordering (future implementation)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    // Implement reordering logic here if needed
  };

  // Get icon for the relationship type
  const getRelationIcon = (type: string) => {
    switch (type) {
      case 'oneToOne':
        return 'IconArrowRightBar';
      case 'oneToMany':
        return 'IconArrowsRight';
      case 'manyToMany':
        return 'IconArrowsLeftRight';
      default:
        return 'IconLink';
    }
  };

  // Get relationship description
  const getRelationDescription = (relation: EntityRelation) => {
    if (!relation.targetEntity) {
      return t('feature_builder.relations.no_target_entity');
    }

    switch (relation.type) {
      case 'oneToOne':
        return t('feature_builder.relations.one_to_one_short', {
          source: featureConfig.name,
          target: relation.targetEntity
        });
      case 'oneToMany':
        return t('feature_builder.relations.one_to_many_short', {
          source: featureConfig.name,
          target: relation.targetEntity
        });
      case 'manyToMany':
        return t('feature_builder.relations.many_to_many_short', {
          source: featureConfig.name,
          target: relation.targetEntity
        });
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{t('feature_builder.relations.entity_relations')}</CardTitle>
        <Button variant='outline-primary' onClick={handleAddRelation}>
          <Icons name='IconPlus' className='mr-2' />
          {t('feature_builder.actions.add_relation')}
        </Button>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='relations'>
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                {entityRelations.map((relation, index) => (
                  <Draggable key={relation.id} draggableId={relation.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border rounded-md ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        } ${
                          activeRelationId === relation.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white'
                        }`}
                        onClick={() => setActiveRelationId(relation.id)}
                      >
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center'>
                            <div {...provided.dragHandleProps} className='mr-2 cursor-move'>
                              <Icons name='IconGripVertical' className='text-slate-400' />
                            </div>
                            <Icons name={getRelationIcon(relation.type)} className='mr-2' />
                            <div>
                              <h3 className='font-medium'>
                                {relation.name}
                                {relation.isRequired && (
                                  <span className='ml-2 text-xs bg-amber-100 text-amber-800 rounded px-1'>
                                    {t('feature_builder.relations.required')}
                                  </span>
                                )}
                              </h3>
                              <p className='text-sm text-slate-500'>
                                {getRelationDescription(relation)}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              variant={
                                activeRelationId === relation.id ? 'primary' : 'outline-slate'
                              }
                              onClick={() => setActiveRelationId(relation.id)}
                            >
                              {activeRelationId === relation.id
                                ? t('actions.editing')
                                : t('actions.edit')}
                            </Button>
                            <Button
                              size='sm'
                              variant='outline-danger'
                              onClick={e => {
                                e.stopPropagation();
                                removeEntityRelation(relation.id);
                              }}
                            >
                              <Icons name='IconTrash' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {entityRelations.length === 0 && (
                  <div className='p-8 border border-dashed border-slate-300 rounded-md text-center'>
                    <Icons name='IconLink' className='mx-auto mb-2 text-slate-400' size={32} />
                    <p className='text-slate-500 mb-4'>
                      {t('feature_builder.relations.no_relations_description')}
                    </p>
                    <Button variant='outline-primary' onClick={handleAddRelation}>
                      <Icons name='IconPlus' className='mr-2' />
                      {t('feature_builder.relations.add_first_relation')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default RelationshipList;
