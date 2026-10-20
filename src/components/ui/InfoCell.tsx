// Cellule d'information : un libellé en capitals au-dessus d'une valeur.
// Utilisée pour les fiches de traçeur (état du traceur, configuration) —
// le même rendu partout, plutôt qu'une classe inline à chaque fois.
export default function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </div>
      <div className={`text-sm font-semibold text-neutral-900 ${mono ? 'tabular-nums' : ''}`}>
        {value}
      </div>
    </div>
  );
}
