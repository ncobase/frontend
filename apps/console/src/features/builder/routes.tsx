import { lazyNamed, renderRoutes } from '@/router';

const FeatureBuilderPage = lazyNamed(() => import('./feature'), 'FeatureBuilderPage');
const FormBuilderPage = lazyNamed(() => import('./form'), 'FormBuilderPage');

export const BuilderRoutes = () => {
  const routes = [
    { path: '/feature', element: <FeatureBuilderPage /> },
    { path: '/form', element: <FormBuilderPage /> }
  ];
  return renderRoutes(routes);
};

export default BuilderRoutes;
