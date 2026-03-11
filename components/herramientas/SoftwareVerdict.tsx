import { Software, SoftwareReview } from '@/types/supabase';

interface SoftwareVerdictProps {
  a: Software;
  b: Software;
  reviewA?: SoftwareReview;
  reviewB?: SoftwareReview;
}

export function SoftwareVerdict({ a, b, reviewA, reviewB }: SoftwareVerdictProps) {
  if (!reviewA && !reviewB) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 my-16">
      <div className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg">
        {reviewA?.verdict && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              El veredicto para {a.name}
            </h3>
            <p className="leading-relaxed text-foreground/90">{reviewA.verdict}</p>
          </div>
        )}

        {reviewB?.verdict && (
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              El veredicto para {b.name}
            </h3>
            <p className="leading-relaxed text-foreground/90">{reviewB.verdict}</p>
          </div>
        )}
      </div>
    </section>
  );
}
