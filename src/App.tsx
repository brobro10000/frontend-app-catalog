import { AppProvider } from '@edx/frontend-platform/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Routes } from 'react-router-dom';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import AtlasHeader from './home/AtlasHeader';
import messages from './home/marketing-messages';

import HomePage from './home/HomePage';
import CatalogPage from './catalog/LocalCatalog';
import CourseAboutPage from './course-about/CourseAboutPage';
import NotFoundPage from './not-found-page/NotFoundPage';
import { ROUTES } from './routes';

const queryClient = new QueryClient();

const App = () => (
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <AtlasHeader />
      <main id="main-content" tabIndex={-1} className="d-flex flex-column flex-grow-1">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COURSES} element={<CatalogPage />} />
          <Route path={ROUTES.COURSE_ABOUT} element={<CourseAboutPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="atlas-footer">
        <Link to="/">course atlas</Link>
        <p><FormattedMessage {...messages.footer} /></p>
        <a className="d-block mt-2" href="http://localhost:8765/licenses.html">Licenses, attribution &amp; source</a>
      </footer>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
