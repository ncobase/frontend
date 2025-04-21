import { FeatureBuilderPage } from './feature';
import { FormBuilderPage } from './form';

import { renderRoutes } from '@/router';

export const BuilderRoutes = () => {
  const routes = [
    { path: '/feature', element: <FeatureBuilderPage /> },
    { path: '/form', element: <FormBuilderPage /> }
  ];
  return renderRoutes(routes);
};
