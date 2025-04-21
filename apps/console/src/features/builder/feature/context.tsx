import { createContext, useState, ReactNode, useContext } from 'react';

import {
  TAB_NAMES,
  PREVIEW_TAB_NAMES,
  DEFAULT_FEATURE_CONFIG,
  DEFAULT_ENTITY_FIELDS
} from './constants';
import {
  EntityField,
  EntityRelation,
  FeatureConfig,
  generateAllCodeFiles,
  downloadFeatureFiles
} from './service';

// Context interface
interface FeatureBuilderContextType {
  featureConfig: FeatureConfig;
  updateFeatureConfig: (_updates: Partial<FeatureConfig>) => void;

  // Field management
  entityFields: EntityField[];
  addEntityField: () => string;
  updateEntityField: (_fieldId: string, _updates: Partial<EntityField>) => void;
  removeEntityField: (_fieldId: string) => void;
  reorderEntityFields: (_startIndex: number, _endIndex: number) => void;
  activeFieldId: string | null;
  setActiveFieldId: (_fieldId: string | null) => void;

  // Relation management
  entityRelations: EntityRelation[];
  addEntityRelation: () => string;
  updateEntityRelation: (_relationId: string, _updates: Partial<EntityRelation>) => void;
  removeEntityRelation: (_relationId: string) => void;
  activeRelationId: string | null;
  setActiveRelationId: (_relationId: string | null) => void;

  // Tab management
  activeTab: string;
  setActiveTab: (_tab: string) => void;
  previewTab: string;
  setPreviewTab: (_tab: string) => void;

  // Code generation
  generateCode: () => Record<string, string>;
  downloadFeatureZip: () => Promise<void>;
  resetFeatureBuilder: () => void;
}

// Create context
const FeatureBuilderContext = createContext<FeatureBuilderContextType | undefined>(undefined);

// Provider component
export const FeatureBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>(DEFAULT_FEATURE_CONFIG);
  const [entityFields, setEntityFields] = useState<EntityField[]>(DEFAULT_ENTITY_FIELDS);
  const [entityRelations, setEntityRelations] = useState<EntityRelation[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeRelationId, setActiveRelationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TAB_NAMES.CONFIG);
  const [previewTab, setPreviewTab] = useState<string>(PREVIEW_TAB_NAMES.LIST);

  // Update feature configuration
  const updateFeatureConfig = (updates: Partial<FeatureConfig>) => {
    setFeatureConfig(prev => ({ ...prev, ...updates }));
  };

  // Add a new entity field
  const addEntityField = () => {
    const newId = `field_${Date.now()}`;
    const newField: EntityField = {
      id: newId,
      name: `field_${entityFields.length + 1}`,
      label: `Field ${entityFields.length + 1}`,
      type: 'text',
      required: false,
      isPrimary: false,
      isReadOnly: false,
      isVisible: true,
      showInTable: true,
      showInForm: true,
      validation: null,
      defaultValue: '',
      options: []
    };

    setEntityFields(prev => [...prev, newField]);
    setActiveFieldId(newId);
    return newId;
  };

  // Update an entity field
  const updateEntityField = (fieldId: string, updates: Partial<EntityField>) => {
    setEntityFields(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, ...updates } : field))
    );
  };

  // Remove an entity field
  const removeEntityField = (fieldId: string) => {
    setEntityFields(prev => prev.filter(field => field.id !== fieldId));
    if (activeFieldId === fieldId) {
      const remainingFields = entityFields.filter(field => field.id !== fieldId);
      setActiveFieldId(remainingFields.length > 0 ? remainingFields[0].id : null);
    }
  };

  // Reorder entity fields
  const reorderEntityFields = (startIndex: number, endIndex: number) => {
    const result = Array.from(entityFields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setEntityFields(result);
  };

  // Add a new entity relation
  const addEntityRelation = () => {
    const newId = `relation_${Date.now()}`;
    const newRelation: EntityRelation = {
      id: newId,
      name: `relation_${entityRelations.length + 1}`,
      type: 'oneToMany',
      targetEntity: '',
      fieldName: '',
      isRequired: false,
      cascadeDelete: false
    };

    setEntityRelations(prev => [...prev, newRelation]);
    return newId;
  };

  // Update an entity relation
  const updateEntityRelation = (relationId: string, updates: Partial<EntityRelation>) => {
    setEntityRelations(prev =>
      prev.map(relation => (relation.id === relationId ? { ...relation, ...updates } : relation))
    );
  };

  // Remove an entity relation
  const removeEntityRelation = (relationId: string) => {
    setEntityRelations(prev => prev.filter(relation => relation.id !== relationId));
    if (activeRelationId === relationId) {
      const remainingRelations = entityRelations.filter(rel => rel.id !== relationId);
      setActiveRelationId(remainingRelations.length > 0 ? remainingRelations[0].id : null);
    }
  };

  // Generate code for all feature files
  const generateCode = () => {
    return generateAllCodeFiles(featureConfig, entityFields, entityRelations);
  };

  // Download feature as zip file
  const downloadFeatureZip = async () => {
    return downloadFeatureFiles(featureConfig, entityFields, entityRelations);
  };

  // Reset feature builder to defaults
  const resetFeatureBuilder = () => {
    setFeatureConfig(DEFAULT_FEATURE_CONFIG);
    setEntityFields(DEFAULT_ENTITY_FIELDS);
    setEntityRelations([]);
    setActiveFieldId(null);
    setActiveRelationId(null);
    setActiveTab(TAB_NAMES.CONFIG);
    setPreviewTab(PREVIEW_TAB_NAMES.LIST);
  };

  const value = {
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
    addEntityRelation,
    updateEntityRelation,
    removeEntityRelation,
    activeRelationId,
    setActiveRelationId,
    activeTab,
    setActiveTab,
    previewTab,
    setPreviewTab,
    generateCode,
    downloadFeatureZip,
    resetFeatureBuilder
  };

  return <FeatureBuilderContext.Provider value={value}>{children}</FeatureBuilderContext.Provider>;
};

// Custom hook to use the Feature Builder context
export const useFeatureBuilder = (): FeatureBuilderContextType => {
  const context = useContext(FeatureBuilderContext);
  if (context === undefined) {
    throw new Error('useFeatureBuilder must be used within a FeatureBuilderProvider');
  }
  return context;
};
