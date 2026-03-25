import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.min.css";

interface Props {
  name: string;
  value?: string;
}

export default function RichTextEditor({ name, value = "" }: Props) {
  const editor = useRef(null);
  const hiddenRef = useRef<HTMLTextAreaElement>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarButtonSize: "middle" as const,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "|",
        "link", "image", "|",
        "align", "|",
        "undo", "redo", "|",
        "hr", "eraser", "copyformat", "|",
        "source",
      ],
      uploader: {
        url: "/api/admin/upload",
        format: "json",
        filesVariableName: (i: number) => `files[${i}]`,
        isSuccess: (resp: { success: boolean }) => resp.success,
        getMessage: (resp: { data?: { messages?: string[] } }) =>
          resp.data?.messages?.join("\n") ?? "",
        process: (resp: { data?: { files?: string[]; baseurl?: string } }) => ({
          files: resp.data?.files ?? [],
          baseurl: resp.data?.baseurl ?? "",
          isImages: (resp.data?.files ?? []).map(() => true),
        }),
      },
    }),
    []
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => {
          if (hiddenRef.current) hiddenRef.current.value = newContent;
        }}
      />
      <textarea ref={hiddenRef} name={name} defaultValue={value} style={{ display: "none" }} />
    </>
  );
}
