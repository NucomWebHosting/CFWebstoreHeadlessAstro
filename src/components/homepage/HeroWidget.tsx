import type { HomepageRow } from "../../lib/types";

interface Props {
  hp: HomepageRow;
  imageBaseUrl?: string;
}

function resolveImage(filename: string | null | undefined, baseUrl: string): string | null {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}

export default function HeroWidget({ hp, imageBaseUrl = "" }: Props) {
  const image = resolveImage(hp.Hero_image, imageBaseUrl);
  const height = hp.Hero_height && hp.Hero_height > 0 ? `${hp.Hero_height}px` : "80vh";

  const textAlignClass =
    hp.Hero_text_position === 1 ? "text-center" :
    hp.Hero_text_position === 2 ? "text-right" :
    "text-left";

  const hasOverlay = hp.Hero_text || hp.Hero_text1 || hp.Hero_button;

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: image ? `url(${image})` : undefined, minHeight: height }}
    >
      {/* Linked hero with no text */}
      {!hasOverlay && hp.Hero_link && (
        <a href={hp.Hero_link} className="absolute inset-0" aria-label="View more" />
      )}

      {/* Text / button overlay */}
      {hasOverlay && (
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className={`max-w-2xl ${textAlignClass}`}>
            {hp.Hero_text ? (
              <div dangerouslySetInnerHTML={{ __html: hp.Hero_text }} />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {hp.Hero_text1 && <span className="block">{hp.Hero_text1}</span>}
                {hp.Hero_text2 && <span className="block">{hp.Hero_text2}</span>}
                {hp.Hero_text3 && <span className="block">{hp.Hero_text3}</span>}
                {hp.Hero_text4 && <span className="block">{hp.Hero_text4}</span>}
              </h1>
            )}

            {hp.Hero_button && hp.Hero_link && (
              <a
                href={hp.Hero_link}
                className="inline-block mt-6 px-8 py-3 bg-black/60 hover:bg-black/80 text-white rounded-full font-semibold text-lg transition-colors"
              >
                {hp.Hero_button} →
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
