import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#1E2328] border border-[#3B3F46] p-6 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-sora">Admin Access</h3>
            <p className="text-xs text-gray-400 mt-1">Masukkan 4-digit PIN keamanan portofolio</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-[0.5em] py-2.5 rounded-xl bg-[#2A2E34] border border-[#3B3F46] focus:border-[#F5B301] focus:outline-none text-white font-mono"
              autoFocus
            />

            {error && (
              <p className="text-xs text-red-400 font-medium">PIN salah, silakan coba lagi.</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-bold text-sm transition"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};