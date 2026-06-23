import { AlertTriangle, Info, HelpCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen, title = 'Konfirmasi', message, onConfirm, onCancel,
  confirmText = 'Ya, Hapus', cancelText = 'Batal', type = 'danger'
}) {
  if (!isOpen) return null;

  const icons = {
    danger: <AlertTriangle className="text-red-500" size={24} />,
    warning: <HelpCircle className="text-yellow-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            {icons[type] || icons.danger}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg transition text-sm font-medium ${buttonColors[type] || buttonColors.danger}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}