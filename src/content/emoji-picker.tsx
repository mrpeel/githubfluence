import { useState, useRef, useEffect } from 'react';

const EMOJIS = [
  [':smile:', '😄'], [':laughing:', '😆'], [':blush:', '😊'], [':heart_eyes:', '😍'],
  [':kissing_heart:', '😘'], [':wink:', '😉'], [':stuck_out_tongue:', '😛'], [':sunglasses:', '😎'],
  [':scream:', '😱'], [':cry:', '😢'], [':sob:', '😭'], [':angry:', '😠'],
  [':+1:', '👍'], [':-1:', '👎'], [':clap:', '👏'], [':wave:', '👋'],
  [':muscle:', '💪'], [':pray:', '🙏'], [':fire:', '🔥'], [':sparkles:', '✨'],
  [':star:', '⭐'], [':heart:', '❤️'], [':rocket:', '🚀'], [':eyes:', '👀'],
  [':tada:', '🎉'], [':check:', '✅'], [':x:', '❌'], [':warning:', '⚠️'],
  [':question:', '❓'], [':information_source:', 'ℹ️'], [':book:', '📖'], [':memo:', '📝'],
  [':computer:', '💻'], [':bug:', '🐛'], [':chart:', '📊'], [':gem:', '💎'],
];

interface EmojiPickerProps {
  onSelect: (shortcode: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="ghf-popover ghf-emoji-picker">
      <div className="ghf-emoji-grid">
        {EMOJIS.map(([shortcode, char]) => (
          <button
            key={shortcode}
            className="ghf-emoji-btn"
            onClick={() => onSelect(char)}
            title={shortcode}
            type="button"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TableGridPicker({ onSelect, onClose }: {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}) {
  const [hover, setHover] = useState({ r: 0, c: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const MAX = 8;
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < MAX; r++) {
    for (let c = 0; c < MAX; c++) {
      cells.push({ r, c });
    }
  }

  return (
    <div ref={ref} className="ghf-popover ghf-table-picker">
      <div
        className="ghf-table-grid"
        onMouseLeave={() => setHover({ r: 0, c: 0 })}
      >
        {cells.map(({ r, c }) => (
          <div
            key={`${r}-${c}`}
            className={`ghf-table-cell ${r <= hover.r && c <= hover.c ? 'ghf-table-cell-active' : ''}`}
            onMouseEnter={() => setHover({ r, c })}
            onClick={() => {
              onSelect(r + 1, c + 1);
              onClose();
            }}
          />
        ))}
      </div>
      <div className="ghf-table-size-label">{hover.r + 1} × {hover.c + 1}</div>
    </div>
  );
}
