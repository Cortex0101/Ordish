import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, preferences, updatePreferences, logout } = useAuth();
  const { t } = useTranslation(['profile', 'common']);
  const navigate = useNavigate();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'auto',
    language: preferences?.language || 'en',
    timezone: preferences?.timezone || 'UTC'
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  const getInitials = () => {
    return user.username?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || '?';
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      await updatePreferences(formData);
      setUpdateMessage(t('preferences_updated', 'Preferences updated successfully!'));
    } catch {
      setUpdateMessage(t('update_error', 'Failed to update preferences'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex align-items-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-3"
                    style={{ width: '48px', height: '48px', fontSize: '18px', fontWeight: 'bold' }}
                  >
                    {getInitials()}
                  </div>
                )}
                <div>
                  <h5 className="mb-0">{user.username}</h5>
                  <small className="text-white-50">{user.email}</small>
                </div>
              </div>
            </Card.Header>
            
            <Card.Body>
              {updateMessage && (
                <Alert 
                  variant={updateMessage.includes('success') ? 'success' : 'danger'} 
                  dismissible 
                  onClose={() => setUpdateMessage(null)}
                >
                  {updateMessage}
                </Alert>
              )}

              {/* Account Information */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">{t('account_info', 'Account Information')}</h6>
                <Row>
                  <Col sm={4} className="fw-semibold">{t('username', 'Username')}:</Col>
                  <Col sm={8}>{user.username}</Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={4} className="fw-semibold">{t('email', 'Email')}:</Col>
                  <Col sm={8}>{user.email}</Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={4} className="fw-semibold">{t('user_id', 'User ID')}:</Col>
                  <Col sm={8}>
                    <Badge bg="secondary" className="font-monospace">#{user.id}</Badge>
                  </Col>
                </Row>
              </div>

              {/* Preferences */}
              <Form onSubmit={handlePreferencesUpdate}>
                <h6 className="text-muted mb-3">{t('preferences', 'Preferences')}</h6>
                
                <Row className="mb-3">
                  <Col sm={4}>
                    <Form.Label className="fw-semibold">{t('theme', 'Theme')}</Form.Label>
                  </Col>
                  <Col sm={8}>
                    <Form.Select
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      size="sm"
                    >
                      <option value="light">{t('light', 'Light')}</option>
                      <option value="dark">{t('dark', 'Dark')}</option>
                      <option value="auto">{t('auto', 'Auto')}</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4}>
                    <Form.Label className="fw-semibold">{t('language', 'Language')}</Form.Label>
                  </Col>
                  <Col sm={8}>
                    <Form.Select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      size="sm"
                    >
                      <option value="en">English</option>
                      <option value="da">Dansk</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={4}>
                    <Form.Label className="fw-semibold">{t('timezone', 'Timezone')}</Form.Label>
                  </Col>
                  <Col sm={8}>
                    <Form.Select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      size="sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </Form.Select>
                  </Col>
                </Row>

                <div className="d-flex gap-2 justify-content-between">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isUpdating}
                    size="sm"
                  >
                    {isUpdating && <Spinner animation="border" size="sm" className="me-2" />}
                    {t('save_preferences', 'Save Preferences')}
                  </Button>
                  
                  <Button 
                    variant="outline-danger" 
                    onClick={handleLogout}
                    size="sm"
                  >
                    {t('logout', 'Logout')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
