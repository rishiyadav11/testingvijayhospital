'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import { useState, useCallback, useRef } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Trash2, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function BlogEditor({ value, onChange, placeholder = 'Start writing your blog...', disabled = false }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-slate-900 text-white p-4 rounded font-mono text-sm',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editable: !disabled,
  });

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor]);

  const handleAddLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const charCount = editor?.storage.characterCount.characters() || 0;

  if (!editor) {
    return <div className="p-4 bg-slate-50 rounded border border-slate-200">Loading editor...</div>;
  }

  return (
    <div className={cn('relative border border-slate-300 rounded-lg overflow-hidden', isFullscreen && 'fixed inset-0 z-50 border-0 rounded-0')}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 bg-slate-100 border-b border-slate-200 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('bold') && 'bg-slate-300')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('italic') && 'bg-slate-300')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>

        <div className="w-px bg-slate-300" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('heading', { level: 2 }) && 'bg-slate-300')}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('heading', { level: 3 }) && 'bg-slate-300')}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px bg-slate-300" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('bulletList') && 'bg-slate-300')}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('orderedList') && 'bg-slate-300')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('blockquote') && 'bg-slate-300')}
          title="Quote"
        >
          <Quote size={18} />
        </button>

        <div className="w-px bg-slate-300" />

        <button
          onClick={handleAddLink}
          className={cn('p-2 rounded hover:bg-slate-200 transition-colors', editor.isActive('link') && 'bg-slate-300')}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-slate-200 transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload image"
        />

        <div className="w-px bg-slate-300" />

        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-600"
          title="Clear Formatting"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded hover:bg-slate-200 transition-colors ml-auto"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Editor Content */}
      <div className={cn('bg-white prose prose-sm max-w-none focus-within:outline-none', isFullscreen && 'h-[calc(100vh-140px)] overflow-auto')}>
        <EditorContent
          editor={editor}
          className="px-4 py-3 min-h-[300px] focus:outline-none"
          style={{ minHeight: isFullscreen ? 'calc(100vh - 180px)' : undefined }}
        />
      </div>

      {/* Character Count Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-sm text-slate-600 flex justify-between">
        <span>{charCount.toLocaleString()} / 50,000 characters</span>
        <span className={cn(charCount > 45000 && 'text-orange-600', charCount > 49000 && 'text-red-600')}>
          {Math.round((charCount / 50000) * 100)}% used
        </span>
      </div>
    </div>
  );
}
