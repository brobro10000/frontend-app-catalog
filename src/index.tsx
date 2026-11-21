import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { mergeConfig } from '@edx/frontend-platform/config';
import { ErrorPage } from '@edx/frontend-platform/react';
import { createRoot } from 'react-dom/client';

import App from './App';
import messages from './i18n';

import './index.scss';

const container = document.getElementById('root');

const root = createRoot(container!);
subscribe(APP_READY, () => {
  root.render(<App />);
});

subscribe(APP_INIT_ERROR, (error: { message: any; }) => {
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  handlers: {
    config: () => mergeConfig({
      ENABLE_COURSE_DISCOVERY: process.env.ENABLE_COURSE_DISCOVERY === 'true',
      ENABLE_PROGRAMS: false,
      HOMEPAGE_PROMO_VIDEO_YOUTUBE_ID: '',
    }),
  },
  messages,
});
