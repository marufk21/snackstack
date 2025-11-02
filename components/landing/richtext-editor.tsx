"use client";

// Import CKEditor license configuration first
import "@/lib/ckeditor/config";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  initialContent = "",
  onChange,
}: RichTextEditorProps) {
  const [editorData, setEditorData] = useState(initialContent);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && initialContent !== editorData) {
      editorRef.current.setData(initialContent);
      setEditorData(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  const handleChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data);
  };

  return (
    <div className="rich-text-editor [&_.ck-editor__editable]:min-h-[300px] [&_.ck-content]:min-h-[300px]">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleChange}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}
