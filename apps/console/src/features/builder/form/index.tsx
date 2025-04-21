import { FormBuilder } from '@ncobase/react';

import { Page } from '@/components/layout';

export const FormBuilderPage: React.FC = () => {
  return (
    <Page sidebar title='Form Builder'>
      <FormBuilder />
    </Page>
  );
};
