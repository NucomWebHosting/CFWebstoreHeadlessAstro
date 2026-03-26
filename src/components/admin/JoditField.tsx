import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface Props {
  name: string;
  value?: string;
  height?: number;
  minimal?: boolean;
}

export default function JoditField({
  name,
  value: initialValue = "",
  height = 300,
  minimal = false,
}: Props) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height,
      toolbarButtonSize: "small" as const,
      buttons: minimal
        ? [
            "bold", "italic", "underline", "|",
            "ul", "ol", "|",
            "link", "|", "source",
          ]
        : [
            "bold", "italic", "underline", "strikethrough", "|",
            "ul", "ol", "|",
            "outdent", "indent", "|",
            "font", "fontsize", "brush", "|",
            "table", "link", "image", "|",
            "align", "|",
            "undo", "redo", "|",
            "hr", "eraser", "|",
            "source",
          ],
      askBeforePasteHTML: false,
      defaultActionOnPaste: "insert_clear_html" as const,
      removeButtons: ["about", "fullsize"],
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [height, minimal]
  );

  return (
    <>
      <JoditEditor
        value={initialValue}
        config={config}
        onChange={(newContent: string) => {
          if (hiddenRef.current) hiddenRef.current.value = newContent;
        }}
      />
      <input
        type="hidden"
        ref={hiddenRef}
        name={name}
        defaultValue={initialValue}
      />
    </>
  );
}
