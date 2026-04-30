import { lazyNamed, renderRoutes } from '@/router';

const ScheduleCalendarPage = lazyNamed(() => import('./pages/calendar'), 'ScheduleCalendarPage');
const ScheduleListPage = lazyNamed(() => import('./pages/list'), 'ScheduleListPage');

export const ScheduleRoutes = () => {
  const routes = [
    { path: '/', element: <ScheduleListPage /> },
    { path: '/calendar', element: <ScheduleCalendarPage /> }
  ];
  return renderRoutes(routes);
};

export default ScheduleRoutes;
