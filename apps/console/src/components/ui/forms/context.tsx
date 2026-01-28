import React, { createContext, useContext } from 'react';

import { FieldValues } from 'react-hook-form';

import type { FormContextValue } from './types';

const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext) as unknown as FormContextValue<TFieldValues> | null;
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = <TFieldValues extends FieldValues = FieldValues>({
  children,
  ...value
}: FormContextValue<TFieldValues> & { children: React.ReactNode }) => (
  <FormContext.Provider value={value as any}>{children}</FormContext.Provider>
);
