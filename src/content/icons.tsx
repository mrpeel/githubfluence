import React from 'react';

type IconProps = { className?: string };

const s: React.CSSProperties = { width: 20, height: 20, display: 'block' };

export function BoldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M8 6h4.832C13.908 6 16 6.5 16 9q0 2-1 2.5 2 .5 2 3c0 .5 0 3.5-4 3.5H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1m1 10h3.5c1 0 2-.25 2-1.5s-1.104-1.5-2-1.5H9zm0-4.975h3c.504 0 2 0 2-1.525S12 8 12 8H9z" />
    </svg>
  );
}

export function ItalicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M10 6h6a1 1 0 0 1 0 2h-6a1 1 0 1 1 0-2M8 16h6a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2m4-8h2l-2 8h-2z" />
    </svg>
  );
}

export function StrikeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M8.58 11H6a1 1 0 0 0 0 2h6.327c1.295.34 1.847.822 1.847 1.642 0 .958-.872 1.648-2.075 1.648-1.008 0-1.779-.398-2.127-1.056-.19-.361-.522-.624-.93-.624h-.16c-.484 0-.868.46-.731.925C8.602 17.068 10.013 18 11.986 18 14.464 18 16 16.614 16 14.388c0-.532-.081-.991-.253-1.388H18a1 1 0 0 0 0-2h-5.556l-.564-.145c-1.268-.324-1.784-.775-1.784-1.544 0-.975.778-1.608 1.953-1.608.871 0 1.544.383 1.86 1.027.174.356.499.612.894.612h.145c.486 0 .875-.463.729-.927C15.221 6.958 13.846 6 12.057 6 9.77 6 8.255 7.378 8.255 9.453c0 .597.107 1.11.325 1.547" />
    </svg>
  );
}

export function CodeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M10.208 7.308a1.09 1.09 0 0 1 0 1.483l-3.515 3.71 3.515 3.708a1.09 1.09 0 0 1 0 1.483.957.957 0 0 1-1.405 0l-3.866-4.08a1.635 1.635 0 0 1 0-2.225l3.866-4.08a.957.957 0 0 1 1.405 0m3.584 0a.957.957 0 0 1 1.405 0l3.866 4.08c.583.614.583 1.61 0 2.225l-3.866 4.08a.957.957 0 0 1-1.405 0 1.09 1.09 0 0 1 0-1.484l3.515-3.708-3.515-3.71a1.09 1.09 0 0 1 0-1.483" />
    </svg>
  );
}

export function CodeBlockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M10.208 7.308a1.09 1.09 0 0 1 0 1.483l-3.515 3.71 3.515 3.708a1.09 1.09 0 0 1 0 1.483.957.957 0 0 1-1.405 0l-3.866-4.08a1.635 1.635 0 0 1 0-2.225l3.866-4.08a.957.957 0 0 1 1.405 0m3.584 0a.957.957 0 0 1 1.405 0l3.866 4.08c.583.614.583 1.61 0 2.225l-3.866 4.08a.957.957 0 0 1-1.405 0 1.09 1.09 0 0 1 0-1.484l3.515-3.708-3.515-3.71a1.09 1.09 0 0 1 0-1.483" />
    </svg>
  );
}

export function BulletListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M6 8c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-5 5c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-5 5c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2" />
    </svg>
  );
}

export function OrderedListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M11 7h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m0 4h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m0 4h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-5 0h3v1H6zm0 2h3v1H6zm1-9H6V7h2v3H7zm-1 3h3v1.333h-.6V13H7.2v-.667H6zm0 2h3v1H6zm2 3h2v1H8z" />
    </svg>
  );
}

export function TaskListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M7.5 6h9A1.5 1.5 0 0 1 18 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 16.5v-9A1.5 1.5 0 0 1 7.5 6m3.072 8.838.143.154a.5.5 0 0 0 .769-.042l.13-.175 3.733-5.045a.8.8 0 0 0-.11-1.064.665.665 0 0 0-.984.118l-3.243 4.387-1.315-1.422a.663.663 0 0 0-.99 0 .8.8 0 0 0 0 1.07z" />
    </svg>
  );
}

export function BlockquoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M15.698 17C16.97 17 18 15.982 18 14.727s-1.03-2.273-2.302-2.273c-2.301 0-.767-4.393 2.302-4.393V7c-5.478 0-7.624 10-2.302 10m-4.33-2.273c0-1.255-1.031-2.273-2.301-2.273-2.302 0-.768-4.393 2.301-4.393V7C5.891 7 3.744 17 9.067 17c1.27 0 2.301-1.018 2.301-2.273" />
    </svg>
  );
}

