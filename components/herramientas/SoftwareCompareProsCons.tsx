import { Software, SoftwareReview } from '@/types/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SoftwareCompareProsConsProps {
  a: Software;
  b: Software;
  reviewA?: SoftwareReview;
  reviewB?: SoftwareReview;
}

export function SoftwareCompareProsCons({ a, b, reviewA, reviewB }: SoftwareCompareProsConsProps) {
  if (!reviewA && !reviewB) return null;

  const renderList = (title: string, items: string[], isPro: boolean) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <h4 className={`text-lg font-bold ${isPro ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
          {title}
        </h4>
        <ul className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start text-sm sm:text-base">
              <span className="shrink-0 mt-0.5">
                {isPro ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </span>
              <span className="text-foreground leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCard = (softwareName: string, review?: SoftwareReview) => {
    if (!review) {
      return (
        <div className="flex-1 bg-muted/30 border rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground italic text-center text-sm">
            Nuestros analistas externos aún están compilando los datos para {softwareName}.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-black mb-6 border-b pb-4">
          Lo mejor y peor de {softwareName}
        </h3>
        
        <div className="flex flex-col gap-8">
          {renderList('👍 Principales Ventajas', review.pros, true)}
          {renderList('👎 A tener en cuenta', review.cons, false)}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-0 mb-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center w-full">
        {renderCard(a.name, reviewA)}
        {renderCard(b.name, reviewB)}
      </div>
    </section>
  );
}
