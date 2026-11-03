import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  ImagePlus,
  Upload,
  FolderKanban,
  ExternalLink,
  Github,
} from 'lucide-react';
import { usePortfolio } from '../../../context/PortfolioContext';

type Category = 'Web' | 'IoT';

type Project = {
  id: string;
  title: string;
  category: Category;
  subtitle: string;
  description: string;
  technologies: string[];
  year: string;
  status: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
};

const inputStyle =
  'mt-1.5 w-full rounded-lg border border-[#363C45] bg-[#171A1D] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#F5B301] focus:ring-1 focus:ring-[#F5B301]';

const labelStyle = 'block text-xs font-medium text-gray-300';

const buttonStyle =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301]';

const EMPTY_PROJECT: Project = {
  id: '',
  title: '',
  category: 'Web',
  subtitle: '',
  description: '',
  technologies: [],
  year: String(new Date().getFullYear()),
  status: 'In Progress',
  image: '',
  liveUrl: '',
  githubUrl: '',
};

function createId() {
  return `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function SelectworkTab() {
  const { selectwork, saveSelectwork } = usePortfolio();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | Category>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Project>(EMPTY_PROJECT);

  const [technologyInput, setTechnologyInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (selectwork) {
      setProjects(selectwork);
    }
  }, [selectwork]);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeModal();
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [modalOpen]);

  async function persist(next: Project[]): Promise<boolean> {
    try {
      await saveSelectwork(next);
      setProjects(next);
      setNotice('Data Selected Works berhasil disimpan ke MongoDB!');
      setError('');
      return true;
    } catch (err) {
      console.error('Gagal menyimpan proyek:', err);
      setError('Gagal menyimpan ke database.');
      return false;
    }
  }

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_PROJECT, id: createId() });
    setImagePreview('');
    setTechnologyInput('');
    setError('');
    setNotice('');
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      ...project,
      technologies: [...project.technologies],
    });
    setImagePreview(project.image);
    setTechnologyInput('');
    setError('');
    setNotice('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setError('');
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2 MB.');
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Gambar tidak dapat dibaca.'));
          }
        };
        reader.onerror = () => reject(new Error('Gagal membaca gambar.'));
        reader.readAsDataURL(file);
      });

      setField('image', dataUrl);
      setImagePreview(dataUrl);
      setError('');
    } catch {
      setError('Gagal membaca gambar. Silakan coba kembali.');
    }
  }

  function addTechnology() {
    const value = technologyInput.trim();
    if (!value) return;

    const exists = form.technologies.some((item) => item.toLowerCase() === value.toLowerCase());
    if (!exists) {
      setField('technologies', [...form.technologies, value]);
    }
    setTechnologyInput('');
  }

  function removeTechnology(value: string) {
    setField('technologies', form.technologies.filter((item) => item !== value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Judul proyek wajib diisi.');
      return;
    }

    if (!form.description.trim()) {
      setError('Deskripsi proyek wajib diisi.');
      return;
    }

    const nextProject: Project = {
      ...form,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      technologies: form.technologies,
      year: form.year.trim(),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
    };

    const next = editingId
      ? projects.map((project) => (project.id === editingId ? nextProject : project))
      : [...projects, nextProject];

    const saved = await persist(next);
    if (saved) {
      closeModal();
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Hapus proyek "${project.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    const next = projects.filter((item) => item.id !== project.id);
    const saved = await persist(next);
    if (saved) {
      setNotice(`Proyek "${project.title}" berhasil dihapus.`);
    }
  }

  const visibleProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    const categoryMatch = filter === 'All' || project.category === filter;
    const searchMatch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((item) => item.toLowerCase().includes(query));

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-w-0 space-y-5 text-white">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5B301]/10 text-[#F5B301]">
            <FolderKanban size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Selected Works</h2>
            <p className="mt-1 text-xs text-gray-400">
              Kelola proyek dan gambar portofolio (Tersimpan ke MongoDB).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className={`${buttonStyle} bg-[#F5B301] text-[#171A1D] hover:bg-[#FCD053]`}
        >
          <Plus size={16} />
          Tambah Proyek
        </button>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: projects.length },
          { label: 'Web', value: projects.filter((p) => p.category === 'Web').length },
          { label: 'IoT', value: projects.filter((p) => p.category === 'IoT').length },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-[#353B43] bg-[#20252B] p-3">
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="mt-1 text-xl font-bold text-[#F5B301]">{item.value}</p>
          </div>
        ))}
      </div>

      {notice && (
        <p role="status" className="rounded-lg border border-[#353B43] bg-[#20252B] p-3 text-xs text-green-400">
          {notice}
        </p>
      )}

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari proyek atau teknologi..."
            aria-label="Cari proyek"
            className={`${inputStyle} mt-0 pl-9`}
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as 'All' | Category)}
          aria-label="Filter kategori"
          className={`${inputStyle} mt-0 sm:w-40`}
        >
          <option value="All">Semua Kategori</option>
          <option value="Web">Web</option>
          <option value="IoT">IoT</option>
        </select>
      </div>

      {/* Project cards */}
      {visibleProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#414750] p-8 text-center text-sm text-gray-400">
          Tidak ada proyek ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#353B43] bg-[#20252B]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#171A1D]">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
                    <ImagePlus size={28} />
                    <span className="text-xs">Belum ada gambar</span>
                  </div>
                )}

                <span className="absolute left-3 top-3 rounded-full bg-[#171A1D]/90 px-3 py-1 text-[10px] font-semibold text-[#F5B301]">
                  {project.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-widest text-[#F5B301]">
                      {project.subtitle || project.category}
                    </p>
                    <h3 className="text-sm font-bold">{project.title}</h3>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">{project.year}</span>
                </div>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-400">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <span key={technology} className="rounded-md border border-[#414750] px-2 py-1 text-[10px] text-gray-300">
                      {technology}
                    </span>
                  ))}
                </div>

                {(project.liveUrl || project.githubUrl) && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#F5B301]"
                      >
                        <Github size={13} />
                        GitHub
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#F5B301]"
                      >
                        Demo
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-auto flex gap-2 border-t border-[#353B43] pt-3 mt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    className={`${buttonStyle} flex-1 border border-[#414750] text-gray-200 hover:border-[#F5B301] hover:text-[#F5B301]`}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProject(project)}
                    aria-label={`Hapus ${project.title}`}
                    className={`${buttonStyle} border border-red-500/30 text-red-400 hover:bg-red-500/10`}
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sw-modal-title"
            className="my-auto flex max-h-[88dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-xl border border-[#353B43] bg-[#20252B] shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#353B43] px-4 py-3 sm:px-5">
              <div>
                <h3 id="sw-modal-title" className="text-base font-bold">
                  {editingId ? 'Edit Proyek' : 'Tambah Proyek'}
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">Isi informasi proyek dan gambar thumbnail.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Tutup formulir"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-col overflow-hidden">
              <div className="grid min-h-0 grid-cols-1 gap-3 overflow-y-auto overscroll-contain p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
                {/* Image */}
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Gambar Proyek</label>
                  <div className="mt-2 grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
                    <div className="aspect-[16/7] w-full max-w-sm overflow-hidden rounded-lg border border-[#414750] bg-[#171A1D]">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview gambar proyek" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
                          <ImagePlus size={25} />
                          <span className="text-[10px]">Preview gambar</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        id="sw-image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />

                      <label
                        htmlFor="sw-image-upload"
                        className={`${buttonStyle} cursor-pointer bg-[#F5B301] text-[#171A1D] hover:bg-[#FCD053]`}
                      >
                        <Upload size={14} />
                        Pilih Gambar
                      </label>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setField('image', '');
                          }}
                          className={`${buttonStyle} border border-[#414750] text-gray-300 hover:text-red-400`}
                        >
                          <Trash2 size={13} />
                          Hapus Gambar
                        </button>
                      )}

                      <p className="text-[10px] leading-4 text-gray-500">JPG, PNG, WebP. Maks 2 MB.</p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label htmlFor="sw-title" className={labelStyle}>Judul Proyek *</label>
                  <input
                    id="sw-title"
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    maxLength={100}
                    required
                    placeholder="Contoh: Smart Fire Detection"
                    className={inputStyle}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="sw-category" className={labelStyle}>Kategori</label>
                  <select
                    id="sw-category"
                    value={form.category}
                    onChange={(event) => setField('category', event.target.value as Category)}
                    className={inputStyle}
                  >
                    <option value="Web">Web</option>
                    <option value="IoT">IoT</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="sw-year" className={labelStyle}>Tahun</label>
                  <input
                    id="sw-year"
                    value={form.year}
                    onChange={(event) => setField('year', event.target.value)}
                    maxLength={4}
                    className={inputStyle}
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label htmlFor="sw-subtitle" className={labelStyle}>Label / Subtitle</label>
                  <input
                    id="sw-subtitle"
                    value={form.subtitle}
                    onChange={(event) => setField('subtitle', event.target.value)}
                    maxLength={80}
                    placeholder="Backend Development"
                    className={inputStyle}
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="sw-status" className={labelStyle}>Status</label>
                  <select
                    id="sw-status"
                    value={form.status}
                    onChange={(event) => setField('status', event.target.value)}
                    className={inputStyle}
                  >
                    <option value="Concept">Concept</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Project">Project</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="sw-description" className={labelStyle}>Deskripsi Singkat *</label>
                  <textarea
                    id="sw-description"
                    value={form.description}
                    onChange={(event) => setField('description', event.target.value)}
                    required
                    maxLength={350}
                    rows={2}
                    placeholder="Jelaskan proyek secara singkat."
                    className={inputStyle}
                  />
                </div>

                {/* Technologies */}
                <div className="sm:col-span-2">
                  <label htmlFor="sw-technology" className={labelStyle}>Teknologi</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="sw-technology"
                      value={technologyInput}
                      onChange={(event) => setTechnologyInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addTechnology();
                        }
                      }}
                      placeholder="Contoh: Laravel"
                      className={`${inputStyle} mt-0`}
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className={`${buttonStyle} border border-[#414750] text-[#F5B301] hover:border-[#F5B301]`}
                    >
                      <Plus size={14} />
                      Tambah
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#414750] bg-[#171A1D] px-2 py-1.5 text-[10px] text-gray-200"
                      >
                        {technology}
                        <button
                          type="button"
                          onClick={() => removeTechnology(technology)}
                          aria-label={`Hapus ${technology}`}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* URLs */}
                <div>
                  <label htmlFor="sw-live" className={labelStyle}>URL Demo</label>
                  <input
                    id="sw-live"
                    type="url"
                    value={form.liveUrl}
                    onChange={(event) => setField('liveUrl', event.target.value)}
                    placeholder="https://..."
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="sw-github" className={labelStyle}>URL GitHub</label>
                  <input
                    id="sw-github"
                    type="url"
                    value={form.githubUrl}
                    onChange={(event) => setField('githubUrl', event.target.value)}
                    placeholder="https://github.com/..."
                    className={inputStyle}
                  />
                </div>

                {error && (
                  <p role="alert" className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/5 p-2.5 text-xs text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#353B43] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`${buttonStyle} border border-[#414750] text-gray-300 hover:text-white`}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className={`${buttonStyle} bg-[#F5B301] text-[#171A1D] hover:bg-[#FCD053]`}
                >
                  <Save size={14} />
                  {editingId ? 'Simpan Perubahan' : 'Simpan Proyek'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}