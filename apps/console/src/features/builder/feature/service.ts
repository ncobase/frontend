import { useState } from 'react';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export interface FeatureConfig {
  name: string;
  displayName: string;
  pluralName: string;
  description: string;
  apiPrefix: string;
  hasCustomApi: boolean;
  hasFiles: boolean;
  hasPagination: boolean;
  hasSearch: boolean;
  hasFilters: boolean;
  viewModes: string[];
  defaultViewMode: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface ValidationRule {
  type: string;
  value: any;
  message?: string;
}

export interface EntityField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  isPrimary: boolean;
  isReadOnly: boolean;
  isVisible: boolean;
  showInTable: boolean;
  showInForm: boolean;
  validation: any;
  defaultValue: any;
  options: FieldOption[];
}

export interface EntityRelation {
  id: string;
  name: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToMany';
  targetEntity: string;
  fieldName: string;
  isRequired: boolean;
  cascadeDelete: boolean;
}

export interface GeneratedCode {
  entity: string;
  api: string;
  service: string;
  formFields: string;
  tableColumns: string;
  queryFields: string;
  listPage: string;
  createPage: string;
  editPage: string;
  viewPage: string;
  routes: string;
  relationsService: string;
}

export const getTypeScriptType = (fieldType: string): string => {
  const typeMap: Record<string, string> = {
    text: 'string',
    textarea: 'string',
    email: 'string',
    password: 'string',
    number: 'number',
    date: 'string',
    'date-range': '{ from: string; to: string }',
    select: 'string',
    'multi-select': 'string[]',
    checkbox: 'string[]',
    radio: 'string',
    switch: 'boolean',
    uploader: 'string',
    hidden: 'string'
  };
  return typeMap[fieldType] || 'any';
};

export const getIconForType = (fieldType: string): string => {
  const iconMap: Record<string, string> = {
    text: 'IconType',
    textarea: 'IconTextPlus',
    email: 'IconMail',
    password: 'IconLock',
    number: 'IconNumber',
    date: 'IconCalendar',
    'date-range': 'IconCalendarDue',
    select: 'IconSelect',
    'multi-select': 'IconList',
    checkbox: 'IconSquareCheck',
    radio: 'IconCircleCheck',
    switch: 'IconToggleRight',
    uploader: 'IconCloudUpload',
    hidden: 'IconEyeOff',
    id: 'IconHash',
    status: 'IconStatusChange'
  };
  return iconMap[fieldType] || 'IconForms';
};

export const generateEntityCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): string => {
  const code = `export interface ${featureConfig.name} {
${entityFields.map(field => `  ${field.name}${!field.required ? '?' : ''}: ${getTypeScriptType(field.type)};`).join('\n')}
${entityRelations
  .map(relation => {
    if (relation.type === 'oneToMany' || relation.type === 'manyToMany') {
      return `  ${relation.name}${!relation.isRequired ? '?' : ''}: ${relation.targetEntity}[];`;
    } else {
      return `  ${relation.name}${!relation.isRequired ? '?' : ''}: ${relation.targetEntity};`;
    }
  })
  .join('\n')}
}

export interface ${featureConfig.name}ListParams extends PaginationParams {
  status?: string | number;
  search?: string;
${entityFields
  .filter(field => field.type === 'select' || field.isPrimary)
  .map(field => `  ${field.name}?: ${getTypeScriptType(field.type)};`)
  .join('\n')}
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sort?: string;
  order?: 'asc' | 'desc';
}
`;
  return code;
};

