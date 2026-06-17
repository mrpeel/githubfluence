import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { Node } from 'prosemirror-model';

export type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const ALERT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i;

function detectAlert(node: Node): AlertType | null {
  const first = node.firstChild;
  if (!first) return null;
  const text = first.textContent || first.firstChild?.textContent || '';
  const m = text.match(ALERT_RE);
  return m ? (m[1].toLowerCase() as AlertType) : null;
}

const ALERT_MARKERS: Record<AlertType, string> = {
  note: '[!NOTE]',
  tip: '[!TIP]',
  important: '[!IMPORTANT]',
  warning: '[!WARNING]',
  caution: '[!CAUTION]',
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gitHubAlert: {
      setGitHubAlert: (type: AlertType) => ReturnType;
      unsetGitHubAlert: () => ReturnType;
      toggleGitHubAlert: (type: AlertType) => ReturnType;
    };
  }
}

export const GitHubAlert = Extension.create({
  name: 'gitHubAlert',

  addCommands() {
    return {
      setGitHubAlert:
        (type: AlertType) =>
        ({ editor }) => {
          const { state } = editor;
          const { from } = state.selection;
          const $pos = state.doc.resolve(from);
          let inBlockquote = false;
          for (let d = $pos.depth; d > 0; d--) {
            if ($pos.node(d).type.name === 'blockquote') {
              inBlockquote = true;
              break;
            }
          }
          if (!inBlockquote) {
            editor.chain().focus().setBlockquote().run();
          }
          const pos = editor.state.selection.$from;
          const start = pos.start();
          const marker = ALERT_MARKERS[type];
          editor
            .chain()
            .focus()
            .insertContentAt(start, `${marker}\n`)
            .run();
          return true;
        },

      unsetGitHubAlert:
        () =>
        ({ editor }) => {
          const { state } = editor;
          const { from } = state.selection;
          const $pos = state.doc.resolve(from);
          for (let d = $pos.depth; d > 0; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'blockquote') {
              const alertType = detectAlert(node);
              if (alertType) {
                const start = $pos.start(d);
                const firstPara = node.firstChild;
                if (firstPara) {
                  const end = start + firstPara.nodeSize;
                  editor.chain().focus().deleteRange({ from: start, to: end }).run();
                }
              }
              return true;
            }
          }
          return false;
        },

      toggleGitHubAlert:
        (type: AlertType) =>
        ({ editor }) => {
          const { state } = editor;
          const { from } = state.selection;
          const $pos = state.doc.resolve(from);
          for (let d = $pos.depth; d > 0; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'blockquote') {
              const current = detectAlert(node);
              if (current === type) {
                return editor.chain().focus().unsetGitHubAlert().run();
              }
              if (current) {
                const pos = $pos.start(d);
                const marker = ALERT_MARKERS[type];
                editor.chain().focus().insertContentAt(pos, `${marker}\n`).run();
                return true;
              }
            }
          }
          return editor.chain().focus().setGitHubAlert(type).run();
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('githubAlert'),
        props: {
          decorations(state) {
            const decos: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name === 'blockquote') {
                const alertType = detectAlert(node);
                if (alertType) {
                  decos.push(
                    Decoration.node(pos, pos + node.nodeSize, {
                      'data-alert-type': alertType,
                    }),
                  );
                }
              }
            });
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

export { detectAlert, ALERT_MARKERS };
