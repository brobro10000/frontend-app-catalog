import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Container, Spinner } from '@openedx/paragon';
import { LocalCourse, localGet, localImage } from '../catalog/LocalCatalog';

const CourseAboutPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<LocalCourse>();
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let active = true;
    setCourse(undefined);
    setError('');
    localGet(`course/${encodeURIComponent(courseId || '')}`)
      .then(result => { if (active) { setCourse(result); } })
      .catch(reason => { if (active) { setError(reason.message); } });
    return () => { active = false; };
  }, [courseId]);
  useEffect(() => { if (course) { heading.current?.focus(); document.title = `${course.title} | Course Atlas`; } }, [course]);
  if (error) { return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>; }
  if (!course) { return <Container className="py-5"><Spinner animation="border" screenReaderText="Loading course" /></Container>; }
  return (
    <Container size="lg" className="py-5" data-testid="course-about-page">
      <Link to="/courses">← Explore all courses</Link>
      <div className="row my-4">
        <div className="col-lg-7">
          {course.provider_logo && <img src={localImage(course.provider_logo)} alt={course.provider} style={{ maxWidth: 180, maxHeight: 100 }} className="mb-3" />}
          <p>{course.provider}</p>
          <h1 ref={heading} tabIndex={-1}>{course.title}</h1>
          <p className="lead">{course.summary}</p>
          <p>{course.level} · {course.languages.join(', ')}{course.weeks ? ` · ${course.weeks} weeks` : ''}</p>
          <a className="btn btn-primary" href={`http://localhost:8765/course/${encodeURIComponent(course.key)}`}>Save to your local shortlist</a>
          <p className="small mt-3">Public information from {course.snapshot_date}. Imported metadata does not include lessons or local enrollment.</p>
        </div>
        <div className="col-lg-5"><img className="img-fluid rounded" src={localImage(course.original_image_url)} alt={`Course artwork for ${course.title}`} /></div>
      </div>
      <div className="row">
        <section className="col-lg-8">
          <h2>About this course</h2><p style={{ whiteSpace: 'pre-line' }}>{course.description || course.summary}</p>
          {course.outcomes && <><h2>What you’ll learn</h2><p style={{ whiteSpace: 'pre-line' }}>{course.outcomes}</p></>}
        </section>
        <section className="col-lg-4"><h2>Skills you can build</h2><ul>{course.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section>
      </div>
    </Container>
  );
};
export default CourseAboutPage;