export const generateApiCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[],
  hasCustomEndpoints: boolean
): string => {
  const name = featureConfig.name;
  const lowerName = name.toLowerCase();
  const plural = featureConfig.pluralName || `${lowerName}s`;
  const endpointPath = `${featureConfig.apiPrefix || '/api'}/${plural}`;

  let code = `import { ${name} } from './${lowerName}';
import { createApi } from '@/lib/api/factory';

export const ${lowerName}Api = createApi<${name}>('${endpointPath}'${hasCustomEndpoints ? ', {' : ''}`;

  if (hasCustomEndpoints) {
    code += `
  extensions: ({ endpoint, request }) => ({
    // Custom endpoints
    search${plural}: async (query: string): Promise<${name}[]> => {
      return request.get(\`\${endpoint}/search?q=\${encodeURIComponent(query)}\`);
    },

    // Example of a custom action endpoint
    toggle${name}Status: async (id: string): Promise<${name}> => {
      return request.put(\`\${endpoint}/\${id}/toggle-status\`);
    }${
      featureConfig.hasFiles
        ? `,

    // File upload endpoint
    upload${name}File: async (id: string, file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      return request.post(\`\${endpoint}/\${id}/upload\`, formData);
    }`
        : ''
    }`;

    // Generate relationship endpoints if there are relationships
    if (entityRelations.length > 0) {
      entityRelations.forEach(relation => {
        if (relation.type === 'oneToMany' || relation.type === 'manyToMany') {
          code += `,

    // Relationship endpoints for ${relation.name}
    get${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string): Promise<${relation.targetEntity}[]> => {
      return request.get(\`\${endpoint}/\${id}/${relation.name}\`);
    },

    add${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string, ${relation.targetEntity.toLowerCase()}Id: string): Promise<${name}> => {
      return request.post(\`\${endpoint}/\${id}/${relation.name}\`, { ${relation.targetEntity.toLowerCase()}Id });
    },

    remove${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string, ${relation.targetEntity.toLowerCase()}Id: string): Promise<${name}> => {
      return request.delete(\`\${endpoint}/\${id}/${relation.name}/\${${relation.targetEntity.toLowerCase()}Id}\`);
    }`;
        } else if (relation.type === 'oneToOne') {
          code += `,

    // Relationship endpoints for ${relation.name}
    get${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string): Promise<${relation.targetEntity}> => {
      return request.get(\`\${endpoint}/\${id}/${relation.name}\`);
    },

    set${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string, ${relation.targetEntity.toLowerCase()}Id: string): Promise<${name}> => {
      return request.put(\`\${endpoint}/\${id}/${relation.name}\`, { ${relation.targetEntity.toLowerCase()}Id });
    },

    remove${name}${relation.name.charAt(0).toUpperCase() + relation.name.slice(1)}: async (id: string): Promise<${name}> => {
      return request.delete(\`\${endpoint}/\${id}/${relation.name}\`);
    }`;
        }
      });
    }

    code += `
  })
}`;
  }

  code += '});';

  code += `

export const create${name} = ${lowerName}Api.create;
export const get${name} = ${lowerName}Api.get;
export const update${name} = ${lowerName}Api.update;
export const delete${name} = ${lowerName}Api.delete;
export const get${plural} = ${lowerName}Api.list;`;

  if (hasCustomEndpoints) {
    code += `
export const search${plural} = ${lowerName}Api.search${plural};
export const toggle${name}Status = ${lowerName}Api.toggle${name}Status;`;

    if (featureConfig.hasFiles) {
      code += `
export const upload${name}File = ${lowerName}Api.upload${name}File;`;
    }

    // Export relationship endpoints
    if (entityRelations.length > 0) {
      entityRelations.forEach(relation => {
        const relationCapitalized = relation.name.charAt(0).toUpperCase() + relation.name.slice(1);

        if (relation.type === 'oneToMany' || relation.type === 'manyToMany') {
          code += `
export const get${name}${relationCapitalized} = ${lowerName}Api.get${name}${relationCapitalized};
export const add${name}${relationCapitalized} = ${lowerName}Api.add${name}${relationCapitalized};
export const remove${name}${relationCapitalized} = ${lowerName}Api.remove${name}${relationCapitalized};`;
        } else if (relation.type === 'oneToOne') {
          code += `
export const get${name}${relationCapitalized} = ${lowerName}Api.get${name}${relationCapitalized};
export const set${name}${relationCapitalized} = ${lowerName}Api.set${name}${relationCapitalized};
export const remove${name}${relationCapitalized} = ${lowerName}Api.remove${name}${relationCapitalized};`;
        }
      });
    }
  }

  return code;
};

