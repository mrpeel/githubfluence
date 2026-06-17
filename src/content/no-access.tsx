import React from 'react';

interface NoAccessProps {
  owner: string;
  repo: string;
  errorMsg?: string;
  onClose: () => void;
}

export function NoAccessOverlay({ owner, repo, errorMsg, onClose }: NoAccessProps) {
  const isAuthError = errorMsg?.toLowerCase().includes('auth') || errorMsg?.toLowerCase().includes('401') || errorMsg?.toLowerCase().includes('403');
  return (
    <div className="ghf-overlay">
      <div className="ghf-overlay-backdrop" onClick={onClose} />
      <div className="ghf-noaccess-panel">
        <div className="ghf-overlay-header">
          <h2 className="ghf-overlay-title">GitHubfluence — {isAuthError ? 'Auth Error' : 'Cannot Edit'}</h2>
          <div className="ghf-header-actions">
            <span className="ghf-repo-badge">{owner}/{repo}</span>
            <button className="ghf-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>
        <div className="ghf-noaccess-body">
          <p className="ghf-noaccess-icon">{isAuthError ? '⚠️' : '🔒'}</p>
          {errorMsg ? (
            <>
              <p className="ghf-noaccess-title">{errorMsg}</p>
              {isAuthError && (
                <p className="ghf-noaccess-desc">
                  Make sure you're logged in to GitHub in this browser, or set a GH_TOKEN environment variable.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="ghf-noaccess-title">You don't have write access to this repository.</p>
              <p className="ghf-noaccess-desc">
                To contribute, please fork the repository or request write permissions from the repository owner.
              </p>
            </>
          )}
        </div>
        <div className="ghf-overlay-footer ghf-noaccess-footer">
          <div />
          <button className="ghf-btn ghf-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
