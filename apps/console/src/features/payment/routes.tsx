import { Navigate } from 'react-router';

import { lazyNamed, renderRoutes } from '@/router';

const ChannelCreatePage = lazyNamed(() => import('./pages/channel/create'), 'ChannelCreatePage');
const ChannelEditPage = lazyNamed(() => import('./pages/channel/edit'), 'ChannelEditPage');
const ChannelListPage = lazyNamed(() => import('./pages/channel/list'), 'ChannelListPage');
const OrderListPage = lazyNamed(() => import('./pages/order/list'), 'OrderListPage');
const OrderViewPage = lazyNamed(() => import('./pages/order/view'), 'OrderViewPage');
const PaymentOverviewPage = lazyNamed(() => import('./pages/overview'), 'PaymentOverviewPage');
const ProductCreatePage = lazyNamed(() => import('./pages/product/create'), 'ProductCreatePage');
const ProductEditPage = lazyNamed(() => import('./pages/product/edit'), 'ProductEditPage');
const ProductListPage = lazyNamed(() => import('./pages/product/list'), 'ProductListPage');
const SubscriptionListPage = lazyNamed(
  () => import('./pages/subscription/list'),
  'SubscriptionListPage'
);
const SubscriptionViewPage = lazyNamed(
  () => import('./pages/subscription/view'),
  'SubscriptionViewPage'
);

export const PaymentRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to='overview' replace /> },
    { path: '/overview', element: <PaymentOverviewPage /> },
    { path: '/orders', element: <OrderListPage /> },
    { path: '/orders/view/:slug', element: <OrderViewPage /> },
    { path: '/orders/:mode', element: <OrderListPage /> },
    { path: '/orders/:mode/:slug', element: <OrderListPage /> },
    { path: '/products', element: <ProductListPage /> },
    { path: '/products/create', element: <ProductCreatePage /> },
    { path: '/products/edit/:slug', element: <ProductEditPage /> },
    { path: '/products/:mode', element: <ProductListPage /> },
    { path: '/products/:mode/:slug', element: <ProductListPage /> },
    { path: '/subscriptions', element: <SubscriptionListPage /> },
    { path: '/subscriptions/view/:slug', element: <SubscriptionViewPage /> },
    { path: '/subscriptions/:mode', element: <SubscriptionListPage /> },
    { path: '/subscriptions/:mode/:slug', element: <SubscriptionListPage /> },
    { path: '/channels', element: <ChannelListPage /> },
    { path: '/channels/create', element: <ChannelCreatePage /> },
    { path: '/channels/edit/:slug', element: <ChannelEditPage /> },
    { path: '/channels/:mode', element: <ChannelListPage /> },
    { path: '/channels/:mode/:slug', element: <ChannelListPage /> }
  ];
  return renderRoutes(routes);
};

export default PaymentRoutes;
