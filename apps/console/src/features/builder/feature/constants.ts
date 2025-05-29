import { EntityField } from './service';

// Field types available in the feature builder
export const FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: 'IconType' },
  { value: 'number', label: 'Number Input', icon: 'IconNumber' },
  { value: 'email', label: 'Email Input', icon: 'IconMail' },
  { value: 'password', label: 'Password Input', icon: 'IconLock' },
  { value: 'textarea', label: 'Text Area', icon: 'IconTextPlus' },
  { value: 'select', label: 'Dropdown Select', icon: 'IconSelect' },
  { value: 'multi-select', label: 'Multi Select', icon: 'IconList' },
  { value: 'checkbox', label: 'Checkboxes', icon: 'IconSquareCheck' },
  { value: 'radio', label: 'Radio Buttons', icon: 'IconCircleCheck' },
  { value: 'switch', label: 'Switch Toggle', icon: 'IconToggleRight' },
  { value: 'date', label: 'Date Picker', icon: 'IconCalendar' },
  { value: 'date-range', label: 'Date Range Picker', icon: 'IconCalendarDue' },
  { value: 'uploader', label: 'File Uploader', icon: 'IconCloudUpload' },
  { value: 'hidden', label: 'Hidden Field', icon: 'IconEyeOff' }
];

// Relationship types
export const RELATION_TYPES = [
  {
    value: 'oneToOne',
    label: 'One-to-One',
    icon: 'IconArrowRightBar',
    description: 'Each record in the first table is related to one record in the second table.'
  },
  {
    value: 'oneToMany',
    label: 'One-to-Many',
    icon: 'IconArrowsRight',
    description:
      'Each record in the first table is related to multiple records in the second table.'
  },
  {
    value: 'manyToMany',
    label: 'Many-to-Many',
    icon: 'IconArrowsLeftRight',
    description:
      'Multiple records in the first table are related to multiple records in the second table.'
  }
];

// Default feature configuration
export const DEFAULT_FEATURE_CONFIG = {
  name: 'Product',
  displayName: 'Product',
  pluralName: 'Products',
  description: 'Manage products in the system',
  apiPrefix: '/api',
  hasCustomApi: false,
  hasFiles: false,
  hasPagination: true,
  hasSearch: true,
  hasFilters: true,
  viewModes: ['table', 'grid', 'kanban'],
  defaultViewMode: 'table'
};

// Default entity fields
export const DEFAULT_ENTITY_FIELDS: EntityField[] = [
  {
    id: 'id',
    name: 'id',
    label: 'ID',
    type: 'text',
    required: true,
    isPrimary: true,
    isReadOnly: true,
    isVisible: true,
    showInTable: true,
    showInForm: false,
    validation: null,
    defaultValue: '',
    options: []
  },
  {
    id: 'name',
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    isPrimary: false,
    isReadOnly: false,
    isVisible: true,
    showInTable: true,
    showInForm: true,
    validation: { minLength: 2, maxLength: 50 },
    defaultValue: '',
    options: []
  },
  {
    id: 'status',
    name: 'status',
    label: 'select',
    required: true,
    isPrimary: false,
    isReadOnly: false,
    isVisible: true,
    showInTable: true,
    showInForm: true,
    validation: null,
    defaultValue: 'active',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Draft', value: 'draft' }
    ],
    type: 'select'
  },
  {
    id: 'created_at',
    name: 'created_at',
    label: 'Created At',
    type: 'date',
    required: true,
    isPrimary: false,
    isReadOnly: true,
    isVisible: true,
    showInTable: true,
    showInForm: false,
    validation: null,
    defaultValue: '',
    options: []
  }
];

// Tab names for the builder
export const TAB_NAMES = {
  CONFIG: 'config',
  FIELDS: 'fields',
  RELATIONS: 'relations',
  PREVIEW: 'preview',
  CODE: 'code'
};

// Preview tab names
export const PREVIEW_TAB_NAMES = {
  LIST: 'list',
  CREATE: 'create',
  EDIT: 'edit',
  DETAIL: 'detail'
};

// Validation types for fields
export const VALIDATION_TYPES = [
  { value: 'required', label: 'Required' },
  { value: 'minLength', label: 'Min Length' },
  { value: 'maxLength', label: 'Max Length' },
  { value: 'min', label: 'Min Value' },
  { value: 'max', label: 'Max Value' },
  { value: 'pattern', label: 'Pattern' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'custom', label: 'Custom' }
];

// Common i18n key prefixes
export const I18N_KEYS = {
  COMMON: 'common',
  FEATURE_BUILDER: 'feature_builder',
  ACTIONS: 'actions',
  FORMS: 'forms',
  MESSAGES: 'messages'
};

// Common view modes
export const VIEW_MODES = [
  { value: 'table', label: 'Table', icon: 'IconTable' },
  { value: 'grid', label: 'Grid', icon: 'IconGridDots' },
  { value: 'kanban', label: 'Kanban', icon: 'IconLayoutKanban' },
  { value: 'calendar', label: 'Calendar', icon: 'IconCalendar' }
];
