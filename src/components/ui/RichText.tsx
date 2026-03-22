// Renders HTML content stored in the database (PageText, Long_Desc, etc.)
// No client:load needed — this renders on the server inside .astro pages.
// Content comes from our own DB so dangerouslySetInnerHTML is safe here.
interface Props {
  html: string;
  className?: string;
}

export default function RichText({ html, className = "" }: Props) {
  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