export const generateFormFieldsCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): string => {
  const formFields = entityFields.filter(field => field.showInForm && !field.isReadOnly);

  let code = `import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { FieldConfigProps } from '@/components/form';`;

  // Import relation services if needed
  if (entityRelations.length > 0) {
    code += `
import { use${featureConfig.name}Relations } from '../relations';`;
  }

  code += `

export const Create${featureConfig.name}Form = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();`;

  // Add relation hooks if needed
  if (entityRelations.length > 0) {
    code += `
  const {
    ${entityRelations.map(rel => `fetch${rel.targetEntity}List`).join(', ')}
  } = use${featureConfig.name}Relations();`;
  }

  code += `

  const fields: FieldConfigProps[] = [
${formFields
  .map(field => {
    let fieldConfig = `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${field.name}'),
      name: '${field.name}',
      defaultValue: ${field.defaultValue ? `'${field.defaultValue}'` : 'undefined'},
      type: '${field.type}'`;

    if (field.required) {
      fieldConfig += `,
      rules: { required: t('forms.${field.type === 'select' ? 'select' : 'input'}_required') }`;
    }

    if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
      fieldConfig += `,
      options: [
${field.options.map(opt => `        { label: '${opt.label}', value: '${opt.value}' }`).join(',\n')}
      ]`;
    }

    if (field.type === 'textarea' || field.type === 'uploader') {
      fieldConfig += `,
      className: 'col-span-full'`;
    }

    fieldConfig += `
    }`;
    return fieldConfig;
  })
  .join(',\n')}`;

  // Add relation fields if needed for form
  if (entityRelations.length > 0) {
    const relationFormFields = entityRelations
      .filter(rel => rel.type !== 'manyToMany') // Usually many-to-many are handled in separate UI
      .map(rel => {
        return `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}'),
      name: '${rel.name}',
      type: 'select',
      ${rel.isRequired ? `rules: { required: t('forms.select_required') },` : ''}
      loadOptions: async () => {
        const options = await fetch${rel.targetEntity}List();
        return options.map(item => ({
          label: item.name || item.title || item.id,
          value: item.id
        }));
      }
    }`;
      });

    if (relationFormFields.length > 0) {
      code += `,
${relationFormFields.join(',\n')}`;
    }
  }

  code += `
  ];

  return (
    <Form
      id='create-${featureConfig.name.toLowerCase()}'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};

export const Edit${featureConfig.name}Form = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();`;

  // Add relation hooks to edit form
  if (entityRelations.length > 0) {
    code += `
  const {
    ${entityRelations.map(rel => `fetch${rel.targetEntity}List`).join(', ')}
  } = use${featureConfig.name}Relations();`;
  }

  code += `

  const fields: FieldConfigProps[] = [
${entityFields
  .filter(field => field.showInForm)
  .map(field => {
    let fieldConfig = `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${field.name}'),
      name: '${field.name}',
      defaultValue: ${field.isReadOnly ? 'false' : field.defaultValue ? `'${field.defaultValue}'` : 'undefined'},
      type: '${field.type}'`;

    if (field.required) {
      fieldConfig += `,
      rules: { required: t('forms.${field.type === 'select' ? 'select' : 'input'}_required') }`;
    }

    if (field.isReadOnly) {
      fieldConfig += `,
      disabled: true`;
    }

    if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
      fieldConfig += `,
      options: [
${field.options.map(opt => `        { label: '${opt.label}', value: '${opt.value}' }`).join(',\n')}
      ]`;
    }

    if (field.type === 'textarea' || field.type === 'uploader') {
      fieldConfig += `,
      className: 'col-span-full'`;
    }

    fieldConfig += `
    }`;
    return fieldConfig;
  })
  .join(',\n')}`;

  // Add relation fields to edit form
  if (entityRelations.length > 0) {
    const relationFormFields = entityRelations
      .filter(rel => rel.type !== 'manyToMany')
      .map(rel => {
        return `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}'),
      name: '${rel.name}',
      type: 'select',
      ${rel.isRequired ? `rules: { required: t('forms.select_required') },` : ''}
      loadOptions: async () => {
        const options = await fetch${rel.targetEntity}List();
        return options.map(item => ({
          label: item.name || item.title || item.id,
          value: item.id
        }));
      }
    }`;
      });

    if (relationFormFields.length > 0) {
      code += `,
${relationFormFields.join(',\n')}`;
    }
  }

  code += `
  ];

  // Set form values when data is loaded
  useEffect(() => {
    if (!record) return;
${entityFields
  .filter(field => field.showInForm)
  .map(field => `    setValue('${field.name}', record.${field.name});`)
  .join('\n')}`;

  // Set relation values
  if (entityRelations.length > 0) {
    code += `

    // Set relation values if available
${entityRelations
  .filter(rel => rel.type !== 'manyToMany')
  .map(
    rel => `    if (record.${rel.name} && record.${rel.name}.id) {
      setValue('${rel.name}', record.${rel.name}.id);
    }`
  )
  .join('\n')}`;
  }

  code += `
  }, [setValue, record]);

  return (
    <Form
      id='edit-${featureConfig.name.toLowerCase()}'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};`;

  return code;
};

export const generateTableColumnsCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): string => {
  const tableFields = entityFields.filter(field => field.showInTable);

  let code = `import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { parseStatus } from '@/lib/status';
import { useTranslation } from 'react-i18next';
import { ${featureConfig.name} } from './${featureConfig.name.toLowerCase()}';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
${tableFields
  .map(field => {
    let column = `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${field.name}'),
      dataIndex: '${field.name}'`;

    if (field.isPrimary) {
      column += `,
      parser: (value: string, record: ${featureConfig.name}) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          {value}
        </Button>
      )`;
    } else if (field.type === 'date') {
      column += `,
      parser: value => formatDateTime(value)`;
    } else if (field.type === 'select' && field.name === 'status') {
      column += `,
      parser: (value: string, _record: ${featureConfig.name}) => parseStatus(value)`;
    }

    column += `,
      icon: '${getIconForType(field.type)}'
    }`;
    return column;
  })
  .join(',\n')}`;

  // Add relation columns if needed
  if (entityRelations.length > 0) {
    const relationColumns = entityRelations
      // @ts-expect-error
      .filter(rel => rel.type === 'oneToOne' || rel.type === 'manyToOne')
      .map(rel => {
        return `    {
      title: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}'),
      dataIndex: '${rel.name}.name',
      icon: 'IconLink',
      parser: (value: string, record: ${featureConfig.name}) => (
        record.${rel.name} ? (
          <Button variant='link' size='md' onClick={() => console.log('Navigate to related entity', record.${rel.name})}>
            {record.${rel.name}.name || record.${rel.name}.title || record.${rel.name}.id}
          </Button>
        ) : '-'
      )
    }`;
      });

    if (relationColumns.length > 0) {
      code += `,
${relationColumns.join(',\n')}`;
    }
  }

  code += `${tableFields.length > 0 || entityRelations.length > 0 ? ',' : ''}
    {
      title: t('common.actions'),
      actions: [
        {
          title: t('actions.view'),
          icon: 'IconEye',
          onClick: (record: ${featureConfig.name}) => handleView(record, 'view')
        },
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: ${featureConfig.name}) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete'),
          icon: 'IconTrash',
          onClick: (record: ${featureConfig.name}) => handleDelete(record)
        }
      ]
    }
  ];
};`;

  return code;
};

