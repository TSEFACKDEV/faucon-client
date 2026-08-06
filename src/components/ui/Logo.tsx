import Image from 'next/image';

interface Props {
  tone?: 'color' | 'white';
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

// Même mark que l'app mobile (mobile/assets/mark.png) — pas le logo vert/
// ambre historique (retiré de public/) qui appartenait à une identité
// visuelle abandonnée.
export default function Logo({ tone = 'color', size = 28, showWordmark = true, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {tone === 'white' ? (
        <div
          className="flex items-center justify-center rounded-full bg-white"
          style={{ width: size * 1.35, height: size * 1.35 }}
        >
          <Image src="/mark.png" alt="Faucon" width={size} height={size} style={{ width: size, height: size }} />
        </div>
      ) : (
        <Image src="/mark.png" alt="Faucon" width={size} height={size} style={{ width: size, height: size }} />
      )}
      {showWordmark && (
        <span
          className={`font-bold tracking-[0.05em] ${tone === 'white' ? 'text-white' : 'text-primary-600'}`}
          style={{ fontSize: size * 0.62 }}
        >
          FAUCON
        </span>
      )}
    </div>
  );
}
