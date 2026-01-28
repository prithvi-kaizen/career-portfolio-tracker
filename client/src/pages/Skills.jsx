import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import PrimaryButton from '../components/PrimaryButton';
import ModalForm from '../components/ModalForm';
import api from '../utils/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 1,
    category: 'technical',
    status: 'learning'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/skills/${editingItem._id}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      
      fetchSkills();
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      proficiency: item.proficiency,
      category: item.category,
      status: item.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${item._id}`);
        fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      proficiency: 1,
      category: 'technical',
      status: 'learning'
    });
  };

  const columns = [
    { key: 'name', label: 'Skill Name' },
    { 
      key: 'proficiency', 
      label: 'Proficiency',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2.5 h-2.5 rounded-full ${
                  level <= value ? 'bg-primary-500' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">{value}/5</span>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => (
        <span className="badge badge-neutral capitalize">{value}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'expert' ? 'badge-success' : 
          value === 'proficient' ? 'badge-info' : 'badge-warning'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
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
        title="Skills"
        subtitle="Track your technical and soft skills proficiency."
      >
        <PrimaryButton icon={Plus} onClick={() => setModalOpen(true)}>
          Add Skill
        </PrimaryButton>
      </PageHeader>

      <DataTable
        columns={columns}
        data={skills}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No skills yet. Click 'Add Skill' to get started."
      />

      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Skill' : 'Add Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Skill Name</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. React, Python, Leadership"
              required
            />
          </div>

          <div>
            <label className="input-label">Proficiency Level (1-5)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= formData.proficiency ? 'bg-primary-500' : 'bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="input-label">Category</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft Skills</option>
              <option value="tools">Tools</option>
              <option value="languages">Languages</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="input-label">Status</label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="learning">Learning</option>
              <option value="proficient">Proficient</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <PrimaryButton variant="secondary" onClick={closeModal}>
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit">
              {editingItem ? 'Update' : 'Add'} Skill
            </PrimaryButton>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default Skills;
