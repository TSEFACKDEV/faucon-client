import Image from 'next/image';

interface Props {
  tone?: 'color' | 'white';
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

// Marque tête de faucon : blanche pour les fonds sombres, bleu/or pour les
// fonds clairs — mêmes fichiers source que l'app mobile (assets/logo), pour
// une identité visuelle cohérente entre le dashboard web et l'app installée.
export default function Logo({ tone = 'color', size = 28, showWordmark = true, className = '' }: Props) {
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
