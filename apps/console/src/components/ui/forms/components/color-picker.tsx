import React, { useState, useRef, useEffect } from 'react';

import { cn } from '@ncobase/utils';

import type { ColorPickerComponentProps } from '../types';

import { Input } from './base';

// Default color presets
const DEFAULT_PRESETS = [
  '#FF0000',
  '#FF8000',
  '#FFFF00',
  '#80FF00',
  '#00FF00',
  '#00FF80',
  '#00FFFF',
  '#0080FF',
  '#0000FF',
  '#8000FF',
  '#FF00FF',
  '#FF0080',
  '#FFFFFF',
  '#C0C0C0',
  '#808080',
  '#404040',
  '#000000'
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// // Convert RGB to hex
// function rgbToHex(r: number, g: number, b: number): string {
//   return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
// }

function rgbToHsla(r: number, g: number, b: number, a = 1): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    // eslint-disable-next-line prefer-const
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a})`;
}

export const ColorPickerComponent: React.FC<ColorPickerComponentProps> = ({
  value = '#000000',
  onChange,
  presetColors = DEFAULT_PRESETS,
  allowCustomColor = true,
  format = 'hex',
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update when external value changes
  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);

    if (onChange) {
      let formattedColor = color;

      if (format === 'rgba' || format === 'hsla') {
        const rgb = hexToRgb(color);
        if (rgb) {
          if (format === 'rgba') {
            formattedColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
          } else {
            formattedColor = rgbToHsla(rgb.r, rgb.g, rgb.b);
          }
        }
      }

      onChange(formattedColor);
    }

    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div ref={pickerRef} className={cn('relative', className)}>
      <div className='flex items-center cursor-pointer' onClick={() => setOpen(!open)}>
        <div
          className='w-[35px] h-[35px] rounded-md mr-2'
          style={{ backgroundColor: currentColor }}
        />
        {allowCustomColor && (
          <Input
            type='text'
            value={currentColor}
            onChange={handleInputChange}
            onClick={e => e.stopPropagation()}
            {...props}
          />
        )}
      </div>

      {open && (
        <div className='absolute z-10 mt-1 p-3 bg-white rounded-md shadow-lg border border-slate-200'>
          <div className='grid grid-cols-5 gap-2 mb-2'>
            {presetColors.map((color, index) => (
              <button
                key={index}
                type='button'
                className={cn(
                  'w-6 h-6 rounded-md border',
                  color === currentColor ? 'ring-1 ring-primary-600' : 'border-slate-200'
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                aria-label={color}
              />
            ))}
          </div>

          {allowCustomColor && (
            <div className='mt-3'>
              <Input
                type='color'
                value={currentColor}
                onChange={e => handleColorChange(e.target.value)}
                className='w-full h-10'
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
