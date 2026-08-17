import Image from 'next/image';

interface Props {
  tone?: 'color' | 'white';
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

// Même mark que l'app mobile (mobile/assets/logo/falcon-mark-*.png) : un
// faucon en piqué, ailes en flèche, dessiné pour ce projet. Deux
// déclinaisons comme côté mobile — dégradé marine→bleu→cyan pour les fonds
// clairs (tone="color"), blanc uni pour les fonds sombres/dégradés
// (tone="white"), où le dégradé se fondrait sinon dans l'arrière-plan.
export default function Logo({ tone = 'color', size = 28, showWordmark = true, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={tone === 'white' ? '/mark-white.png' : '/mark.png'}
        alt="Faucon"
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
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
