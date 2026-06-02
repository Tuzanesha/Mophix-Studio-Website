import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleriesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AdminSidebar } from './AdminSidebar';
import toast from 'react-hot-toast';
import { getBackendAssetUrl } from '../../utils/apiUrl';



const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  const loadPhotos = async (galleryId) => {
    if (!galleryId) return;
    try {
      setPhotosLoading(true);
      const res = await galleriesService.getPhotos(galleryId, { page: 1, limit: 50 });
      const data = res.data?.data ?? res.data ?? res ?? [];
      setPhotos(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Failed to load photos');
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };


  const loadGalleries = async () => {

    try {
      setLoading(true);
      const response = await galleriesService.getAll({ limit: 50 });
      const data = response.data?.data ?? response.data ?? response ?? [];
      setGalleries(Array.isArray(data) ? data : []);
      // Auto-select the first gallery if none selected
      if (data.length > 0 && (!selectedGallery || selectedGallery === '')) {
        setSelectedGallery(data[0].id || data[0].gallery_id);
      }
    } catch (error) {
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  useEffect(() => {
    loadPhotos(selectedGallery);
  }, [selectedGallery]);


  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!galleryTitle) {
      toast.error('Please enter a gallery title.');
      return;
    }

    try {
      setUploading(true);
      const res = await galleriesService.create({
        title: galleryTitle,
        description: galleryDescription,
      });
      toast.success('Gallery created successfully.');
      setGalleryTitle('');
      setGalleryDescription('');
      loadGalleries();
      if (res.data?.data?.id || res.data?.data?.gallery_id) {
        setSelectedGallery(res.data.data.id || res.data.data.gallery_id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create gallery.');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedGallery) {
      toast.error('Select a gallery first.');
      return;
    }
    if (!photoFile) {
      toast.error('Choose a photo to upload.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', photoFile);
      const response = await galleriesService.uploadPhoto(selectedGallery, formData);
      toast.success(response.data?.message || 'Photo uploaded successfully! 📸');
      setPhotoFile(null);
      setPreview(null);
      loadGalleries();
    } catch (error) {
      console.error('Upload Error:', error);
      const message = error.response?.status === 413 ? "File too large (Max 10MB)" : (error.response?.data?.message || 'Upload failed');
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-4">Admin Gallery Tools</p>
              <h1 className="section-title">Gallery Upload & Management</h1>
              <p className="section-subtitle max-w-2xl">
                Create new portfolio collections, upload studio photos, and manage gallery content in one place.
              </p>
            </div>
            <div className="lg:text-right">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-200 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_0.8fr] mt-10">
        <div className="card p-8 space-y-8">

          <div>
            <h2 className="text-xl font-semibold mb-3">Create a New Gallery</h2>
            <form onSubmit={handleCreateGallery} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white">Gallery Title</label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  placeholder="E.g. Wedding Highlights"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Description</label>
                <textarea
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  rows={4}
                  placeholder="Short description for the gallery"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Creating...' : 'Create Gallery'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Upload Photo to Gallery</h2>
            <form onSubmit={handlePhotoUpload} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white">Select Gallery</label>
                <select
                  value={selectedGallery}
                  onChange={(e) => setSelectedGallery(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                >
                  <option value="">Choose gallery</option>
                  {galleries.map((gallery) => (
                    <option key={gallery.id || gallery.gallery_id} value={gallery.id || gallery.gallery_id}>
                      {gallery.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none file:bg-orange-500 file:text-black file:font-medium file:px-4 file:py-2 file:rounded-lg file:border-0 file:mr-4 file:cursor-pointer"
                />
              </div>
              {preview && (
                <div className="rounded-3xl overflow-hidden border border-white/10">
                  <img src={preview} alt="Preview" className="h-52 w-full object-cover" />
                </div>
              )}
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Current Galleries</h2>
              <p className="text-gray-500">Review available collections and pick one for uploads.</p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : galleries.length > 0 ? (
            <div className="space-y-4">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id || gallery.gallery_id}
                  className={`rounded-xl border p-4 transition-all ${
                    (selectedGallery === gallery.id || selectedGallery === gallery.gallery_id) 
                    ? 'border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10' 
                    : 'border-white/10 bg-white/5'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-1">{gallery.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{gallery.description || 'No description provided.'}</p>
                  <button
                    onClick={() => setSelectedGallery(gallery.id || gallery.gallery_id)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Select for upload
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No galleries available yet. Create one to start uploading photos.</p>
          )}
        </div>

        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Photos in Selected Gallery</h2>
              <p className="text-gray-500">Client can download images uploaded by admin.</p>
            </div>
          </div>

          {photosLoading ? (
            <LoadingSpinner />
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => {
                const thumbnailUrl = getBackendAssetUrl(photo.thumbnail_path);
                const downloadUrl = getBackendAssetUrl(
                  `/api/v1/galleries/photos/${photo.photo_id}/download`
                );

                return (
                  <div key={photo.photo_id} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                    <img
                      src={thumbnailUrl}
                      alt={photo.title || 'photo'}
                      className="h-28 w-full object-cover rounded-lg"
                    />
                    <div className="text-xs text-gray-400 truncate">{photo.title || ''}</div>
                    <a
                      href={downloadUrl}
                      className="inline-flex items-center justify-center w-full rounded-lg bg-green-500 hover:bg-green-600 text-black text-sm font-semibold py-2 transition"
                      download
                    >
                      Download
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No photos found for this gallery.</p>
          )}
        </div>

      </div>
    </section>
  </main>
</div>
  );
};

export default AdminGalleries;

