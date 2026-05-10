import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo?: string) => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  requireMotivo?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  variant = 'danger',
  requireMotivo = false,
  loading = false,
}: ConfirmDialogProps) {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = async () => {
    await onConfirm(requireMotivo ? motivo : undefined);
    setMotivo('');
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      {requireMotivo && (
        <textarea
          className="w-full rounded border border-zinc-200 px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atrato-600 mb-4"
          rows={3}
          placeholder="Escribe el motivo (requerido)..."
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          maxLength={500}
        />
      )}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant={variant}
          size="sm"
          loading={loading}
          disabled={requireMotivo && !motivo.trim()}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
