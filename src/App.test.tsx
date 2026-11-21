import { render, screen } from './setupTest';
import App from './App';

jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@edx/frontend-component-header', () => function MockHeader() {
  return <header>Local header</header>;
});
jest.mock('./home/HomePage', () => function MockHome() {
  return <h1>Home page</h1>;
});
jest.mock('./catalog/LocalCatalog', () => function MockCatalog() {
  return <h1>Local catalog</h1>;
});
jest.mock('./course-about/CourseAboutPage', () => function MockAbout() {
  return <h1>Course details</h1>;
});
jest.mock('./not-found-page/NotFoundPage', () => function MockNotFound() {
  return <h1>Not found</h1>;
});

it.each([
  ['/', 'Home page'], ['/courses', 'Local catalog'],
  ['/courses/Example%2BPython/about', 'Course details'], ['/unknown', 'Not found'],
])('routes %s to the expected local page', (path, heading) => {
  window.testHistory = [path];
  render(<App />);
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'My learning' })).toHaveAttribute('href', 'http://localhost:1996');
});
