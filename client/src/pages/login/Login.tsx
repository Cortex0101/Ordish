import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './Login.scss';

function Login() {
    const { t } = useTranslation('login');

    return (
    <div className="app-container">
      <div className="app-header text-center">
        <Container>
          <h1>🚀 Ordish - {t('welcome')}</h1>
          <p className="lead mb-0">React + TypeScript + Express + Bootstrap + SCSS</p>
        </Container>
      </div>
      </div>
    );
}

export default Login;