interface Props {
  html: string;
}

export default function AlertWidget({ html }: Props) {
  return (
    <div className="bg-amber-50 border-b border-amber-300">
      <div className="container mx-auto px-4 py-3 text-center text-sm text-amber-900">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
