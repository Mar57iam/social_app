import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { errorInterceptorInterceptor } from './core/interceptors/error-interceptor-interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withInMemoryScrolling({scrollPositionRestoration: 'top'} ) ,
      withViewTransitions() ,
      withHashLocation()  ),
    provideHttpClient(withFetch() , withInterceptors([headerInterceptor, errorInterceptorInterceptor , loadingInterceptor])),
    importProvidersFrom(NgxSpinnerModule)
  ]
};
