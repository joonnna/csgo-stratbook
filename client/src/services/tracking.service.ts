import { Log } from '@/utils/logger';
import splitbee from '@splitbee/web';
import Analytics, { AnalyticsInstance } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import pkg from '../../package.json';
import { GA_ID, SPLITBEE_ID } from '@/config';

export default class TrackingService {
  private static instance: TrackingService;
  private analyticsInstance!: AnalyticsInstance;
  private initialized = false;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  init(disableCookie = false) {
    splitbee.init({ disableCookie, token: SPLITBEE_ID });

    this.analyticsInstance = Analytics({
      app: 'cs-stratbook',
      version: pkg.version,
      debug: process.env.NODE_ENV === 'development',
      plugins: [
        googleAnalytics({
          trackingId: GA_ID,
          ...(disableCookie && {
            cookieConfig: {
              storage: 'none',
              storeGac: false,
            },
          }),
        }),
      ],
    });

    this.initialized = true;
    (window as any).ts = TrackingService.instance;
  }

  track(event: string, data?: Record<string, string | number | boolean>) {
    if (!this.initialized) return;

    if (window.splitbee) {
      window.splitbee.track(event, data);
      Log.info('tracking:track', event, data);
    }
  }

  page() {
    this.analyticsInstance.page();
  }

  setUser(name: string, data: Record<string, string | number | boolean>) {
    if (!this.initialized) return;

    if (window.splitbee) {
      window.splitbee.user.set({ name, ...data, appContext: window.desktopMode ? 'Desktop App' : 'Web App' });
    }

    this.analyticsInstance.identify(name, { ...data, appContext: window.desktopMode ? 'Desktop App' : 'Web App' });

    Log.info('tracking:setuser', data);
  }
}
