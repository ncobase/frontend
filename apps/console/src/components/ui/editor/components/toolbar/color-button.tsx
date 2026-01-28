import { Button } from '@/components/ui/button';
import { DropdownTrigger, DropdownContent, Dropdown } from '@/components/ui/dropdown';
import { ColorButtonProps } from '@/components/ui/editor/types';
import { useTranslation } from '@/components/ui/lib/i18n';
import { Tooltip } from '@/components/ui/tooltip';

const COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Black', color: '#000000' },
  { name: 'Silver', color: '#718096' },
  { name: 'Gray', color: '#4A5568' },
  { name: 'Red', color: '#E53E3E' },
  { name: 'Orange', color: '#ED8936' },
  { name: 'Yellow', color: '#ECC94B' },
  { name: 'Green', color: '#48BB78' },
  { name: 'Teal', color: '#38B2AC' },
  { name: 'Blue', color: '#4299E1' },
  { name: 'Indigo', color: '#667EEA' },
  { name: 'Purple', color: '#9F7AEA' },
  { name: 'Pink', color: '#ED64A6' }
];

export const ColorButton = ({ editor }: ColorButtonProps) => {
  const { t } = useTranslation();
  const currentColor = editor.getAttributes('textStyle')['color'] || 'inherit';

  const setColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <Dropdown>
      <Tooltip content={t('editor.toolbar.textColor')}>
        <DropdownTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='flex items-center justify-center'
            aria-label={t('editor.toolbar.textColor')}
          >
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: currentColor !== 'inherit' ? currentColor : '#000000' }}
            />
          </Button>
        </DropdownTrigger>
      </Tooltip>
      <DropdownContent align='start' className='p-2 w-44'>
        <div className='grid grid-cols-4 gap-1'>
          {COLORS.map(color => (
            <button
              key={color.color}
              className='flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              style={{
                backgroundColor: color.color !== 'inherit' ? color.color : 'transparent',
                border: color.color === 'inherit' ? '1px solid #ccc' : 'none'
              }}
              onClick={() => setColor(color.color)}
              title={t(`editor.colors.${color.name.toLowerCase()}`, { color: color.name })}
            >
              {currentColor === color.color && <span className='text-white'>✓</span>}
            </button>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  );
};
