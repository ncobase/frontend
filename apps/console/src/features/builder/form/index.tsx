import { FormBuilder } from './builder';

import { Page } from '@/components/layout';

export const FormBuilderPage: React.FC = () => {
  return (
    <Page sidebar title='Form Builder'>
      <FormBuilder />
    </Page>
  );
};
