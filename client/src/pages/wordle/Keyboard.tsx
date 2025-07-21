import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Backspace } from "react-bootstrap-icons";

import "./Keyboard.scss";
import { keyboardTestIds } from "./Keyboard.testIds";

export type LetterStatus = 'correct' | 'present' | 'absent' | 'unused';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  letterStatuses: Record<string, LetterStatus>;
  disabled?: boolean;
}

// Keyboard layouts for different languages
const KEYBOARD_LAYOUTS = {
  en: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ],
  da: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Æ', 'Ø'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ]
} as const;

const Keyboard: React.FC<KeyboardProps> = ({ 
  onKeyPress, 
  onEnter, 
  onBackspace, 
  letterStatuses, 
  disabled = false 
}) => {
  const { i18n } = useTranslation();
  
  // Get the current language, default to English if not Danish
  const currentLanguage = i18n.language === 'da' ? 'da' : 'en';
  const layout = KEYBOARD_LAYOUTS[currentLanguage];

  const handleKeyClick = useCallback((key: string) => {
    if (disabled) return;
    
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  }, [disabled, onEnter, onBackspace, onKeyPress]);

  const getKeyStatus = (key: string): LetterStatus => {
    return letterStatuses[key.toLowerCase()] || 'unused';
  };

  const renderKey = (key: string, index: number) => {
    const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
    const status = isSpecialKey ? 'unused' : getKeyStatus(key);
    
    return (
      <Button
        key={`${key}-${index}`}
        className={`keyboard-key ${status} ${isSpecialKey ? 'special-key' : 'letter-key'} ${key.toLowerCase()}`}
        onClick={() => handleKeyClick(key)}
        disabled={disabled}
        data-testid={
          key === 'ENTER' 
            ? keyboardTestIds.enter 
            : key === 'BACKSPACE' 
              ? keyboardTestIds.backspace 
              : `${keyboardTestIds.letter}-${key.toLowerCase()}`
        }
        aria-label={
          key === 'ENTER' 
            ? 'Enter' 
            : key === 'BACKSPACE' 
              ? 'Backspace' 
              : key
        }
      >
        {key === 'BACKSPACE' ? (
          <Backspace size={18} />
        ) : (
          key
        )}
      </Button>
    );
  };

  return (
    <Container 
      className="keyboard-container" 
      data-testid={keyboardTestIds.container}
    >
      {layout.map((row, rowIndex) => (
        <Row 
          key={rowIndex} 
          className={`keyboard-row row-${rowIndex}`}
          data-testid={`${keyboardTestIds.row}-${rowIndex}`}
          noGutters
        >
          <Col className="d-flex justify-content-center gap-1">
            {row.map((key, keyIndex) => renderKey(key, keyIndex))}
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default Keyboard;