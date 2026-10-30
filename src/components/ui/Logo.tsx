import Image from 'next/image';

interface Props {
  tone?: 'color' | 'white';
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

// Marque Faucon : la tête de faucon, identique au logo de l'application
// mobile. Version couleur sur les fonds clairs, version blanche sur les fonds
// bleu profond. Aucune aile dorée n'est utilisée dans l'interface web.
export default function Logo({
  tone = 'color',
  size = 28,
  showWordmark = true,
  className = '',
}: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={tone === 'white' ? '/falcon-mark-white.png' : '/falcon-mark-color.png'}
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