export const generateQueryFieldsCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[]
): string => {
  const searchableFields = entityFields.filter(
    field =>
      field.isVisible &&
      (field.type === 'text' || field.type === 'select' || field.type === 'date' || field.isPrimary)
  );

  if (searchableFields.length === 0) return '';

  const code = `import { InputField, PaginationParams, SelectField, DateField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
${searchableFields.map(field => `  ${field.name}?: ${getTypeScriptType(field.type)};`).join('\n')}
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<QueryFormParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();

  return [
${searchableFields
  .map(field => {
    let fieldConfig = `  {
    name: '${field.name}',
    label: t('${featureConfig.name.toLowerCase()}.fields.${field.name}'),
    component: (
      <Controller
        name='${field.name}'
        control={queryControl}
        defaultValue=''
        render={({ field }) => `;

    if (field.type === 'select') {
      fieldConfig += `<SelectField
          options={[
            { label: t('common.all'), value: 'all' },
${field.options.map(opt => `            { label: '${opt.label}', value: '${opt.value}' }`).join(',\n')}
          ]}
          className='[&>button]:py-1.5'
          {...field}
        />`;
    } else if (field.type === 'date') {
      fieldConfig += `<DateField
          className='py-1.5'
          {...field}
        />`;
    } else {
      fieldConfig += `<InputField
          className='py-1.5'
          {...field}
        />`;
    }

    fieldConfig += `
      />
    )
  }`;
    return fieldConfig;
  })
  .join(',\n')}
  ];
};`;

  return code;
};

export const generateServiceCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): string => {
  const code = `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ${featureConfig.name} } from './${featureConfig.name.toLowerCase()}';
import { QueryFormParams } from './config/query';
import {
  create${featureConfig.name},
  delete${featureConfig.name},
  get${featureConfig.name},
  get${featureConfig.pluralName || featureConfig.name + 's'},
  update${featureConfig.name}${entityRelations.length > 0 ? ',' : ''}
  ${entityRelations
    .map(rel => {
      const relationCapitalized = rel.name.charAt(0).toUpperCase() + rel.name.slice(1);
      if (rel.type === 'oneToOne') {
        return `get${featureConfig.name}${relationCapitalized}, set${featureConfig.name}${relationCapitalized}, remove${featureConfig.name}${relationCapitalized}`;
      } else if (rel.type === 'oneToMany' || rel.type === 'manyToMany') {
        return `get${featureConfig.name}${relationCapitalized}, add${featureConfig.name}${relationCapitalized}, remove${featureConfig.name}${relationCapitalized}`;
      }
      return '';
    })
    .filter(Boolean)
    .join(',\n  ')}
} from './apis';

interface ${featureConfig.name}Keys {
  create: [string, string];
  get: (_options?: { id?: string }) => [string, string, { id?: string }];
  update: [string, string];
  list: (_options?: QueryFormParams) => [string, string, QueryFormParams];
  ${entityRelations
    .map(rel => {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const relationCapitalized = rel.name.charAt(0).toUpperCase() + rel.name.slice(1);
      return `${rel.name}: (id: string) => [string, string, string];`;
    })
    .join('\n  ')}
}

export const ${featureConfig.name.toLowerCase()}Keys: ${featureConfig.name}Keys = {
  create: ['${featureConfig.name.toLowerCase()}Service', 'create'],
  get: ({ id } = {}) => ['${featureConfig.name.toLowerCase()}Service', '${featureConfig.name.toLowerCase()}', { id }],
  update: ['${featureConfig.name.toLowerCase()}Service', 'update'],
  list: (queryParams = {}) => ['${featureConfig.name.toLowerCase()}Service', '${featureConfig.pluralName || featureConfig.name.toLowerCase() + 's'}', queryParams],
  ${entityRelations
    .map(rel => {
      return `${rel.name}: (id: string) => ['${featureConfig.name.toLowerCase()}Service', '${rel.name}', id]`;
    })
    .join(',\n  ')}
};

// Hook to query a specific item by ID
export const useQuery${featureConfig.name} = (id: string) =>
  useQuery({
    queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id }),
    queryFn: () => get${featureConfig.name}(id),
    enabled: !!id
  });

// Hook for create mutation
export const useCreate${featureConfig.name} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ${featureConfig.name}) => create${featureConfig.name}(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.list() });
    }
  });
};

// Hook for update mutation
export const useUpdate${featureConfig.name} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ${featureConfig.name}) => update${featureConfig.name}(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id: data.id }) });
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.list() });
    }
  });
};

// Hook for delete mutation
export const useDelete${featureConfig.name} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => delete${featureConfig.name}(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.list() });
    }
  });
};

// Hook to list items
export const useList${featureConfig.pluralName || featureConfig.name + 's'} = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: ${featureConfig.name.toLowerCase()}Keys.list(queryParams),
    queryFn: () => get${featureConfig.pluralName || featureConfig.name + 's'}(queryParams)
  });
};

${entityRelations
  .map(rel => {
    const relationCapitalized = rel.name.charAt(0).toUpperCase() + rel.name.slice(1);

    if (rel.type === 'oneToOne') {
      return `// Hooks for ${rel.name} relationship
export const useGet${featureConfig.name}${relationCapitalized} = (id: string) => {
  return useQuery({
    queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(id),
    queryFn: () => get${featureConfig.name}${relationCapitalized}(id),
    enabled: !!id
  });
};

export const useSet${featureConfig.name}${relationCapitalized} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ${rel.targetEntity.toLowerCase()}Id }: { id: string, ${rel.targetEntity.toLowerCase()}Id: string }) =>
      set${featureConfig.name}${relationCapitalized}(id, ${rel.targetEntity.toLowerCase()}Id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id: data.id }) });
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(data.id) });
    }
  });
};

