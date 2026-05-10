import { useRef, useState } from 'react';
import { Upload, Star, Trash2 } from 'lucide-react';
import { mediaApi } from '@/api/media';
import type { MediaAsset } from '@/api/establecimientos';
import { cn } from '@/lib/cn';

interface ImageUploaderProps {
  entidadTipo: string;
  entidadId: string;
  assets: MediaAsset[];
  onUpdate: () => void;
}

export function ImageUploader({ entidadTipo, entidadId, assets, onUpdate }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const uploadFile = async (file: File) => {
    setProgress(`Subiendo ${file.name}...`);

    const { upload_url, key, public_url } = await mediaApi.getUploadUrl({
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      mime_type: file.type,
      filename: file.name,
    });

    await fetch(upload_url, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    const { width, height } = await getImageDimensions(file);

    await mediaApi.confirm({
      r2_key: key,
      url_publica: public_url,
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      mime_type: file.type,
      size_bytes: file.size,
      width_px: width,
      height_px: height,
      es_principal: assets.length === 0,
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
      onUpdate();
    } catch (err) {
      console.error('[ImageUploader]', err);
    } finally {
      setUploading(false);
      setProgress('');
    }
  };

  const handleDelete = async (id: string) => {
    await mediaApi.delete(id);
    onUpdate();
  };

  const handlePrincipal = async (id: string) => {
    await mediaApi.setPrincipal(id);
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 py-8 px-4 text-center cursor-pointer transition-colors',
          'hover:border-atrato-400 hover:bg-atrato-50'
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="h-6 w-6 text-zinc-400" />
        <p className="text-sm text-zinc-500">
          {uploading ? progress : 'Arrastra imágenes o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-zinc-400">JPG, PNG, WebP — máx. 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Galería */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {assets.map(asset => (
            <div key={asset.id} className="relative group rounded overflow-hidden border border-zinc-200">
              <img
                src={asset.url_publica}
                alt={asset.alt_text ?? ''}
                className="w-full h-28 object-cover"
              />
              {asset.es_principal && (
                <span className="absolute top-1 left-1 bg-chirimia-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!asset.es_principal && (
                  <button
                    onClick={() => handlePrincipal(asset.id)}
                    className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40"
                    title="Hacer principal"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1.5 rounded bg-white/20 text-white hover:bg-red-500/80"
                  title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}
