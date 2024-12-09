import {ApplicationConfig, provideZoneChangeDetection, inject} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {provideApollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {setContext} from '@apollo/client/link/context';
import {AUTH_TOKEN_KEY} from '../services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideApollo(() => {
      const httpLink = inject(HttpLink);
      const auth = setContext((operation, context) => {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        if (token === null) {
          return {};
        } else
          return {
            headers: {
              auth: `${token}`
            }
          };
      });
      return {
        link: ApolloLink.from([auth, httpLink.create({
          uri: 'http://localhost:8180/graphql',
        })]),
        cache: new InMemoryCache(),
      };
    })]
};
