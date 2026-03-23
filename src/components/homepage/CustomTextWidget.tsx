interface Props {
  html: string;
  fullWidth?: boolean;
}

export default function CustomTextWidget({ html, fullWidth = false }: Props) {
  if (fullWidth) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
