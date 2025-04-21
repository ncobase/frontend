/**
 * Utilities for the feature builder
 */

/**
 * Converts a string to camelCase
 * @param str String to convert
 * @returns Camel case string
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (_, c) => c.toLowerCase());
};

/**
 * Converts a string to PascalCase
 * @param str String to convert
 * @returns Pascal case string
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\s+/g, '');
};

/**
 * Converts a string to snake_case
 * @param str String to convert
 * @returns Snake case string
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

/**
 * Converts a string to kebab-case
 * @param str String to convert
 * @returns Kebab case string
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

/**
 * Pluralizes a string based on simple English rules
 * (Not comprehensive, but covers common cases)
 * @param str String to pluralize
 * @returns Pluralized string
 */
export const pluralize = (str: string): string => {
  if (!str) return '';

  // Special cases
  const irregulars: Record<string, string> = {
    person: 'people',
    child: 'children',
    foot: 'feet',
    tooth: 'teeth',
    goose: 'geese',
    mouse: 'mice',
    man: 'men',
    woman: 'women',
    ox: 'oxen',
    leaf: 'leaves',
    life: 'lives',
    knife: 'knives',
    wife: 'wives',
    half: 'halves',
    self: 'selves',
    elf: 'elves',
    loaf: 'loaves',
    potato: 'potatoes',
    tomato: 'tomatoes',
    cactus: 'cacti',
    focus: 'foci',
    fungus: 'fungi',
    nucleus: 'nuclei',
    syllabus: 'syllabi',
    analysis: 'analyses',
    diagnosis: 'diagnoses',
    thesis: 'theses',
    crisis: 'crises',
    phenomenon: 'phenomena',
    criterion: 'criteria',
    datum: 'data'
  };

  // Check for irregular plurals
  const lower = str.toLowerCase();
  if (irregulars[lower]) {
    // Preserve original capitalization
    const firstChar = str.charAt(0);
    const isCapitalized = firstChar === firstChar.toUpperCase();
    const plural = irregulars[lower];
    return isCapitalized ? plural.charAt(0).toUpperCase() + plural.slice(1) : plural;
  }

  // Rules for regular plurals
  if (str.endsWith('y') && !['ay', 'ey', 'iy', 'oy', 'uy'].some(vowel => str.endsWith(vowel))) {
    return str.slice(0, -1) + 'ies';
  }
  if (
    str.endsWith('s') ||
    str.endsWith('x') ||
    str.endsWith('z') ||
    str.endsWith('ch') ||
    str.endsWith('sh')
  ) {
    return str + 'es';
  }

  // Default: just add 's'
  return str + 's';
};

/**
 * Gets an i18n key path
 * @param section Section of the i18n
 * @param key Key within the section
 * @returns Full i18n key path
 */
export const getI18nKey = (section: string, key: string): string => {
  return `${section}.${key}`;
};

/**
 * Creates field options based on a name
 * Used for select, radio, checkbox fields
 * @param name Base name for options
 * @param count Number of options to generate
 * @returns Array of options
 */
export const createDefaultOptions = (
  name: string,
  count = 3
): { label: string; value: string }[] => {
  const options = [];
  for (let i = 1; i <= count; i++) {
    options.push({
      label: `${name} Option ${i}`,
      value: `${toCamelCase(name)}_option_${i}`
    });
  }
  return options;
};

/**
 * Checks if a string is a valid variable name
 * @param name String to check
 * @returns Whether the string is a valid variable name
 */
export const isValidVariableName = (name: string): boolean => {
  // Variable names must start with a letter, underscore or dollar sign
  // and can contain only letters, numbers, underscores or dollar signs
  const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return regex.test(name);
};

/**
 * Sanitizes a string for use as a variable name
 * @param name String to sanitize
 * @returns Sanitized variable name
 */
export const sanitizeVariableName = (name: string): string => {
  // Replace spaces and special characters
  let sanitized = name.replace(/[^a-zA-Z0-9_$]/g, '_');

  // Ensure it starts with a valid character
  if (!/^[a-zA-Z_$]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  return sanitized;
};

/**
 * Get color for relationship type (for UI display)
 * @param type Relationship type
 * @returns CSS color class
 */
export const getRelationshipTypeColor = (type: string): string => {
  switch (type) {
    case 'oneToOne':
      return 'bg-blue-100 text-blue-800';
    case 'oneToMany':
      return 'bg-green-100 text-green-800';
    case 'manyToMany':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};
