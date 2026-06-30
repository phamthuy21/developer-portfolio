import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboard.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS],
    queryFn: () => dashboardApi.getStats(),
  });
};
