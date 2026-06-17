import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { GitHubAlert } from './github-alert';
import { Toolbar } from './toolbar';

interface EditorProps {
  initialContent: string;
  onContentChange: (markdown: string) => void;
}

export function RichEditor({ initialContent, onContentChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        link: false,
      }),
      Markdown.configure({
        markedOptions: { gfm: true },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      ImageExtension,
      GitHubAlert,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const md = editor.getMarkdown();
      onContentChange(md);
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (!initialContent) return;
    editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

  return (
    <div className="ghf-editor-wrapper">
      <Toolbar editor={editor} />
      <div className="ghf-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