export function HorizontalRuleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <rect width="14" height="2" x="5" y="11" fillRule="evenodd" rx="1" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path d="M12.654 8.764a.858.858 0 0 1-1.213-1.213l1.214-1.214a3.717 3.717 0 0 1 5.257 0 3.714 3.714 0 0 1 .001 5.258l-1.214 1.214-.804.804a3.72 3.72 0 0 1-5.263.005.858.858 0 0 1 1.214-1.214c.781.782 2.05.78 2.836-.005l.804-.803 1.214-1.214a2 2 0 0 0-.001-2.831 2 2 0 0 0-2.83 0zm-.808 6.472a.858.858 0 0 1 1.213 1.213l-1.214 1.214a3.717 3.717 0 0 1-5.257 0 3.714 3.714 0 0 1-.001-5.258l1.214-1.214.804-.804a3.72 3.72 0 0 1 5.263-.005.858.858 0 0 1-1.214 1.214 2.005 2.005 0 0 0-2.836.005l-.804.803L7.8 13.618a2 2 0 0 0 .001 2.831 2 2 0 0 0 2.83 0z" />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="m11 15-1-1-2 2h8v-1.8L14 12zM6 6.5c0-.276.229-.5.5-.5h11c.276 0 .5.229.5.5v11c0 .276-.229.5-.5.5h-11a.504.504 0 0 1-.5-.5zM9.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
  );
}

export function TableIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2m0 2v3h3V8zm5 0v3h3V8zm-5 5v3h3v-3zm5 0v3h3v-3z" />
    </svg>
  );
}

export function UndoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path d="M8.931 11.658C9.92 10.055 11.596 9 13.5 9c3.038 0 5.492 2.686 5.5 6h-1.5c0-2.513-1.821-4.5-4-4.5-1.337 0-2.54.749-3.27 1.908l2.03 1.172c.24.139.22.325-.029.41l-2.73.93L9.5 15v-.08l-1.372.467a.422.422 0 0 1-.559-.323l-.84-4.251c-.053-.266.106-.365.34-.23z" />
    </svg>
  );
}

export function RedoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M6.72 15h1.5c0-2.513 1.821-4.5 4-4.5 1.338 0 2.54.75 3.27 1.908l-2.03 1.172c-.24.14-.219.325.029.41l2.73.93.001.08v-.08l1.372.467a.42.42 0 0 0 .559-.323l.841-4.25c.052-.267-.107-.366-.341-.23l-1.862 1.075C15.801 10.055 14.124 9 12.22 9c-3.037 0-5.492 2.687-5.5 6" />
    </svg>
  );
}

export function HeadingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M7 6a1 1 0 0 1 1 1v4h8V7a1 1 0 1 1 2 0v10a1 1 0 1 1-2 0v-4H8v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1" />
    </svg>
  );
}

export function EmojiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14m0 12.5c3.033 0 5.5-2.467 5.5-5.5S15.033 6.5 12 6.5A5.506 5.506 0 0 0 6.5 12c0 3.033 2.467 5.5 5.5 5.5m-1.5-6a1 1 0 1 1 0-2 1 1 0 0 1 0 2m3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m.27 1.583a.626.626 0 0 1 .932.834A3.63 3.63 0 0 1 12 15.125a3.63 3.63 0 0 1-2.698-1.204.625.625 0 0 1 .93-.835c.901 1.003 2.639 1.003 3.538-.003" />
    </svg>
  );
}

export function AlertNoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16m0-8.5a1 1 0 0 0-1 1V15a1 1 0 0 0 2 0v-2.5a1 1 0 0 0-1-1m0-1.125a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75" />
    </svg>
  );
}

export function AlertTipIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M14 16h-4s0-.5-1-2-2.5-3-2.5-5S7 4 12 4s5.5 3 5.5 5-1.5 3.5-2.5 5-1 2-1 2m-4 1h4v1l-1.5 2h-1L10 18z" />
    </svg>
  );
}

export function AlertImportantIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.574 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
  );
}

export function AlertWarningIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
  );
}

export function AlertCautionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={s} className={className}>
      <path fillRule="evenodd" d="M4.47.22A.749.749 0 0 1 5 0h6a.749.749 0 0 1 .53.22l4.25 4.25a.749.749 0 0 1 .22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25a.749.749 0 0 1-.53.22H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5a.749.749 0 0 1 .22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM5.75 5.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5Z" />
    </svg>
  );
}
