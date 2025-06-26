import { wordleFeedback } from './Feedback';

describe('wordleFeedback', () => {
  it('returns all green for exact match', () => {
    expect(wordleFeedback('APPLE', 'APPLE')).toEqual(['G', 'G', 'G', 'G', 'G']);
  });

  it('returns all black for no matches', () => {
    expect(wordleFeedback('AAAAA', 'BBBBB')).toEqual(['B', 'B', 'B', 'B', 'B']);
  });

  it('returns correct feedback for mixed case', () => {
    expect(wordleFeedback('ALERT', 'ALTER')).toEqual(['G', 'G', 'Y', 'Y', 'Y']);
  });
});