export const DictionaryValuePreview = ({ type, value, t }) => {
  if (!value) return <span className='text-slate-400'>{t('dictionary.preview.no_value')}</span>;

  try {
    switch (type) {
      case 'string':
        return <span className='text-green-600'>"{value}"</span>;
      case 'number': {
        const num = parseFloat(value);
        return <span className='text-blue-600'>{isNaN(num) ? 'Invalid number' : num}</span>;
      }
      case 'object': {
        const parsed = JSON.parse(value);
        return (
          <pre className='text-xs bg-white p-2 rounded border overflow-auto max-h-32'>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      }
      default:
        return <span>{value}</span>;
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (error) {
    return <span className='text-red-500'>{t('dictionary.preview.invalid')}</span>;
  }
};
