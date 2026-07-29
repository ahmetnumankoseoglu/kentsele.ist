"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function Btn({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-bold transition ${
        active
          ? "bg-[#eaf8ee] text-[#168f43]"
          : "bg-white text-[#374151] hover:bg-[#f3f4f6]"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-[#168f43] underline font-semibold",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Haberi buraya yaz… WordPress gibi biçimlendir.",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[220px] max-w-none px-3 py-3 text-sm leading-relaxed text-[#111321] focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  // External value sync (edit load)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[260px] rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-3 text-sm text-[#6b7280]">
        Editör yükleniyor…
      </div>
    );
  }

  function setLink() {
    const prev = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  return (
    <div className="overflow-hidden rounded-[3px] border border-[#e3e4e6] bg-white">
      <div className="flex flex-wrap gap-1 border-b border-[#e3e4e6] bg-[#f8f8f8] p-1.5">
        <Btn
          title="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Btn>
        <Btn
          title="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Btn>
        <Btn
          title="Altı çizili"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </Btn>
        <Btn
          title="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Btn>
        <Btn
          title="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Btn>
        <Btn
          title="Madde listesi"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Liste
        </Btn>
        <Btn
          title="Numaralı liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Liste
        </Btn>
        <Btn
          title="Alıntı"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “
        </Btn>
        <Btn title="Bağlantı" active={editor.isActive("link")} onClick={setLink}>
          Link
        </Btn>
        <Btn
          title="Geri al"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↩
        </Btn>
        <Btn
          title="İleri al"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↪
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
