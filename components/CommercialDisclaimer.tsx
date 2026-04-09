import { Info } from 'lucide-react';

/**
 * Commercial disclaimer shown on posts that mention products/services.
 * Signals to AdSense that this is editorial content, not a sales page.
 */
export default function CommercialDisclaimer() {
  return (
    <div className="my-6 p-4 bg-fc-cyan/5 border border-fc-cyan/20 rounded-xl flex items-start gap-3">
      <Info className="w-5 h-5 text-fc-blue shrink-0 mt-0.5" />
      <div className="text-sm text-surface-600 leading-relaxed">
        <strong className="text-surface-800">Nota editorial:</strong> Este artículo es un recurso educativo gratuito. 
        Si mencionamos herramientas o productos, es porque los hemos usado y nos han funcionado en proyectos reales. 
        No tenemos obligación de compra ni exclusividad con ningún proveedor mencionado.
      </div>
    </div>
  );
}
