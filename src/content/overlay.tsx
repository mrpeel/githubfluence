import React from 'react';
import { RichEditor } from './editor';
import { getCommitMessage, generateDiffSummary } from '../shared/markdown';
import type { PageInfo } from '../shared/types';

interface OverlayProps {
  pageInfo: PageInfo;
  originalMarkdown: string;
  onClose: () => void;
  onApply?: (content: string) => void;
}

export function EditorOverlay({ pageInfo, originalMarkdown, onClose, onApply }: OverlayProps) {
  const currentRef = React.useRef(originalMarkdown);
  const [commitMsg, setCommitMsg] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    setCommitMsg(getCommitMessage(pageInfo.path, originalMarkdown, originalMarkdown));
  }, [pageInfo.path, originalMarkdown]);

  const handleContentChange = (md: string) => {
    currentRef.current = md;
    setCommitMsg(getCommitMessage(pageInfo.path, originalMarkdown, md));
    setError(null);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(currentRef.current);
    }
  };

  const handleSave = async () => {
    setError(null);
    try {
      const editUrl = `https://github.com/${pageInfo.owner}/${pageInfo.repo}/edit/${pageInfo.branch}/${pageInfo.path}`;
      window.open(editUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open edit page');
    }
  };

  const handleConfirmSave = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    handleSave();
  };

  const hasChanges = originalMarkdown !== currentRef.current;
  const diffSummary = hasChanges ? generateDiffSummary(originalMarkdown, currentRef.current) : null;

  return (
    <div className="ghf-overlay">
      <div className="ghf-overlay-backdrop" onClick={onClose} />
      <div className="ghf-overlay-panel">
        <div className="ghf-overlay-header">
          <h2 className="ghf-overlay-title">
            {onApply ? 'Live Editor' : 'Editing'} <span className="ghf-filename">{pageInfo.path}</span>
          </h2>
          <div className="ghf-header-actions">
            <span className="ghf-repo-badge">{pageInfo.owner}/{pageInfo.repo}</span>
            <button className="ghf-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        <div className="ghf-overlay-body">
          <RichEditor
            initialContent={originalMarkdown}
            onContentChange={handleContentChange}
          />
        </div>

        <div className="ghf-overlay-footer">
          <div className="ghf-footer-left">
            {diffSummary && (
              <span className="ghf-diff-summary">{diffSummary}</span>
            )}
            {error && <span className="ghf-error">✗ {error}</span>}
          </div>
          <div className="ghf-footer-right">
            {onApply ? (
              <>
                <button className="ghf-btn ghf-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="ghf-btn ghf-btn-primary"
                  onClick={handleApply}
                >
                  Done
                </button>
              </>
            ) : showConfirm ? (
              <>
                <input
                  className="ghf-commit-input"
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  placeholder="Commit message"
                />
                <button
                  className="ghf-btn ghf-btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="ghf-btn ghf-btn-primary"
                  onClick={handleSave}
                >
                  Open Edit Page
                </button>
              </>
            ) : (
              <>
                <button className="ghf-btn ghf-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="ghf-btn ghf-btn-primary"
                  onClick={handleConfirmSave}
                  disabled={!hasChanges}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
