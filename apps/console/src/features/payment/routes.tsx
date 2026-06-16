import { Navigate } from 'react-router';

import { lazyNamed, renderRoutes } from '@/router';
import { Guard } from '@/router/helpers/guard';

const ChannelCreatePage = lazyNamed(() => import('./pages/channel/create'), 'ChannelCreatePage');
const ChannelEditPage = lazyNamed(() => import('./pages/channel/edit'), 'ChannelEditPage');
const ChannelListPage = lazyNamed(() => import('./pages/channel/list'), 'ChannelListPage');
const PaymentLogListPage = lazyNamed(() => import('./pages/log/list'), 'PaymentLogListPage');
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
    {
      path: '/products',
      element: <Guard permission='manage:payments' children={<ProductListPage />} />
    },
    {
      path: '/products/create',
      element: <Guard permission='manage:payments' children={<ProductCreatePage />} />
    },
    {
      path: '/products/edit/:slug',
      element: <Guard permission='manage:payments' children={<ProductEditPage />} />
    },
    {
      path: '/products/:mode',
      element: <Guard permission='manage:payments' children={<ProductListPage />} />
    },
    {
      path: '/products/:mode/:slug',
      element: <Guard permission='manage:payments' children={<ProductListPage />} />
    },
    {
      path: '/subscriptions',
      element: <Guard permission='manage:payments' children={<SubscriptionListPage />} />
    },
    {
      path: '/subscriptions/view/:slug',
      element: <Guard permission='manage:payments' children={<SubscriptionViewPage />} />
    },
    {
      path: '/subscriptions/:mode',
      element: <Guard permission='manage:payments' children={<SubscriptionListPage />} />
    },
    {
      path: '/subscriptions/:mode/:slug',
      element: <Guard permission='manage:payments' children={<SubscriptionListPage />} />
    },
    {
      path: '/channels',
      element: <Guard permission='manage:payments' children={<ChannelListPage />} />
    },
    {
      path: '/channels/create',
      element: <Guard permission='manage:payments' children={<ChannelCreatePage />} />
    },
    {
      path: '/channels/edit/:slug',
      element: <Guard permission='manage:payments' children={<ChannelEditPage />} />
    },
    {
      path: '/channels/:mode',
      element: <Guard permission='manage:payments' children={<ChannelListPage />} />
    },
    {
      path: '/channels/:mode/:slug',
      element: <Guard permission='manage:payments' children={<ChannelListPage />} />
    },
    {
      path: '/logs',
      element: <Guard permission='admin:payments' children={<PaymentLogListPage />} />
    }
  ];
  return renderRoutes(routes);
};

export default PaymentRoutes;
