import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@workspace/api-client-react';
import { Bell, CloudRain, TrendingUp, ShieldCheck, Store, CheckCheck, Info } from 'lucide-react';
import { formatDateTime } from '@/lib/format';
import { useQueryClient } from '@tanstack/react-query';
import { getListNotificationsQueryKey } from '@workspace/api-client-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  
  const { data: notifications, isLoading } = useListNotifications(
    { unreadOnly: filter === 'unread' ? true : undefined },
    { query: { queryKey: ['notifications', filter] } }
  );

  const markRead = useMarkNotificationRead({
    mutation: {
      onSuccess: () => {
        // Refetch both all and unread notifications, plus dashboard for badge
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    }
  });

  const markAllRead = useMarkAllNotificationsRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    }
  });

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markRead.mutate({ notificationId: id });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather_alert': return <CloudRain className="w-5 h-5 text-red-600" />;
      case 'price_alert': return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case 'scheme_update': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'marketplace': return <Store className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-muted/50';
    switch (type) {
      case 'weather_alert': return 'bg-red-50 dark:bg-red-900/10 border-red-200';
      case 'price_alert': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200';
      case 'scheme_update': return 'bg-purple-50 dark:bg-purple-900/10 border-purple-200';
      case 'marketplace': return 'bg-green-50 dark:bg-green-900/10 border-green-200';
      default: return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200';
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <AppLayout>
      <PageHeader 
        title="Notifications" 
        description="Stay updated on prices, weather alerts, and schemes."
        actions={
          <button 
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || unreadCount === 0}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-card border border-input rounded-xl hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === 'unread' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
        >
          Unread
        </button>
      </div>

      <div className="space-y-3 max-w-3xl">
        {isLoading ? (
          [1,2,3,4,5].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-muted w-1/3 rounded"></div>
                <div className="h-3 bg-muted w-3/4 rounded"></div>
              </div>
            </div>
          ))
        ) : notifications && notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              onClick={() => handleMarkRead(notification.id, notification.isRead)}
              className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all hover:shadow-sm ${getBgColor(notification.type, notification.isRead)} ${notification.isRead ? 'border-border opacity-70' : 'border-l-4 shadow-sm'}`}
            >
              <div className="mt-1 shrink-0 bg-background/80 p-2 rounded-full shadow-sm">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-semibold ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap font-mono mt-1">
                    {formatDateTime(notification.createdAt)}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${notification.isRead ? 'text-muted-foreground/80' : 'text-foreground/90'}`}>
                  {notification.message}
                </p>
                {notification.actionUrl && (
                  <button className="mt-3 text-xs font-bold text-primary uppercase tracking-wider hover:underline">
                    View Details →
                  </button>
                )}
              </div>
              {!notification.isRead && (
                <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center bg-card border border-border rounded-2xl">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No {filter === 'unread' ? 'unread ' : ''}notifications right now.</p>
            {filter === 'unread' && (
              <button 
                onClick={() => setFilter('all')}
                className="mt-4 text-primary font-medium hover:underline"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
