import { lazyNamed, renderRoutes } from '@/router';

const MenuListPage = lazyNamed(() => import('./pages/list'), 'MenuListPage');

export const MenuRoutes = () => {
  const routes = [
    { path: '/', element: <MenuListPage /> },
    { path: '/:mode', element: <MenuListPage /> },
    { path: '/:mode/:slug', element: <MenuListPage /> }
  ];
  return renderRoutes(routes);
};

export default MenuRoutes;
