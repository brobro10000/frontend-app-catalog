import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Alert, Button, Card, CardGrid, Container, Form, Spinner,
} from '@openedx/paragon';

export interface LocalCourse {
  key: string; title: string; provider: string; description: string; summary: string; outcomes: string;
  image_url: string; original_image_url: string; provider_logo?: string; skills: string[]; level: string;
  languages: string[]; weeks?: number; hours_min?: number; hours_max?: number; source_url?: string;
  snapshot_date: string; image_origin: string;
}

export const localImage = (url: string) => `/atlas${url}`;
export const aboutLink = (key: string) => `/courses/${encodeURIComponent(key)}/about`;

export async function localGet(path: string) {
  const response = await fetch(`/atlas/api/${path}`);
  const result = await response.json();
  if (!response.ok) { throw new Error(result.error || 'The local catalog could not be loaded. Please retry.'); }
  return result;
}

const LocalCatalog = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get('search_query') || '';
  const language = params.get('language') || '';
  const level = params.get('level') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [value, setValue] = useState(query);
  const [data, setData] = useState<{ courses: LocalCourse[]; total: number }>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [facets, setFacets] = useState<{ languages: string[]; levels: string[] }>({ languages: [], levels: [] });
  useEffect(() => { localGet('meta').then(setFacets).catch(() => {}); }, []);
  useEffect(() => {
    let active = true;
    setValue(query);
    setLoading(true);
    setError('');
    const search = new URLSearchParams({
      q: query, language, level, page: String(page),
    });
    localGet(`courses?${search}`).then(result => { if (active) { setData(result); } })
      .catch(reason => { if (active) { setError(reason.message); } })
      .finally(() => { if (active) { setLoading(false); } });
    return () => { active = false; };
  }, [query, language, level, page]);
  const update = (key: string, next: string) => {
    const changed = new URLSearchParams(params);
    changed.set(key, next);
    if (key !== 'page') { changed.delete('page'); }
    setParams(changed);
  };
  return (
    <Container size="lg" className="py-5">
      <h1>Explore courses</h1>
      <p>Build new skills with courses from universities and organizations around the world.</p>
      <Form onSubmit={(event: React.FormEvent) => { event.preventDefault(); update('search_query', value); }}>
        <Form.Group controlId="catalog-query">
          <Form.Label>Search by topic, skill, or institution</Form.Label>
          <div className="d-flex">
            <Form.Control
              value={value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            />
            <Button type="submit" className="ml-2">Search</Button>
          </div>
        </Form.Group>
      </Form>
      <div className="d-flex flex-wrap my-4" style={{ gap: 24 }}>
        <Form.Group controlId="catalog-language">
          <Form.Label>Language</Form.Label>
          <Form.Control as="select" value={language} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => update('language', event.target.value)}>
            <option value="">All languages</option>
            {facets.languages.map(item => <option key={item}>{item}</option>)}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="catalog-level">
          <Form.Label>Level</Form.Label>
          <Form.Control as="select" value={level} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => update('level', event.target.value)}>
            <option value="">All levels</option>
            {facets.levels.map(item => <option key={item}>{item}</option>)}
          </Form.Control>
        </Form.Group>
        <a className="align-self-center" href="http://localhost:8765/personalized">Find courses for your goals →</a>
      </div>
      <div role="status" aria-live="polite">
        {loading ? <Spinner animation="border" screenReaderText="Loading courses" /> : <p>{data?.total.toLocaleString() || 0} courses found</p>}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && data?.courses.length === 0 && <Alert variant="info">No courses match. Try broader keywords or clear the filters.</Alert>}
      {!loading && !error && (
        <CardGrid hasEqualColumnHeights>
          {data?.courses.map(item => (
            <Card key={item.key}>
              <Card.ImageCap src={localImage(item.image_url)} srcAlt="" />
              <Card.Section>
                <p className="small">{item.provider}</p>
                <h2 className="h3"><Link to={aboutLink(item.key)}>{item.title}</Link></h2>
                <p>{item.level}{item.weeks ? ` · ${item.weeks} weeks` : ''}</p>
                <p className="small">{item.skills.slice(0, 3).join(' · ')}</p>
              </Card.Section>
              <Card.Footer><Link to={aboutLink(item.key)}>View course details</Link></Card.Footer>
            </Card>
          ))}
        </CardGrid>
      )}
      {!!data?.total && (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ gap: 20 }}>
          <Button variant="outline-primary" disabled={page <= 1} onClick={() => update('page', String(page - 1))}>Previous</Button>
          <span>Page {page} of {Math.ceil(data.total / 12)}</span>
          <Button variant="outline-primary" disabled={page * 12 >= data.total} onClick={() => update('page', String(page + 1))}>Next</Button>
        </div>
      )}
    </Container>
  );
};

export default LocalCatalog;