export const useRemove${featureConfig.name}${relationCapitalized} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove${featureConfig.name}${relationCapitalized}(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id: data.id }) });
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(data.id) });
    }
  });
};`;
    } else if (rel.type === 'oneToMany' || rel.type === 'manyToMany') {
      return `// Hooks for ${rel.name} relationship
export const useGet${featureConfig.name}${relationCapitalized} = (id: string) => {
  return useQuery({
    queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(id),
    queryFn: () => get${featureConfig.name}${relationCapitalized}(id),
    enabled: !!id
  });
};

export const useAdd${featureConfig.name}${relationCapitalized} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ${rel.targetEntity.toLowerCase()}Id }: { id: string, ${rel.targetEntity.toLowerCase()}Id: string }) =>
      add${featureConfig.name}${relationCapitalized}(id, ${rel.targetEntity.toLowerCase()}Id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id: data.id }) });
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(data.id) });
    }
  });
};

export const useRemove${featureConfig.name}${relationCapitalized} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ${rel.targetEntity.toLowerCase()}Id }: { id: string, ${rel.targetEntity.toLowerCase()}Id: string }) =>
      remove${featureConfig.name}${relationCapitalized}(id, ${rel.targetEntity.toLowerCase()}Id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.get({ id: data.id }) });
      queryClient.invalidateQueries({ queryKey: ${featureConfig.name.toLowerCase()}Keys.${rel.name}(data.id) });
    }
  });
};`;
    }
    return '';
  })
  .join('\n\n')}`;

  return code;
};

export const generateRelationsServiceCode = (
  featureConfig: FeatureConfig,
  entityRelations: EntityRelation[]
): string => {
  if (entityRelations.length === 0) return '';

  const code = `import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// This is a simple utility hook to manage relations
export const use${featureConfig.name}Relations = () => {
  // Cache fetched options for selects
  const [cachedOptions, setCachedOptions] = useState<Record<string, any[]>>({});

${entityRelations
  .map(rel => {
    return `  // Fetch ${rel.targetEntity} list for relationship dropdowns
  const fetch${rel.targetEntity}List = async () => {
    // Check cache first
    if (cachedOptions['${rel.targetEntity}']) {
      return cachedOptions['${rel.targetEntity}'];
    }

    try {
      // This should be replaced with actual API call to fetch the related entity
      const response = await fetch(\`/api/${rel.targetEntity.toLowerCase()}s\`);
      const data = await response.json();

      // Cache the results
      setCachedOptions(prev => ({
        ...prev,
        '${rel.targetEntity}': data.items || data.data || data
      }));

      return data.items || data.data || data;
    } catch (error) {
      console.error(\`Error fetching ${rel.targetEntity} options\`, error);
      return [];
    }
  };`;
  })
  .join('\n\n')}

  return {
${entityRelations.map(rel => `    fetch${rel.targetEntity}List`).join(',\n')}
  };
};`;

  return code;
};

export const generatePagesCode = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): Record<string, string> => {
  // Create page
  const createPage = `import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Create${featureConfig.name}Form } from '../forms/create';
import { useLayoutContext } from '@/components/layout';

export const Create${featureConfig.name}Page = ({ viewMode, onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const mode = viewMode || vmode || 'flatten';

  if (mode === 'modal') {
    return <Create${featureConfig.name}Form onSubmit={onSubmit} control={control} errors={errors} />;
  }

  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <div className='text-slate-600 font-medium'>{t('actions.create')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.submit')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <Create${featureConfig.name}Form onSubmit={onSubmit} control={control} errors={errors} />
        </Container>
      </ScrollView>
    </>
  );
};`;

  // Edit page
  const editPage = `import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { Edit${featureConfig.name}Form } from '../forms/editor';
import { useLayoutContext } from '@/components/layout';

export const Edit${featureConfig.name}Page = ({
  viewMode,
  record: initialRecord,
  onSubmit,
  control,
  setValue,
  errors
}) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return (
      <Edit${featureConfig.name}Form
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }

  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <div className='text-slate-600 font-medium'>{t('actions.edit')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.submit')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <Edit${featureConfig.name}Form
            record={record}
            onSubmit={onSubmit}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </Container>
      </ScrollView>
    </>
  );
};`;

  // View page
  const viewPage = `import { Button, Icons, ScrollView, Container, FieldViewer, Tabs, TabsList, TabsTrigger, TabsContent } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { useQuery${featureConfig.name}${entityRelations.length > 0 ? `, useGet${featureConfig.name}${entityRelations[0].name.charAt(0).toUpperCase() + entityRelations[0].name.slice(1)}` : ''} } from '../service';
import { useLayoutContext } from '@/components/layout';

