import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Briefcase, Plus, Trash2, Edit2, Check } from 'lucide-react';

export const TimelineTab: React.FC = () => {
  const { timeline, saveTimeline, isSaving } = usePortfolio();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    title: '',
    organization: '',
    period: '',
    description: '',
    type: 'experience', // 'experience' | 'education'
  });

  const handleEdit = (item: any, index: number) => {
    setEditingIndex(index);
    setForm(item);
  };

  const handleDelete = async (index: number) => {
    if (confirm('Hapus riwayat ini?')) {
      const updated = timeline.filter((_, i) => i !== index);
      await saveTimeline(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingIndex !== null) {
      updated = timeline.map((t, idx) => (idx === editingIndex ? form : t));
    } else {
      updated = [...timeline, form];
    }
    await saveTimeline(updated);
    setEditingIndex(null);
    setForm({ title: '', organization: '', period: '', description: '', type: 'experience' });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-[#1E2328] border border-[#3B3F46] rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold font-sora text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#F5B301]" />
            {editingIndex !== null ? 'Edit Riwayat' : 'Tambah Riwayat Pengalaman / Edukasi'}
          </span>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setForm({ title: '', organization: '', period: '', description: '', type: 'experience' });
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Batal
            </button>
          )}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Posisi / Gelar</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Contoh: IoT Hardware Engineer / S1 Teknik Informatika"
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Institusi / Perusahaan</label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              required
              placeholder="Contoh: PT NexaLink Tech Solution"
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Periode Waktu</label>
            <input
              type="text"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="Contoh: 2022 - Sekarang / Jan 2024 - Jun 2024"
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Tipe</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            >
              <option value="experience">Pengalaman Kerja / Proyek</option>
              <option value="education">Pendidikan Formal</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Keterangan / Aktivitas</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan peran, tanggung jawab, atau pencapaian..."
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            {editingIndex !== null ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editingIndex !== null ? 'Simpan Riwayat' : 'Tambah Riwayat'}</span>
          </button>
        </div>
      </form>

      {/* List Timeline */}
      <div className="space-y-3">
        {timeline.map((item, idx) => (
          <div key={idx} className="bg-[#1E2328] border border-[#3B3F46] rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-white">{item.title}</h5>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2E34] text-gray-300">
                  {item.period}
                </span>
              </div>
              <p className="text-xs text-[#F5B301] font-medium mt-0.5">{item.organization}</p>
              {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(item, idx)} className="p-1.5 text-gray-400 hover:text-white">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(idx)} className="p-1.5 text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};