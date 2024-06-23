import React from 'react';

import { Container, ScrollView } from '@ncobase/react';

import { CreateMenuForms } from '../forms/create';

import { useLayoutContext } from '@/layout';

export const CreateMenuPage = ({ viewMode, onSubmit, control, errors }) => {
  const { vmode } = useLayoutContext();
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <CreateMenuForms onSubmit={onSubmit} control={control} errors={errors} />;
  }
  return (
    <ScrollView>
      <Container className='bg-white'>
        <CreateMenuForms onSubmit={onSubmit} control={control} errors={errors} />
      </Container>
    </ScrollView>
  );
};