export const ${featureConfig.name}ViewerPage = ({ viewMode, record: initialRecord, handleView }) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const recordId = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';
  const { data: record } = useQuery${featureConfig.name}(recordId);

  if (!recordId) {
    return null;
  }

  if (!record) {
    return <div className="p-4 text-center">{t('common.loading')}</div>;
  }

  if (mode === 'modal') {
    return <${featureConfig.name}ViewerForm record={record} />;
  }

  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' />
            </Button>
            <div className='text-slate-600 font-medium'>{t('actions.view')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button
              variant='outline-primary'
              prependIcon={<Icons name='IconEdit' className='w-4 h-4' />}
              onClick={() => handleView({ id: recordId }, '../edit')}
            >
              {t('actions.edit')}
            </Button>
            <Button
              variant='outline-danger'
              prependIcon={<Icons name='IconTrash' className='w-4 h-4' />}
              onClick={() => {
                if (confirm(t('messages.confirm_delete'))) {
                  // Delete logic would go here
                  navigate(-1);
                }
              }}
            >
              {t('actions.delete')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          ${
            entityRelations.length > 0
              ? `<Tabs defaultValue="details" className="mt-4">
            <TabsList>
              <TabsTrigger value="details">{t('${featureConfig.name.toLowerCase()}.tabs.details')}</TabsTrigger>
              ${entityRelations
                .map(
                  rel =>
                    `<TabsTrigger value="${rel.name}">{t('${featureConfig.name.toLowerCase()}.tabs.${rel.name}')}</TabsTrigger>`
                )
                .join('\n              ')}
            </TabsList>

            <TabsContent value="details">`
              : ''
          }
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
              <span className='bg-blue-500 w-1 mr-2 h-full inline-block' />
              {t('${featureConfig.name.toLowerCase()}.section.basic_info')}
            </div>

            ${entityFields
              .filter(field => field.isVisible)
              .map(field => {
                if (field.type === 'textarea') {
                  return `<FieldViewer title={t('${featureConfig.name.toLowerCase()}.fields.${field.name}')} className='col-span-full'>{record.${field.name}}</FieldViewer>`;
                }
                return `<FieldViewer title={t('${featureConfig.name.toLowerCase()}.fields.${field.name}')}>{record.${field.name}}</FieldViewer>`;
              })
              .join('\n            ')}
          </div>
          ${
            entityRelations.length > 0
              ? `</TabsContent>

            ${entityRelations
              .map(rel => {
                const _relationCapitalized = rel.name.charAt(0).toUpperCase() + rel.name.slice(1);
                return `<TabsContent value="${rel.name}">
              <${rel.name.charAt(0).toUpperCase() + rel.name.slice(1)}RelationshipTab recordId={recordId} />
            </TabsContent>`;
              })
              .join('\n            ')}
          </Tabs>`
              : ''
          }
        </Container>
      </ScrollView>
    </>
  );
};

// Simple form for modal view
export const ${featureConfig.name}ViewerForm = ({ record }) => {
  const { t } = useTranslation();

  if (!record) return null;

  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      <div className='flex items-center text-slate-800 font-medium col-span-full border-b border-slate-100 pb-4 mb-4'>
        <span className='bg-blue-500 w-1 mr-2 h-full inline-block' />
        {t('${featureConfig.name.toLowerCase()}.section.basic_info')}
      </div>

      ${entityFields
        .filter(field => field.isVisible)
        .map(field => {
          if (field.type === 'textarea') {
            return `<FieldViewer title={t('${featureConfig.name.toLowerCase()}.fields.${field.name}')} className='col-span-full'>{record.${field.name}}</FieldViewer>`;
          }
          return `<FieldViewer title={t('${featureConfig.name.toLowerCase()}.fields.${field.name}')}>{record.${field.name}}</FieldViewer>`;
        })
        .join('\n      ')}
    </div>
  );
};

${entityRelations
  .map(rel => {
    const relationCapitalized = rel.name.charAt(0).toUpperCase() + rel.name.slice(1);
    return `// Relationship tab component
const ${relationCapitalized}RelationshipTab = ({ recordId }) => {
  const { t } = useTranslation();
  const { data: relatedItems, isLoading } = useGet${featureConfig.name}${relationCapitalized}(recordId);

  if (isLoading) {
    return <div className='p-4'>{t('common.loading')}</div>;
  }

  if (!relatedItems || relatedItems.length === 0) {
    return (
      <div className='p-4 text-center'>
        <p className='text-slate-500 mb-4'>{t('${featureConfig.name.toLowerCase()}.no_related_items', { relation: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}') })}</p>
        <Button variant='outline-primary'>
          <Icons name='IconPlus' className='mr-2' />
          {t('${featureConfig.name.toLowerCase()}.add_related', { relation: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}') })}
        </Button>
      </div>
    );
  }

  return (
    <div className='mt-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='font-medium'>{t('${featureConfig.name.toLowerCase()}.fields.${rel.name}')}</h3>
        <Button variant='outline-primary' size='sm'>
          <Icons name='IconPlus' className='mr-2' />
          {t('${featureConfig.name.toLowerCase()}.add_related', { relation: t('${featureConfig.name.toLowerCase()}.fields.${rel.name}') })}
        </Button>
      </div>

      <div className='border rounded overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-slate-50'>
            <tr>
              <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                {t('common.name')}
              </th>
              <th className='px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider'>
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {relatedItems.map((item, index) => (
              <tr key={item.id || index} className='hover:bg-slate-50'>
                <td className='px-4 py-3'>
                  <a href='#' className='text-blue-600 hover:underline'>
                    {item.name || item.title || item.id}
                  </a>
                </td>
                <td className='px-4 py-3 text-right space-x-1'>
                  <Button variant='outline-slate' size='xs'>
                    <Icons name='IconEye' size={14} />
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
    </div>
  );
};`;
  })
  .join('\n\n')}`;

  // List page
  const listPage = `import { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useCreate${featureConfig.name}, useDelete${featureConfig.name}, useList${featureConfig.pluralName || featureConfig.name + 's'}, useUpdate${featureConfig.name} } from '../service';
