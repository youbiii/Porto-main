import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Database, RefreshCw, UploadCloud, CheckCircle2 } from 'lucide-react';

export const DatabaseTab: React.FC = () => {
  const { dbStatus, refreshData, syncToMongo } = usePortfolio();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    const success = await syncToMongo();
    setIsSyncing(false);
    if (success) {
      setSyncMsg('Data fallback berhasil didorong ke MongoDB!');
      setTimeout(() => setSyncMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Box */}
      <div className="p-4 rounded-xl bg-[#2A2E34] border border-[#3B3F46] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${dbStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Status Basis Data: {dbStatus.connected ? 'MongoDB Online' : 'Fallback Mode (Local)'}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {dbStatus.connected
                ? `Terhubung ke mongodb://127.0.0.1:27017/portfolio (${dbStatus.latency ?? 0} ms)`
                : 'MongoDB belum terhubung. Perubahan tersimpan aman di LocalStorage browser.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => refreshData()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B3F46] hover:bg-[#484E57] text-xs font-semibold text-white transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Periksa Ulang
        </button>
      </div>

      {/* Sync Action */}
      <div className="p-4 rounded-xl bg-[#2A2E34] border border-[#3B3F46] space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F5B301]">
          <Database className="w-4 h-4" /> Sinkronisasi ke MongoDB
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Jika Anda sebelumnya mengedit konten saat mode cloud/offline, tekan tombol di bawah ini saat menjalankan aplikasi di laptop untuk menyimpan semua perubahan ke database MongoDB lokal.
        </p>

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={handleSync}
            disabled={!dbStatus.connected || isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F5B301] hover:bg-[#FCD053] disabled:opacity-50 disabled:cursor-not-allowed text-[#1E2328] font-bold text-xs transition"
          >
            <UploadCloud className="w-4 h-4" />
            {isSyncing ? 'Menyinkronkan...' : 'Dorong Data ke MongoDB'}
          </button>

          {syncMsg && (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {syncMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};