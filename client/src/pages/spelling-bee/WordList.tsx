import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Collapse, Button } from "react-bootstrap";
import "./WordList.scss";
import WordListTestIds from "./WordList.testIds";

interface WordListProps {
  words?: string[];
  maxScore?: number;
}

const WordList: React.FC<WordListProps> = ({ 
  words = [], 
  maxScore = 120
}) => {
  const { t } = useTranslation("spellingBee");
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort words by length first, then alphabetically
  const sortedWords = [...words].sort((a, b) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return a.localeCompare(b);
  });

  // Group words by length
  const wordsByLength = sortedWords.reduce((acc, word) => {
    const length = word.length;
    if (!acc[length]) {
      acc[length] = [];
    }
    acc[length].push(word);
    return acc;
  }, {} as Record<number, string[]>);

  const wordLengths = Object.keys(wordsByLength)
    .map(Number)
    .sort((a, b) => a - b);

  // Calculate words found vs total possible
  const wordsFound = sortedWords.length;
  const totalWords = Math.ceil(maxScore / 5); // Rough estimate

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="word-list-container"
      data-testid={WordListTestIds.container}
    >
      {/* Header - always visible */}
      <div 
        className="word-list-header"
        data-testid={WordListTestIds.header}
      >
        <div className="word-list-title">
          <h5 data-testid={WordListTestIds.title}>{t("wordlist-title")}</h5>
          <span 
            className="word-count"
            data-testid={WordListTestIds.count}
          >
            {t("wordlist-count", { found: wordsFound, total: totalWords })}
          </span>
        </div>
        
        {/* Expand/Collapse button - only visible on small screens */}
        <Button
          variant="link"
          className="word-list-toggle d-md-none"
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
          aria-controls="word-list-content"
          data-testid={WordListTestIds.toggle}
        >
          <i 
            className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}
            data-testid={WordListTestIds.toggleIcon}
          ></i>
        </Button>
      </div>

      {/* Content - collapsible on small screens, always visible on md+ */}
      <div className="word-list-content-wrapper">
        <Collapse in={isExpanded} className="d-md-none">
          <div id="word-list-content" data-testid={WordListTestIds.mobileContent}>
            <WordListContent 
              wordsByLength={wordsByLength} 
              wordLengths={wordLengths}
              isMobile={true}
            />
          </div>
        </Collapse>
        
        {/* Always visible on md+ screens */}
        <div 
          className="d-none d-md-block"
          data-testid={WordListTestIds.desktopContent}
        >
          <WordListContent 
            wordsByLength={wordsByLength} 
            wordLengths={wordLengths}
            isMobile={false}
          />
        </div>
      </div>
    </div>
  );
};

// Separate component for the actual word list content
const WordListContent: React.FC<{
  wordsByLength: Record<number, string[]>;
  wordLengths: number[];
  isMobile: boolean;
}> = ({ wordsByLength, wordLengths, isMobile }) => {
  const { t } = useTranslation("spellingBee");

  if (wordLengths.length === 0) {
    return (
      <div 
        className="word-list-empty"
        data-testid={WordListTestIds.empty}
      >
        <p>{t("wordlist-empty")}</p>
      </div>
    );
  }

  return (
    <div 
      className="word-list-content"
      data-testid={WordListTestIds.wordContent(isMobile ? 'mobile' : 'desktop')}
    >
      {wordLengths.map(length => (
        <div 
          key={length} 
          className="word-length-group"
          data-testid={WordListTestIds.wordGroup(length)}
        >
          <div className="word-length-header">
            <span 
              className="word-length-label"
              data-testid={WordListTestIds.wordGroupLabel(length)}
            >
              {t("wordlist-length-label", { length, count: wordsByLength[length].length })}
            </span>
          </div>
          <div 
            className="words-grid"
            data-testid={WordListTestIds.wordGroupGrid(length)}
          >
            {wordsByLength[length].map((word, index) => (
              <span 
                key={`${word}-${index}`} 
                className="word-item"
                data-testid={WordListTestIds.wordItem(word)}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WordList;