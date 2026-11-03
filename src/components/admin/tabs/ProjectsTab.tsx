import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Edit3, Image, ExternalLink, Github, Save } from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const { projects, saveProjects, uploadImageFile, isSaving } = usePortfolio();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Web App',
    description: '',
    tags: '',
    image: '',
    demo: '',
    github: '',
  });

  const handleEdit = (index: number) => {
    const item = projects[index];
    setEditingIndex(index);
    setForm({
      title: item.title || item.name || '',
      category: item.category || 'Web App',
      description: item.description || '',
      tags: Array.isArray(item.tags)
        ? item.tags.join(', ')
        : Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : item.tags || '',
      image: item.image || item.imageUrl || '',
      demo: item.demo || item.liveUrl || item.link || '',
      github: item.github || item.githubUrl || '',
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({
      title: '',
      category: 'Web App',
      description: '',
      tags: '',
      image: '',
      demo: '',
      github: '',
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await uploadImageFile(file);
        setForm((prev) => ({ ...prev, image: base64 }));
      } catch (err) {
        alert('Gagal memuat naik gambar');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('Sila masukkan tajuk projek');
      return;
    }

    const tagsArray = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedItem = {
      id: editingIndex !== null ? projects[editingIndex]?.id || Date.now().toString() : Date.now().toString(),
      title: form.title,
      category: form.category,
      description: form.description,
      tags: tagsArray,
      technologies: tagsArray,
      image: form.image,
      demo: form.demo,
      liveUrl: form.demo,
      github: form.github,
      githubUrl: form.github,
    };

    let newProjects = [...projects];
    if (editingIndex !== null) {
      newProjects[editingIndex] = updatedItem;
    } else {
      newProjects.unshift(updatedItem);
    }

    await saveProjects(newProjects);
    handleCancel();
  };

  const handleDelete = async (index: number) => {
    if (confirm('Adakah anda pasti mahu memadamkan projek ini?')) {
      const newProjects = projects.filter((_, i) => i !== index);
      await saveProjects(newProjects);
      if (editingIndex === index) handleCancel();
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Borang Tambah / Sunting Projek */}
      <form onSubmit={handleSave} className="bg-[#1A1D21] border border-[#2B3038] rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2B3038]">
          <h3 className="text-sm font-bold font-sora flex items-center gap-2">
            <span>{editingIndex !== null ? '✏️ Sunting Projek' : '➕ Tambah Projek Baru'}</span>
          </h3>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-gray-400 hover:text-white"
            >
              Batal
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">TAJUK PROJEK</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
              placeholder="Cth: Smart Lab IoT System"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">KATEGORI</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
            >
              <option value="Web App">Web App</option>
              <option value="IoT & System">IoT & System</option>
              <option value="AI & System">AI & System</option>
              <option value="Design / UI">Design / UI</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">PENERANGAN PROJEK</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
            placeholder="Penerangan ringkas mengenai projek..."
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">TAG TEKNOLOGI (Asingkan dengan tanda koma)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
            placeholder="Cth: ESP32, React, Node.js, Tailwind"
          />
        </div>

        {/* Muat Naik Gambar */}
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">GAMBAR PROJEK</label>
          <div className="flex items-center gap-4">
            {form.image && (
              <img src={form.image} alt="Preview" className="w-16 h-12 rounded-lg object-cover border border-[#2B3038]" />
            )}
            <label className="cursor-pointer bg-[#20252B] hover:bg-[#2B3038] border border-[#2B3038] px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition">
              <Image className="w-4 h-4 text-[#F5B301]" />
              <span>Pilih Gambar dari Komputer</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="atau masukkan pautan URL gambar terus..."
              className="flex-1 bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">PAUTAN DEMO / LIVE</label>
            <input
              type="text"
              value={form.demo}
              onChange={(e) => setForm({ ...form, demo: e.target.value })}
              className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">PAUTAN GITHUB / REPO</label>
            <input
              type="text"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              className="w-full bg-[#121417] border border-[#2B3038] rounded-xl px-3.5 py-2 text-xs focus:border-[#F5B301] outline-none"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#F5B301] hover:bg-[#FCD053] text-[#171A1D] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : editingIndex !== null ? 'Kemas Kini Projek' : 'Simpan Projek'}</span>
          </button>
        </div>
      </form>

      {/* Senarai Projek Yang Didaftarkan */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
          Senarai Projek Aktif ({projects.length})
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {projects.map((proj: any, idx: number) => (
            <div
              key={proj.id || idx}
              className="bg-[#1A1D21] border border-[#2B3038] p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                {proj.image ? (
                  <img src={proj.image} alt={proj.title} className="w-14 h-10 object-cover rounded-lg border border-[#2B3038]" />
                ) : (
                  <div className="w-14 h-10 rounded-lg bg-[#121417] border border-[#2B3038] flex items-center justify-center text-xs font-mono text-gray-500">
                    N/A
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{proj.title || 'Untitled'}</h4>
                  <span className="text-[10px] text-[#F5B301] font-mono">{proj.category || 'Web App'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(idx)}
                  className="p-2 text-gray-400 hover:text-white bg-[#20252B] rounded-lg transition"
                  title="Sunting"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-2 text-red-400 hover:text-red-300 bg-[#20252B] rounded-lg transition"
                  title="Padam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};