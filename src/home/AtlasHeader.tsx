import { Container } from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import messages from './marketing-messages';

const AtlasHeader = () => {
  const intl = useIntl();
  return (
    <header className="atlas-header">
      <a className="atlas-skip" href="#main-content"><FormattedMessage {...messages.skip} /></a>
      <Container size="lg" className="atlas-header-inner">
        <Link to="/" className="atlas-brand" aria-label={intl.formatMessage(messages.home)}>
          <span className="atlas-mark" aria-hidden="true">a</span>
          <span>course atlas<small><FormattedMessage {...messages.local} /></small></span>
        </Link>
        <nav aria-label={intl.formatMessage(messages.nav)}>
          <a href="/courses"><FormattedMessage {...messages.explore} /></a>
          <a href="/personalized"><FormattedMessage {...messages.forYou} /></a>
          <a href="/learning"><FormattedMessage {...messages.learning} /></a>
        </nav>
      </Container>
    </header>
  );
};

export default AtlasHeader;
