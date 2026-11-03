import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Cpu, Plus, Trash2, Edit2, Check } from 'lucide-react';

export const SkillsTab: React.FC = () => {
  const { skills, saveSkills, isSaving } = usePortfolio();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    name: '',
    level: 85,
    category: 'Programming Languages',
    icon: 'Code',
  });

  const handleEdit = (item: any, index: number) => {
    setEditingIndex(index);
    setForm(item);
  };

  const handleDelete = async (index: number) => {
    if (confirm('Hapus keahlian ini?')) {
      const updated = skills.filter((_, i) => i !== index);
      await saveSkills(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingIndex !== null) {
      updated = skills.map((s, idx) => (idx === editingIndex ? form : s));
    } else {
      updated = [...skills, form];
    }
    await saveSkills(updated);
    setEditingIndex(null);
    setForm({ name: '', level: 85, category: 'Programming Languages', icon: 'Code' });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-[#1E2328] border border-[#3B3F46] rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold font-sora text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#F5B301]" />
            {editingIndex !== null ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
          </span>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setForm({ name: '', level: 85, category: 'Programming Languages', icon: 'Code' });
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Batal
            </button>
          )}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Nama Keahlian / Tool</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Contoh: Laravel, React, ESP32"
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Kategori Skill</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Contoh: Framework / Backend"
              className="w-full px-3.5 py-2 bg-[#2A2E34] border border-[#3B3F46] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Tingkat Penguasaan ({form.level}%)</label>
            <input
              type="range"
              min="20"
              max="100"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="w-full accent-[#F5B301] mt-2"
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
            <span>{editingIndex !== null ? 'Simpan Keahlian' : 'Tambah Keahlian'}</span>
          </button>
        </div>
      </form>

      {/* List Keahlian */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {skills.map((item, idx) => (
          <div key={idx} className="bg-[#1E2328] border border-[#3B3F46] rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">{item.name}</div>
              <div className="text-[10px] text-gray-400">{item.category} • {item.level}%</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(item, idx)} className="p-1 text-gray-400 hover:text-white">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(idx)} className="p-1 text-red-400 hover:text-red-300">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};