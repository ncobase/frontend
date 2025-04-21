import { FeatureBuilder } from './builder';
import {
  FIELD_TYPES,
  RELATION_TYPES,
  DEFAULT_FEATURE_CONFIG,
  DEFAULT_ENTITY_FIELDS,
  TAB_NAMES,
  PREVIEW_TAB_NAMES,
  VALIDATION_TYPES,
  I18N_KEYS,
  VIEW_MODES
} from './constants';
import { FeatureBuilderProvider, useFeatureBuilder } from './context';
import { FeaturePreview } from './preview';
import { RelationshipEditor } from './relationship_editor';
import { RelationshipList } from './relationship_list';
import {
  EntityField,
  EntityRelation,
  FeatureConfig,
  generateAllCodeFiles,
  downloadFeatureFiles,
  generateEntityCode,
  generateApiCode,
  generateFormFieldsCode,
  generateTableColumnsCode,
  generateServiceCode,
  generateRelationsServiceCode,
  generatePagesCode,
  generateRoutesCode
} from './service';
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  pluralize,
  getI18nKey,
  createDefaultOptions,
  isValidVariableName,
  sanitizeVariableName,
  getRelationshipTypeColor
} from './utils';

export {
  // Main components
  FeatureBuilder,
  FeatureBuilderProvider,
  FeaturePreview,
  RelationshipEditor,
  RelationshipList,

  // Custom hooks
  useFeatureBuilder,

  // Interfaces and types
  type EntityField,
  type EntityRelation,
  type FeatureConfig,

  // Generator functions
  generateAllCodeFiles,
  downloadFeatureFiles,
  generateEntityCode,
  generateApiCode,
  generateFormFieldsCode,
  generateTableColumnsCode,
  generateServiceCode,
  generateRelationsServiceCode,
  generatePagesCode,
  generateRoutesCode,

  // Constants
  FIELD_TYPES,
  RELATION_TYPES,
  DEFAULT_FEATURE_CONFIG,
  DEFAULT_ENTITY_FIELDS,
  TAB_NAMES,
  PREVIEW_TAB_NAMES,
  VALIDATION_TYPES,
  I18N_KEYS,
  VIEW_MODES,

  // Utility functions
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  pluralize,
  getI18nKey,
  createDefaultOptions,
  isValidVariableName,
  sanitizeVariableName,
  getRelationshipTypeColor
};

// Export main page component
export { FeatureBuilderPage } from './feature_builder_page';
