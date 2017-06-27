'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
require('angular-moment');

const ngRoute = require('angular-route');

import {
  routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import './app.scss';

angular.module('osuCsClassExplorerApp', [ngCookies, ngResource, ngSanitize, ngRoute, navbar, footer,
  main, constants, util, 'angularMoment'
])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['osuCsClassExplorerApp'], {
      strictDi: true
    });
  });