import { ${featureConfig.name} } from '../${featureConfig.name.toLowerCase()}';

import { Create${featureConfig.name}Page } from './create';
import { Edit${featureConfig.name}Page } from './editor';
import { ${featureConfig.name}ViewerPage } from './viewer';

import { CurdView } from '@/components/curd';
import { useLayoutContext } from '@/components/layout';

export const ${featureConfig.name}ListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryFormParams>({ limit: 20 });
  const { data, refetch } = useList${featureConfig.pluralName || featureConfig.name + 's'}(queryParams);
  const { vmode } = useLayoutContext();

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const onQuery = handleQuerySubmit(async data => {
    setQueryParams(prev => ({ ...prev, ...data, cursor: '' }));
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const [viewType, setViewType] = useState<string | undefined>();
  const { mode } = useParams<{ mode: string; slug: string }>();
  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const [selectedRecord, setSelectedRecord] = useState<${featureConfig.name} | null>(null);

  const handleView = useCallback(
    (record: ${featureConfig.name} | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);
      if (vmode === 'flatten') {
        navigate(\`\${type}\${record ? \`/\${record.id}\` : ''}\`);
      }
    },
    [navigate, vmode]
  );

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<${featureConfig.name}>();

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();
    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const create${featureConfig.name}Mutation = useCreate${featureConfig.name}();
  const update${featureConfig.name}Mutation = useUpdate${featureConfig.name}();
  const delete${featureConfig.name}Mutation = useDelete${featureConfig.name}();

  const onSuccess = useCallback(() => {
    handleClose();
    refetch();
  }, [handleClose, refetch]);

  const handleCreate = useCallback(
    (data: ${featureConfig.name}) => {
      create${featureConfig.name}Mutation.mutate(data, { onSuccess });
    },
    [create${featureConfig.name}Mutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: ${featureConfig.name}) => {
      update${featureConfig.name}Mutation.mutate(data, { onSuccess });
    },
    [update${featureConfig.name}Mutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: ${featureConfig.name}) => {
      if (confirm(t('messages.confirm_delete'))) {
        delete${featureConfig.name}Mutation.mutate(record.id, { onSuccess });
      }
    },
    [delete${featureConfig.name}Mutation, onSuccess, t]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: ${featureConfig.name}) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const fetchData = useCallback(
    async (newQueryParams: QueryFormParams) => {
      const mergedQueryParams = { ...queryParams, ...newQueryParams };
      if (
        (isEqual(mergedQueryParams, queryParams) && Object.keys(data || {}).length) ||
        isEqual(newQueryParams, queryParams)
      ) {
        return data;
      }
      setQueryParams({ ...mergedQueryParams });
    },
    [queryParams, data]
  );

  return (
    <CurdView
      viewMode={vmode}
      title={t('${featureConfig.name.toLowerCase()}.title', '${featureConfig.displayName || featureConfig.name}')}
      topbarLeft={topbarLeftSection({ handleView })}
      topbarRight={topbarRightSection}
      columns={tableColumns({ handleView, handleDelete })}
      selected
      queryFields={queryFields({ queryControl })}
      onQuery={onQuery}
      onResetQuery={onResetQuery}
      fetchData={fetchData}
      createComponent={
        <Create${featureConfig.name}Page
          viewMode={vmode}
          onSubmit={handleConfirm}
          control={formControl}
          errors={formErrors}
        />
      }
      viewComponent={record => (
        <${featureConfig.name}ViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
      )}
      editComponent={record => (
        <Edit${featureConfig.name}Page
          viewMode={vmode}
          record={record?.id}
          onSubmit={handleConfirm}
          control={formControl}
          setValue={setFormValue}
          errors={formErrors}
        />
      )}
      type={viewType}
      record={selectedRecord}
      onConfirm={handleConfirm}
      onCancel={handleClose}
    />
  );
};`;

  return {
    createPage,
    editPage,
    viewPage,
    listPage
  };
};

export const generateTopbarConfig = (_featureConfig: FeatureConfig): string => {
  const code = `import { Button, ScreenControl } from '@/components/elements';
import { useTranslation } from 'react-i18next';

export const topbarLeftSection = ({ handleView }) => {
  const { t } = useTranslation();

  return [
    <div className='rounded-md flex items-center justify-between gap-x-1'>
      <Button
        icon='IconPlus'
        onClick={() => handleView(null, 'create')}
        tooltip={t('actions.create')}
      >
        {t('actions.create')}
      </Button>
    </div>
  ];
};

export const topbarRightSection = [<ScreenControl />];`;

  return code;
};

export const generateRoutesCode = (featureConfig: FeatureConfig): string => {
  const code = `import { ${featureConfig.name}ListPage } from './pages/list';
import { renderRoutes } from '@/router';

export const ${featureConfig.name}Routes = () => {
  const routes = [
    { path: '/', element: <${featureConfig.name}ListPage /> },
    { path: '/:mode', element: <${featureConfig.name}ListPage /> },
    { path: '/:mode/:slug', element: <${featureConfig.name}ListPage /> }
  ];
  return renderRoutes(routes);
};

export default ${featureConfig.name}Routes;`;

  return code;
};

// Function to generate all code files for the feature
export const generateAllCodeFiles = (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): Record<string, string> => {
  const files: Record<string, string> = {};

  // Core entity definition
  files[`${featureConfig.name.toLowerCase()}.d.ts`] = generateEntityCode(
    featureConfig,
    entityFields,
    entityRelations
  );

  // API integration
  files[`apis.ts`] = generateApiCode(
    featureConfig,
    entityFields,
    entityRelations,
    featureConfig.hasCustomApi
  );

  // Service layer
  files[`service.ts`] = generateServiceCode(featureConfig, entityFields, entityRelations);

  // Relations service if needed
  if (entityRelations.length > 0) {
    files[`relations.ts`] = generateRelationsServiceCode(featureConfig, entityRelations);
  }

  // Form configurations
  files[`forms/create.tsx`] = generateFormFieldsCode(featureConfig, entityFields, entityRelations);

  // Config files
  const queryFieldsContent = generateQueryFieldsCode(featureConfig, entityFields);
  if (queryFieldsContent) {
    files[`config/query.tsx`] = queryFieldsContent;
  }

  files[`config/table.tsx`] = generateTableColumnsCode(
    featureConfig,
    entityFields,
    entityRelations
  );
  files[`config/topbar.tsx`] = generateTopbarConfig(featureConfig);

  // Pages
  const pages = generatePagesCode(featureConfig, entityFields, entityRelations);
  files[`pages/create.tsx`] = pages.createPage;
  files[`pages/editor.tsx`] = pages.editPage;
  files[`pages/viewer.tsx`] = pages.viewPage;
  files[`pages/list.tsx`] = pages.listPage;

  // Routes
  files[`routes.tsx`] = generateRoutesCode(featureConfig);

  return files;
};

// Function to zip generated files for download
export const zipFeatureFiles = async (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): Promise<Blob> => {
  const files = generateAllCodeFiles(featureConfig, entityFields, entityRelations);
  const zip = new JSZip();

  // Create folder structure
  const featureFolder = zip.folder(featureConfig.name.toLowerCase());
  if (!featureFolder) throw new Error('Could not create feature folder');

  // Add files to appropriate folders
  Object.entries(files).forEach(([path, content]) => {
    const parts = path.split('/');
    if (parts.length > 1) {
      // Handle nested folders
      const folder = parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      const featureSubFolder = featureFolder.folder(folder);
      if (featureSubFolder) {
        featureSubFolder.file(fileName, content);
      }
    } else {
      // Root level files
      featureFolder.file(path, content);
    }
  });

  // Generate zip
  return await zip.generateAsync({ type: 'blob' });
};

// Function to download the generated files
export const downloadFeatureFiles = async (
  featureConfig: FeatureConfig,
  entityFields: EntityField[],
  entityRelations: EntityRelation[]
): Promise<void> => {
  try {
    const zipBlob = await zipFeatureFiles(featureConfig, entityFields, entityRelations);
    saveAs(zipBlob, `${featureConfig.name.toLowerCase()}-feature.zip`);
  } catch (error) {
    console.error('Error generating feature files:', error);
    throw error;
  }
};

// Main hook to use the feature builder service
const useFeatureBuilderService = () => {
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>({
    name: '',
    displayName: '',
    pluralName: '',
    description: '',
    apiPrefix: '',
    hasCustomApi: false,
    hasFiles: false,
    hasPagination: true,
    hasSearch: true,
    hasFilters: true,
    viewModes: ['table', 'grid', 'kanban'],
    defaultViewMode: 'table'
  });

  const [entityFields, setEntityFields] = useState<EntityField[]>([
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
      showInForm: true,
      validation: null,
      defaultValue: '',
      options: []
    }
  ]);

  const [entityRelations, setEntityRelations] = useState<EntityRelation[]>([]);

  // Generate code for all feature files
  const generateCode = (): Record<string, string> => {
    return generateAllCodeFiles(featureConfig, entityFields, entityRelations);
  };

  // Download feature as zip file
  const downloadFiles = () => {
    return downloadFeatureFiles(featureConfig, entityFields, entityRelations);
  };

  return {
    featureConfig,
    setFeatureConfig,
    entityFields,
    setEntityFields,
    entityRelations,
    setEntityRelations,
    generateCode,
    downloadFiles
  };
};

export default useFeatureBuilderService;
