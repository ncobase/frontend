import React, { useState, useRef, useEffect } from 'react';

import { Label } from '@radix-ui/react-dropdown-menu';

import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputField } from '@/components/ui/forms';

// Predefined color palette
const COLORS = [
  // Blues
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#93C5FD',
  '#BFDBFE',
  // Greens
  '#10B981',
  '#34D399',
  '#6EE7B7',
  '#A7F3D0',
  '#D1FAE5',
  // Reds
  '#DC2626',
  '#EF4444',
  '#F87171',
  '#FCA5A5',
  '#FEE2E2',
  // Yellows
  '#F59E0B',
  '#FBBF24',
  '#FCD34D',
  '#FDE68A',
  '#FEF3C7',
  // Purples
  '#7C3AED',
  '#8B5CF6',
  '#A78BFA',
  '#C4B5FD',
  '#DDD6FE',
  // Pinks
  '#DB2777',
  '#EC4899',
  '#F472B6',
  '#F9A8D4',
  '#FCE7F3',
  // Grays
  '#111827',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  '#E5E7EB',
  // Oranges
  '#EA580C',
  '#F97316',
  '#FB923C',
  '#FDBA74',
  '#FED7AA',
  // Teals
  '#0D9488',
  '#14B8A6',
  '#2DD4BF',
  '#5EEAD4',
  '#99F6E4',
  // Indigos
  '#4F46E5',
  '#6366F1',
  '#818CF8',
  '#A5B4FC',
  '#C7D2FE'
];

interface ColorPickerProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#3B82F6',
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(value);
  const [customColor, setCustomColor] = useState(value);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor(value);
    setCustomColor(value);
  }, [value]);

  const handleColorSelect = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setColor(newColor);
    onChange?.(newColor);
  };

  const handleColorPreviewClick = () => {
    setIsOpen(true);
  };

  return (
    <div className={`${className}`}>
      <div className='flex items-center'>
        <div
          className='w-10 h-10 rounded-sm border cursor-pointer mr-2 shrink-0'
          style={{ backgroundColor: color }}
          onClick={handleColorPreviewClick}
        />
        <InputField
          value={color}
          onChange={e => {
            const newColor = e.target.value;
            setColor(newColor);
            setCustomColor(newColor);
            onChange?.(newColor);
          }}
          className='flex-1'
        />
      </div>

      <Dialog isOpen={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <DialogContent className='max-w-md w-full'>
          <DialogHeader>
            <DialogTitle>Select a Color</DialogTitle>
            <DialogDescription>
              Choose from the predefined colors or enter a custom color value
            </DialogDescription>
          </DialogHeader>

          <div className='grid grid-cols-10 gap-2 my-4'>
            {COLORS.map(colorOption => (
              <Button
                key={colorOption}
                variant='unstyle'
                className='w-8 h-8 rounded-full p-0 border border-gray-200 flex items-center justify-center'
                style={{ backgroundColor: colorOption }}
                onClick={() => handleColorSelect(colorOption)}
              >
                {color === colorOption && (
                  <div className='w-2 h-2 rounded-full bg-white shadow-xs' />
                )}
              </Button>
            ))}
          </div>

          <div className='mt-4'>
            <Label className='block font-medium text-gray-700 mb-1'>Custom Color</Label>
            <div className='flex items-center'>
              <div
                className='w-8 h-8 rounded-sm border mr-2 shrink-0'
                style={{ backgroundColor: customColor }}
              />
              <input
                ref={colorInputRef}
                type='color'
                value={customColor}
                onChange={handleCustomColorChange}
                className='w-full h-10 cursor-pointer'
              />
            </div>
            <div className='mt-2'>
              <InputField
                value={customColor}
                onChange={e => {
                  const newColor = e.target.value;
                  setCustomColor(newColor);
                  setColor(newColor);
                  onChange?.(newColor);
                }}
                placeholder='#RRGGBB'
              />
            </div>
          </div>

          <DialogFooter className='flex justify-between mt-4'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleColorSelect(customColor);
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
