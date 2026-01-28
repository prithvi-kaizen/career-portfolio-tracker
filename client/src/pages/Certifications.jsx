import { useState, useEffect } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import PrimaryButton from '../components/PrimaryButton';
import ModalForm from '../components/ModalForm';
import api from '../utils/api';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    completionDate: '',
    certificateLink: '',
    credentialId: ''
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/certifications');
      setCertifications(response.data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/certifications/${editingItem._id}`, formData);
      } else {
        await api.post('/certifications', formData);
      }
      
      fetchCertifications();
      closeModal();
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      platform: item.platform,
      completionDate: item.completionDate.split('T')[0],
      certificateLink: item.certificateLink || '',
      credentialId: item.credentialId || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.delete(`/certifications/${item._id}`);
        fetchCertifications();
      } catch (error) {
        console.error('Error deleting certification:', error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      platform: '',
      completionDate: '',
      certificateLink: '',
      credentialId: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const columns = [
    { key: 'name', label: 'Certification' },
    { 
      key: 'platform', 
      label: 'Platform',
      render: (value) => (
        <span className="badge badge-neutral">{value}</span>
      )
    },
    { 
      key: 'completionDate', 
      label: 'Completed',
      render: (value) => formatDate(value)
    },
    { 
      key: 'credentialId', 
      label: 'Credential ID',
      render: (value) => value || <span className="text-neutral-400">—</span>
    },
    { 
      key: 'certificateLink', 
      label: 'Link',
      sortable: false,
      render: (value) => value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View
        </a>
      ) : (
        <span className="text-neutral-400">—</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Certifications"
        subtitle="Keep track of all your professional certifications."
      >
        <PrimaryButton icon={Plus} onClick={() => setModalOpen(true)}>
          Add Certification
        </PrimaryButton>
      </PageHeader>

      <DataTable
        columns={columns}
        data={certifications}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No certifications yet. Click 'Add Certification' to get started."
      />

      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Certification' : 'Add Certification'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Certification Name</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AWS Solutions Architect"
              required
            />
          </div>

          <div>
            <label className="input-label">Platform</label>
            <input
              type="text"
              className="input"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g. Coursera, Udemy, AWS"
              required
            />
          </div>

          <div>
            <label className="input-label">Completion Date</label>
            <input
              type="date"
              className="input"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">Credential ID (optional)</label>
            <input
              type="text"
              className="input"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              placeholder="e.g. ABC123XYZ"
            />
          </div>

          <div>
            <label className="input-label">Certificate Link (optional)</label>
            <input
              type="url"
              className="input"
              value={formData.certificateLink}
              onChange={(e) => setFormData({ ...formData, certificateLink: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <PrimaryButton variant="secondary" onClick={closeModal}>
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit">
              {editingItem ? 'Update' : 'Add'} Certification
            </PrimaryButton>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default Certifications;
