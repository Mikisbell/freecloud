import { Software, SoftwareReview } from '@/types/supabase';

interface SoftwareCompareScoresProps {
  a: Software;
  b: Software;
  reviewA?: SoftwareReview;
  reviewB?: SoftwareReview;
}

export function SoftwareCompareScores({ a, b, reviewA, reviewB }: SoftwareCompareScoresProps) {
  // Graceful fallback si no existen reviews = no renderizamos esta sección para no romper el flujo
  if (!reviewA && !reviewB) return null;

  const renderScore = (score?: number) => {
    if (score === undefined || score === null) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground text-sm">Evaluación pendiente</p>
        </div>
      );
    }

    // Lógica visual del color
    let colorClass = 'text-green-500';
    if (score < 7) colorClass = 'text-yellow-500';
    if (score < 5) colorClass = 'text-red-500';

    return (
      <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Puntuación Global
        </div>
        <div className={`text-6xl sm:text-7xl font-black tabular-nums tracking-tighter ${colorClass}`}>
          {score.toFixed(1)}
        </div>
        <div className="text-sm text-muted-foreground mt-2 font-medium">Sobre 10</div>
      </div>
    );
  };

  return (
    <section className="w-full mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Veredicto y Puntuación Analítica
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Basado en nuestras pruebas técnicas, curva de adopción y feedback del mercado AEC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-center">{a.name}</h3>
          {renderScore(reviewA?.overall_score)}
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-center">{b.name}</h3>
          {renderScore(reviewB?.overall_score)}
        </div>
      </div>
    </section>
  );
}
