import { ScheduleCalendarPage } from './pages/calendar';
import { ScheduleListPage } from './pages/list';

import { renderRoutes } from '@/router';

export const ScheduleRoutes = () => {
  const routes = [
    { path: '/', element: <ScheduleListPage /> },
    { path: '/calendar', element: <ScheduleCalendarPage /> }
  ];
  return renderRoutes(routes);
};

export default ScheduleRoutes;
