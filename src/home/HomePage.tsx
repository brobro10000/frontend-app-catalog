import { Container } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import messages from './marketing-messages';

const HomePage = () => (
  <div className="atlas-home">
    <Container size="lg">
      <section className="atlas-hero" aria-labelledby="atlas-headline">
        <div className="atlas-hero-copy">
          <p className="atlas-eyebrow"><FormattedMessage {...messages.eyebrow} /></p>
          <h1 id="atlas-headline"><FormattedMessage {...messages.headline} /></h1>
          <p className="atlas-intro"><FormattedMessage {...messages.intro} /></p>
          <div className="atlas-actions">
            <a href="/courses" className="btn btn-primary"><FormattedMessage {...messages.explore} /></a>
            <a href="/personalized" className="atlas-text-link">
              <FormattedMessage {...messages.personalized} /> <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="atlas-promo">
          <div className="atlas-orbit" aria-hidden="true"><span /><span /><span /></div>
          <p className="atlas-eyebrow"><FormattedMessage {...messages.cardLabel} /></p>
          <h2><FormattedMessage {...messages.cardTitle} /></h2>
          <p><FormattedMessage {...messages.cardText} /></p>
        </div>
      </section>
      <section className="atlas-topics" aria-labelledby="atlas-topics-title">
        <h2 id="atlas-topics-title"><FormattedMessage {...messages.subjects} /></h2>
        <p><FormattedMessage {...messages.subjectIntro} /></p>
        <div className="atlas-topic-grid">
          {([
            ['ai', 'artificial intelligence'], ['business', 'leadership'], ['data', 'data science'],
          ] as const).map(([name, query], index) => (
            <a href={`/courses?search_query=${encodeURIComponent(query)}`} key={name}>
              <span className="atlas-topic-number" aria-hidden="true">0{index + 1}</span>
              <span><FormattedMessage {...messages[name]} /></span><span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </Container>
  </div>
);

export default HomePage;
