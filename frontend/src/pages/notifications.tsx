import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, type Notification as NotificationItem } from '@workspace/api-client-react';
import { Bell, CloudRain, TrendingUp, ShieldCheck, Store, CheckCheck, Info, X, Calendar, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '@/lib/format';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/context/language-context';

function NotificationDetailModal({ 
  notification, 
  onClose,
  isMarathi
}: { 
  notification: NotificationItem; 
  onClose: () => void;
  isMarathi: boolean;
}) {
  const getModalIcon = (type: string) => {
    switch (type) {
      case 'weather_alert': return <CloudRain className="w-7 h-7 text-red-600 dark:text-red-400" />;
      case 'price_alert': return <TrendingUp className="w-7 h-7 text-amber-600 dark:text-amber-400" />;
      case 'scheme_update': return <ShieldCheck className="w-7 h-7 text-purple-600 dark:text-purple-400" />;
      case 'marketplace': return <Store className="w-7 h-7 text-green-600 dark:text-green-400" />;
      default: return <Info className="w-7 h-7 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'weather_alert': return { label: isMarathi ? 'हवामान व मान्सून सल्ला' : 'Weather & Monsoon Advisory', bg: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200' };
      case 'price_alert': return { label: isMarathi ? 'बाजारभाव अलर्ट' : 'Mandi Rate Alert', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200' };
      case 'scheme_update': return { label: isMarathi ? 'शासकीय योजना व अनुदान' : 'Govt Scheme & Subsidy', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200' };
      case 'marketplace': return { label: isMarathi ? 'शेतकरी खरेदी-विक्री दालन' : 'Marketplace Buyer Activity', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200' };
      default: return { label: isMarathi ? 'सिस्टम सूचना' : 'System Notice', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' };
    }
  };

  const badge = getCategoryBadge(notification.type);

  const getActionLink = (type: string) => {
    switch (type) {
      case 'weather_alert': return { label: isMarathi ? 'हवामान अंदाज पहा' : 'Open Weather Forecast', path: '/weather' };
      case 'price_alert': return { label: isMarathi ? 'बाजारभाव तपासा' : 'Check Mandi Prices', path: '/market' };
      case 'scheme_update': return { label: isMarathi ? 'शासकीय योजना पहा' : 'Explore Govt Schemes', path: '/schemes' };
      case 'marketplace': return { label: isMarathi ? 'खरेदी-विक्री दालन पहा' : 'View Marketplace Listing', path: '/marketplace' };
      default: return { label: isMarathi ? 'डॅशबोर्डवर जा' : 'Go to Dashboard', path: '/' };
    }
  };

  const actionLink = getActionLink(notification.type);
  const titleText = isMarathi && (notification as any).titleMr ? (notification as any).titleMr : notification.title;
  const messageText = isMarathi && (notification as any).messageMr ? (notification as any).messageMr : notification.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-start bg-muted/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-card border border-border rounded-2xl shadow-sm shrink-0">
              {getModalIcon(notification.type)}
            </div>
            <div>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
              <h2 className="text-xl font-bold mt-2 text-foreground">{titleText}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Main Description */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {isMarathi ? 'सूचनेचा सारांश' : 'Notification Summary'}
            </h3>
            <p className="text-foreground text-base leading-relaxed">{messageText}</p>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isMarathi ? 'सल्ला माहिती व तपशील' : 'Advisory Details & Metadata'}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background p-3 rounded-xl border border-border flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-[11px] text-muted-foreground">{isMarathi ? 'प्राप्त झालेली तारीख' : 'Received On'}</div>
                  <div className="font-semibold">{formatDateTime(notification.createdAt)}</div>
                </div>
              </div>

              <div className="bg-background p-3 rounded-xl border border-border flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-[11px] text-muted-foreground">{isMarathi ? 'लक्ष्यित क्षेत्र' : 'Target Region'}</div>
                  <div className="font-semibold">{isMarathi ? 'महाराष्ट्र राज्य' : 'Maharashtra State'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Farmers Guidance */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 p-4 rounded-xl">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {isMarathi ? 'शेतकऱ्यांसाठी शिफारस केलेले उपाय' : 'Recommended Action for Farmers'}
            </h4>
            <ul className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5 list-disc list-inside font-medium">
              {notification.type === 'weather_alert' && (
                <>
                  <li>{isMarathi ? 'शेतातील पाण्याचा निचरा तपासा व मुसळधार पावसात औषध फवारणी थांबवा.' : 'Inspect field drainage and pause spray operations during heavy rainfall.'}</li>
                  <li>{isMarathi ? 'शेतातील औजार व कापणी केलेला माल सुरक्षित कोरड्या जागेत ठेवा.' : 'Secure loose agricultural implements and harvested crops in dry shelters.'}</li>
                </>
              )}
              {notification.type === 'price_alert' && (
                <>
                  <li>{isMarathi ? 'व्यापाऱ्यांना माल विकण्यापूर्वी जवळील बाजार समित्यांमधील चालू दर तपासा.' : 'Check live mandi rates across neighboring markets before agreeing to trader prices.'}</li>
                  <li>{isMarathi ? 'थेट खरेदीदारांकडून भाव मिळवण्यासाठी ॲग्रोसाथी खरेदी-विक्री दालनात शेतमाल नोंदवा.' : 'Consider posting produce directly on the AgroSaathi Marketplace for direct buyer quotes.'}</li>
                </>
              )}
              {notification.type === 'scheme_update' && (
                <>
                  <li>{isMarathi ? 'आधार कार्ड, ७/१२ उतारा आणि बँक पासबुक तयार ठेवा.' : 'Keep Aadhaar card, 7/12 land extract, and bank passbook handy.'}</li>
                  <li>{isMarathi ? 'पात्रतेच्या अटी तपासून अंतिम तारखेपूर्वी अर्ज करा.' : 'Check eligibility requirements and apply before deadline.'}</li>
                </>
              )}
              {notification.type === 'marketplace' && (
                <>
                  <li>{isMarathi ? 'थेट खरेदीदारांशी संपर्क साधून अंतिम दर आणि वाहतूक ठरवा.' : 'Contact potential buyers directly to negotiate final rates and transport.'}</li>
                </>
              )}
              {notification.type === 'advisory' && (
                <>
                  <li>{isMarathi ? 'उत्तम उत्पन्नासाठी कृषी विज्ञान केंद्राच्या मार्गदर्शक सूचनांचे पालन करा.' : 'Follow ICAR / Krishi Vigyan Kendra guidelines for optimal yield.'}</li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium border border-input hover:bg-muted transition-colors"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
          
          <Link 
            href={actionLink.path}
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            {actionLink.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const queryClient = useQueryClient();
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = React.useState<NotificationItem | null>(null);

  const { data: notifications, isLoading } = useListNotifications(
    { unreadOnly: filter === 'unread' ? true : undefined },
    { query: { queryKey: ['notifications', filter], refetchInterval: 10000, refetchOnMount: 'always' } }
  );

  const markRead = useMarkNotificationRead({
    mutation: {
      onSuccess: () => {
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

  const handleOpenNotification = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markRead.mutate({ notificationId: notification.id });
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

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <AppLayout>
      <PageHeader 
        title={isMarathi ? 'सूचना व इशारे' : 'Alerts & Notifications'} 
        description={isMarathi ? 'महत्त्वाचे हवामान अंदाज, बाजारभाव अपडेट्स आणि योजनांच्या तारखा.' : 'Important weather advisories, market updates, and scheme deadlines.'}
        accentColor="border-rose-500"
        actions={
          <button 
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || unreadCount === 0}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-card border border-input rounded-xl hover:bg-muted disabled:opacity-50 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> {isMarathi ? 'सर्व वाचल्याचे चिन्हांकित करा' : 'Mark all as read'}
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
        >
          {isMarathi ? 'सर्व सूचना' : 'All Notifications'}
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${filter === 'unread' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
        >
          {isMarathi ? `न वाचलेल्या (${unreadCount})` : `Unread (${unreadCount})`}
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
        ) : Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map(notification => {
            const titleText = isMarathi && (notification as any).titleMr ? (notification as any).titleMr : notification.title;
            const messageText = isMarathi && (notification as any).messageMr ? (notification as any).messageMr : notification.message;

            return (
              <div 
                key={notification.id} 
                onClick={() => handleOpenNotification(notification)}
                className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all hover:shadow-md ${getBgColor(notification.type, notification.isRead)} ${notification.isRead ? 'border-border opacity-80 hover:opacity-100' : 'border-l-4 shadow-xs'}`}
              >
                <div className="mt-1 shrink-0 bg-background/80 p-2.5 rounded-full shadow-xs">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`font-bold ${notification.isRead ? 'text-foreground/80' : 'text-foreground'}`}>
                      {titleText}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-mono mt-1">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                    {messageText}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNotification(notification);
                      }}
                      className="text-xs font-bold text-primary uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isMarathi ? 'सविस्तर माहिती पहा' : 'View Full Details'} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {!notification.isRead && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                        {isMarathi ? 'नवीन' : 'NEW'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center flex flex-col items-center bg-card border border-border rounded-2xl">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {isMarathi 
                ? (filter === 'unread' ? 'सध्या न वाचलेल्या सूचना नाहीत.' : 'सध्या कोणत्या ही सूचना उपलब्ध नाहीत.')
                : `No ${filter === 'unread' ? 'unread ' : ''}notifications right now.`}
            </p>
            {filter === 'unread' && (
              <button 
                onClick={() => setFilter('all')}
                className="mt-4 text-primary font-medium hover:underline cursor-pointer"
              >
                {isMarathi ? 'सर्व सूचना पहा' : 'View all notifications'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal 
          notification={selectedNotification} 
          onClose={() => setSelectedNotification(null)}
          isMarathi={isMarathi}
        />
      )}
    </AppLayout>
  );
}
