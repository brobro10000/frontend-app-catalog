import axe from 'axe-core';
import { render, screen } from '../setupTest';
import HomePage from './HomePage';
import AtlasHeader from './AtlasHeader';

beforeEach(() => { window.testHistory = ['/']; });

it('offers local course discovery and personalized recommendations', async () => {
  const { container } = render(<><AtlasHeader /><main id="main-content"><HomePage /></main></>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your next chapter starts with curiosity.');
  expect(screen.getByRole('link', { name: /Find my next step/ }))
    .toHaveAttribute('href', '/personalized');
  expect(screen.getByRole('link', { name: /Artificial intelligence/ }))
    .toHaveAttribute('href', '/courses?search_query=artificial%20intelligence');
  expect(container.textContent).not.toMatch(/edx|2u/i);
  const result = await axe.run(container, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
    // JSDOM has no layout engine; verify contrast in the rendered browser.
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});
