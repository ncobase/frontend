import { Navigate } from 'react-router';

import { ChannelCreatePage } from './pages/channel/create';
import { ChannelEditPage } from './pages/channel/edit';
import { ChannelListPage } from './pages/channel/list';
import { OrderListPage } from './pages/order/list';
import { OrderViewPage } from './pages/order/view';
import { PaymentOverviewPage } from './pages/overview';
import { ProductCreatePage } from './pages/product/create';
import { ProductEditPage } from './pages/product/edit';
import { ProductListPage } from './pages/product/list';
import { SubscriptionListPage } from './pages/subscription/list';
import { SubscriptionViewPage } from './pages/subscription/view';

import { renderRoutes } from '@/router';

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
