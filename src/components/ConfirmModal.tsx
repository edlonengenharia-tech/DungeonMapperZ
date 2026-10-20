interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-sm w-full mx-4 border border-[#2a2a4a] shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-[#2a2a4a] text-gray-300 rounded-lg hover:bg-[#3a3a5a] transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-all font-medium ${
              danger
                ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
