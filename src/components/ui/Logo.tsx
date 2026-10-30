import Image from 'next/image';

interface Props {
  tone?: 'color' | 'white';
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

// Marque Faucon : l'aile dorée, identique au logo de l'application mobile.
// Sur fond sombre, le wordmark passe en blanc ; l'aile conserve son or de
// marque pour rester reconnaissable partout (web, mobile, favicon, stores).
export default function Logo({
  tone = 'color',
  size = 28,
  showWordmark = true,
  className = '',
}: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/faucon-wing-gold.png"
        alt="Faucon"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
        priority
      />
      {showWordmark && (
        <span
          className={`font-bold tracking-[0.08em] ${tone === 'white' ? 'text-white' : 'text-[#002D72]'}`}
          style={{ fontSize: size * 0.62 }}
        >
          FAUCON
        </span>
      )}
    </div>
  );
}
