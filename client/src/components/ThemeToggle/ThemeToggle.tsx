import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label="Check this switch"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    />
  );
}

export default ThemeToggle;