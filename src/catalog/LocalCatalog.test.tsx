import axe from 'axe-core';
import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '../setupTest';
import LocalCatalog from './LocalCatalog';
import CourseAboutPage from '../course-about/CourseAboutPage';

const course = {
  key: 'Example+Python',
  title: 'Python for Analysis',
  provider: 'Example University',
  description: 'Learn Python with practical exercises.',
  summary: 'Build Python skills.',
  outcomes: 'Analyze data.',
  image_url: '/media/course.png',
  original_image_url: '/media/course.png',
  provider_logo: '/media/logo.png',
  skills: ['Python'],
  level: 'Introductory',
  languages: ['English'],
  weeks: 4,
  snapshot_date: '2026-11-21',
};

beforeEach(() => {
  window.testHistory = ['/'];
  global.fetch = jest.fn(async (path) => ({
    ok: true,
    json: async () => {
      if (String(path).includes('/meta')) { return { languages: ['English'], levels: ['Introductory'] }; }
      if (String(path).includes('/course/')) { return course; }
      return { courses: [course], total: 1 };
    },
  })) as jest.Mock;
});

const checkAccessibility = async (container: HTMLElement) => {
  const result = await axe.run(container, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(result.violations).toEqual([]);
};

it('renders local search results and accessible controls', async () => {
  const { container } = render(<LocalCatalog />);
  expect(await screen.findByRole('link', { name: course.title })).toHaveAttribute('href', '/courses/Example%2BPython/about');
  await checkAccessibility(container);
});

it('renders local course facts without external enrollment links', async () => {
  window.testHistory = ['/courses/Example%2BPython/about'];
  const { container } = render(<Routes><Route path="/courses/:courseId/about" element={<CourseAboutPage />} /></Routes>);
  expect(await screen.findByRole('heading', { name: course.title })).toHaveFocus();
  expect(screen.getByText(/Imported metadata does not include lessons/)).toBeInTheDocument();
  expect(container.querySelector('a[href*="edx.org"]')).toBeNull();
  await checkAccessibility(container);
});

it('shows a recoverable error instead of empty success when the index is unavailable', async () => {
  global.fetch = jest.fn(async () => { throw new Error('Local index unavailable. Retry shortly.'); }) as jest.Mock;
  render(<LocalCatalog />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Local index unavailable');
  await waitFor(() => expect(screen.queryByText('No courses match.')).not.toBeInTheDocument());
});
