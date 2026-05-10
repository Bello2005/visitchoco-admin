interface DiffViewerProps {
  antes: Record<string, unknown>;
  despues: Record<string, unknown>;
}

const FIELD_LABELS: Record<string, string> = {
  nombre: 'Nombre', descripcion: 'Descripción', telefono: 'Teléfono',
  email: 'Email', whatsapp: 'WhatsApp', sitio_web: 'Sitio web',
  direccion: 'Dirección', rango_precio: 'Precio', categoria: 'Categoría',
  subcategoria: 'Subcategoría', horario: 'Horario', especialidades: 'Especialidades',
};

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export function DiffViewer({ antes, despues }: DiffViewerProps) {
  const keys = Object.keys(despues);

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-zinc-100">
          <th className="text-left py-2 pr-4 text-zinc-500 font-medium w-1/4">Campo</th>
          <th className="text-left py-2 pr-4 text-zinc-400 font-medium w-3/8">Antes</th>
          <th className="text-left py-2 text-zinc-800 font-medium w-3/8">Después</th>
        </tr>
      </thead>
      <tbody>
        {keys.map(key => (
          <tr key={key} className="border-b border-zinc-50">
            <td className="py-2 pr-4 text-zinc-500 font-medium">
              {FIELD_LABELS[key] ?? key}
            </td>
            <td className="py-2 pr-4 text-zinc-400 line-through">
              {formatVal(antes[key])}
            </td>
            <td className="py-2 text-zinc-800 font-medium">
              {formatVal(despues[key])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
