import { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import Header from './components/Header/Header';
import './App.scss';


interface ApiResponse {
  message: string;
  timestamp: string;
  environment: string;
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Using relative path - Vite proxy will forward to localhost:3001
    fetch('/api/test')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        setApiData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="app-header text-center">
        <Container>
          <h1>🚀 Ordish - Full Stack App</h1>
          <p className="lead mb-0">React + TypeScript + Express + Bootstrap + SCSS</p>
        </Container>
      </div>

      <Container className="main-content">
        {/* API Status Section */}
        <Card className="api-response-card mb-4">
          <Card.Header className="d-flex align-items-center">
            <span className={`status-indicator ${loading ? 'loading' : error ? 'error' : 'success'}`}></span>
            API Connection Status
          </Card.Header>
          <Card.Body>
            {loading && (
              <div className="text-center">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading API data...</span>
              </div>
            )}
            
            {error && (
              <Alert variant="danger" className="mb-0">
                <strong>Error:</strong> {error}
              </Alert>
            )}
            
            {apiData && (
              <div>
                <p><strong>Message:</strong> {apiData.message}</p>
                <p><strong>Environment:</strong> 
                  <Badge bg={apiData.environment === 'production' ? 'success' : 'warning'} className="ms-2">
                    {apiData.environment}
                  </Badge>
                </p>
                <p><strong>Timestamp:</strong> 
                  <span className="timestamp ms-2">
                    {new Date(apiData.timestamp).toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Features Section */}
        <Card>
          <Card.Header>
            <h3 className="mb-0">🎯 Development Setup Complete!</h3>
          </Card.Header>
          <Card.Body>
            <ListGroup className="feature-checklist" variant="flush">
              <ListGroup.Item>React Frontend (Vite + TypeScript)</ListGroup.Item>
              <ListGroup.Item>Express Backend (TypeScript + ES Modules)</ListGroup.Item>
              <ListGroup.Item>Bootstrap 5 + React Bootstrap Components</ListGroup.Item>
              <ListGroup.Item>SCSS with Variables and Nesting</ListGroup.Item>
              <ListGroup.Item>API Proxy Configuration</ListGroup.Item>
              <ListGroup.Item>Production Build Support</ListGroup.Item>
              <ListGroup.Item>Responsive Design</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
