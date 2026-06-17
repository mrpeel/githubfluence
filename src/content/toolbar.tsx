import { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import {
  BoldIcon, ItalicIcon, StrikeIcon, CodeIcon, CodeBlockIcon,
  BulletListIcon, OrderedListIcon, TaskListIcon,
  BlockquoteIcon, HorizontalRuleIcon,
  LinkIcon, ImageIcon, TableIcon,
  UndoIcon, RedoIcon, EmojiIcon,
  AlertNoteIcon, AlertTipIcon, AlertImportantIcon, AlertWarningIcon, AlertCautionIcon,
} from './icons';
import { EmojiPicker, TableGridPicker } from './emoji-picker';
import type { AlertType } from './github-alert';

interface ToolbarProps {
  editor: Editor | null;
}

function IconBtn({ icon, active, title, onClick }: {
  icon: React.ReactNode;
  active?: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ghf-tb-btn ${active ? 'ghf-tb-active' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );
}

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="ghf-dropdown-wrap">
      <button type="button" className="ghf-tb-btn" onClick={() => setOpen(!open)} title={label}>
        {label}<span className="ghf-drop-arrow">▾</span>
      </button>
      {open && <div className="ghf-popover ghf-dropdown-menu">{children}</div>}
    </div>
  );
}

function LinkPrompt({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      onClose();
    }
  };

  return (
    <div ref={ref} className="ghf-popover ghf-link-prompt">
      <input
        className="ghf-input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="https://..."
        autoFocus
      />
      <button type="button" className="ghf-tb-btn" onClick={handleSubmit} disabled={!url}>✓</button>
    </div>
  );
}

function ImagePrompt({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (src && alt) {
      editor.chain().focus().setImage({ src, alt }).run();
      onClose();
    }
  };

  return (
    <div ref={ref} className="ghf-popover ghf-image-prompt">
      <input className="ghf-input" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="Image URL..." />
      <input className="ghf-input" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text..." />
      <button type="button" className="ghf-tb-btn" onClick={handleSubmit} disabled={!src || !alt}>✓</button>
    </div>
  );
}

const ALERTS: { type: AlertType; label: string; icon: React.ReactNode }[] = [
  { type: 'note', label: 'Note', icon: <AlertNoteIcon /> },
  { type: 'tip', label: 'Tip', icon: <AlertTipIcon /> },
  { type: 'important', label: 'Important', icon: <AlertImportantIcon /> },
  { type: 'warning', label: 'Warning', icon: <AlertWarningIcon /> },
  { type: 'caution', label: 'Caution', icon: <AlertCautionIcon /> },
];

export function Toolbar({ editor }: ToolbarProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showTable, setShowTable] = useState(false);

  if (!editor) return null;

  const headingLevel = [1, 2, 3, 4, 5, 6].find((l) => editor.isActive('heading', { level: l })) || 0;
  const headingLabel = headingLevel ? `H${headingLevel}` : 'T';

  const currentAlert = ALERTS.find((a) => {
    const { state } = editor;
    const { from } = state.selection;
    const $pos = state.doc.resolve(from);
    for (let d = $pos.depth; d > 0; d--) {
      const node = $pos.node(d);
      if (node.type.name === 'blockquote') {
        const first = node.firstChild;
        if (first) {
          const text = first.textContent || '';
          const m = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i);
          if (m) return m[1].toLowerCase() === a.type;
        }
      }
    }
    return false;
  });

  return (
    <div className="ghf-toolbar">
      <div className="ghf-tb-group">
        <IconBtn icon={<BoldIcon />} active={editor.isActive('bold')} title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} />
        <IconBtn icon={<ItalicIcon />} active={editor.isActive('italic')} title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} />
        <IconBtn icon={<StrikeIcon />} active={editor.isActive('strike')} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} />
        <IconBtn icon={<CodeIcon />} active={editor.isActive('code')} title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} />
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group">
        <Dropdown label={headingLabel}>
          <button type="button" className={`ghf-dd-item ${!headingLevel ? 'ghf-dd-active' : ''}`} onClick={() => editor.chain().focus().setParagraph().run()}>Normal</button>
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button
              key={l}
              type="button"
              className={`ghf-dd-item ${headingLevel === l ? 'ghf-dd-active' : ''}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: l as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
            >
              Heading {l}
            </button>
          ))}
        </Dropdown>
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group">
        <IconBtn icon={<BulletListIcon />} active={editor.isActive('bulletList')} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <IconBtn icon={<OrderedListIcon />} active={editor.isActive('orderedList')} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <IconBtn icon={<TaskListIcon />} active={editor.isActive('taskList')} title="Task List" onClick={() => editor.chain().focus().toggleTaskList().run()} />
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group">
        <IconBtn icon={<BlockquoteIcon />} active={editor.isActive('blockquote')} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <IconBtn icon={<CodeBlockIcon />} active={editor.isActive('codeBlock')} title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <IconBtn icon={<HorizontalRuleIcon />} active={false} title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group" style={{ position: 'relative' }}>
        <IconBtn icon={<LinkIcon />} active={editor.isActive('link')} title="Link" onClick={() => setShowLink(!showLink)} />
        {showLink && <LinkPrompt editor={editor} onClose={() => setShowLink(false)} />}
      </div>

      <div className="ghf-tb-group" style={{ position: 'relative' }}>
        <IconBtn icon={<ImageIcon />} active={false} title="Image" onClick={() => setShowImage(!showImage)} />
        {showImage && <ImagePrompt editor={editor} onClose={() => setShowImage(false)} />}
      </div>

      <div className="ghf-tb-group" style={{ position: 'relative' }}>
        <IconBtn icon={<TableIcon />} active={false} title="Insert Table" onClick={() => setShowTable(!showTable)} />
        {showTable && <TableGridPicker onSelect={(r, c) => editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run()} onClose={() => setShowTable(false)} />}
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group">
        <Dropdown label={currentAlert ? currentAlert.label : 'Alert'}>
          {ALERTS.map((a) => (
            <button
              key={a.type}
              type="button"
              className={`ghf-dd-item ${currentAlert?.type === a.type ? 'ghf-dd-active' : ''}`}
              onClick={() => editor.chain().focus().toggleGitHubAlert(a.type).run()}
            >
              {a.icon}{a.label}
            </button>
          ))}
        </Dropdown>
      </div>

      <div className="ghf-tb-group" style={{ position: 'relative' }}>
        <IconBtn icon={<EmojiIcon />} active={false} title="Emoji" onClick={() => setShowEmoji(!showEmoji)} />
        {showEmoji && <EmojiPicker onSelect={(s) => { editor.chain().focus().insertContent(s).run(); setShowEmoji(false); }} onClose={() => setShowEmoji(false)} />}
      </div>

      <div className="ghf-tb-sep" />

      <div className="ghf-tb-group">
        <IconBtn icon={<UndoIcon />} active={false} title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} />
        <IconBtn icon={<RedoIcon />} active={false} title="Redo (Ctrl+Shift+Z)" onClick={() => editor.chain().focus().redo().run()} />
      </div>
    </div>
  );
}
