import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import PrimaryButton from '../components/PrimaryButton';
import ModalForm from '../components/ModalForm';
import api from '../utils/api';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    status: 'ongoing',
    skills: '',
    notes: ''
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await api.get('/internships');
      setInternships(response.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingItem) {
        await api.put(`/internships/${editingItem._id}`, data);
      } else {
        await api.post('/internships', data);
      }
      
      fetchInternships();
      closeModal();
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      company: item.company,
      role: item.role,
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      status: item.status,
      skills: item.skills.join(', '),
      notes: item.notes || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await api.delete(`/internships/${item._id}`);
        fetchInternships();
      } catch (error) {
        console.error('Error deleting internship:', error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      status: 'ongoing',
      skills: '',
      notes: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = [
    { key: 'company', label: 'Company' },
    { key: 'role', label: 'Role' },
    { 
      key: 'startDate', 
      label: 'Duration',
      render: (_, row) => `${formatDate(row.startDate)} - ${row.endDate ? formatDate(row.endDate) : 'Present'}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`badge ${value === 'completed' ? 'badge-success' : 'badge-info'}`}>
          {value === 'completed' ? 'Completed' : 'Ongoing'}
        </span>
      )
    },
    {
      key: 'skills',
      label: 'Skills',
      sortable: false,
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((skill, i) => (
            <span key={i} className="badge badge-neutral">{skill}</span>
          ))}
          {value.length > 3 && (
            <span className="badge badge-neutral">+{value.length - 3}</span>
          )}
        </div>
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
        title="Internships"
        subtitle="Track all your internship experiences in one place."
      >
        <PrimaryButton icon={Plus} onClick={() => setModalOpen(true)}>
          Add Internship
        </PrimaryButton>
      </PageHeader>

      <DataTable
        columns={columns}
        data={internships}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No internships yet. Click 'Add Internship' to get started."
      />

      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Internship' : 'Add Internship'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Company</label>
              <input
                type="text"
                className="input"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div>
              <label className="input-label">Role</label>
              <input
                type="text"
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Software Engineer Intern"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Start Date</label>
              <input
                type="date"
                className="input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">End Date (optional)</label>
              <input
                type="date"
                className="input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Status</label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="input-label">Skills Used (comma-separated)</label>
            <input
              type="text"
              className="input"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="input-label">Notes (optional)</label>
            <textarea
              className="input min-h-[80px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this internship..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <PrimaryButton variant="secondary" onClick={closeModal}>
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit">
              {editingItem ? 'Update' : 'Add'} Internship
            </PrimaryButton>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default Internships;
