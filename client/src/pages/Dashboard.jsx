import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Award, BookOpen, Plus, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    internships: 0,
    skills: 0,
    certifications: 0,
    learning: 0
  });
  const [recentItems, setRecentItems] = useState({
    internships: [],
    skills: [],
    certifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internshipsRes, skillsRes, certificationsRes] = await Promise.all([
          api.get('/internships'),
          api.get('/skills'),
          api.get('/certifications')
        ]);

        const internships = internshipsRes.data;
        const skills = skillsRes.data;
        const certifications = certificationsRes.data;

        setStats({
          internships: internships.filter(i => i.status === 'completed').length,
          skills: skills.filter(s => s.status === 'proficient' || s.status === 'expert').length,
          certifications: certifications.length,
          learning: skills.filter(s => s.status === 'learning').length
        });

        setRecentItems({
          internships: internships.slice(0, 3),
          skills: skills.slice(0, 5),
          certifications: certifications.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

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
        title="Your Career, Clearly Tracked"
        subtitle="Track your internships, skills, and certifications in one place."
      >
        <Link to="/internships">
          <PrimaryButton icon={Plus}>Add Internship</PrimaryButton>
        </Link>
        <Link to="/skills">
          <PrimaryButton variant="secondary">View Skills</PrimaryButton>
        </Link>
      </PageHeader>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} value={stats.internships} label="Internships Completed" />
        <StatCard icon={Sparkles} value={stats.skills} label="Active Skills" />
        <StatCard icon={Award} value={stats.certifications} label="Certifications Earned" />
        <StatCard icon={BookOpen} value={stats.learning} label="Currently Learning" />
      </div>

      {/* Recent Internships */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Internships</h2>
          <Link to="/internships" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentItems.internships.length === 0 ? (
          <div className="card">
            <p className="text-neutral-500 text-center py-4">No internships yet. Add your first one!</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.internships.map((internship) => (
                  <tr key={internship._id} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {internship.company}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{internship.role}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(internship.startDate)} - {internship.endDate ? formatDate(internship.endDate) : 'Present'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${internship.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                        {internship.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Skills & Certifications Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Top Skills</h2>
            <Link to="/skills" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentItems.skills.length === 0 ? (
            <div className="card">
              <p className="text-neutral-500 text-center py-4">No skills added yet.</p>
            </div>
          ) : (
            <div className="card space-y-3">
              {recentItems.skills.map((skill) => (
                <div key={skill._id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= skill.proficiency ? 'bg-primary-500' : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`badge ${
                      skill.status === 'expert' ? 'badge-success' : 
                      skill.status === 'proficient' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {skill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Certifications</h2>
            <Link to="/certifications" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentItems.certifications.length === 0 ? (
            <div className="card">
              <p className="text-neutral-500 text-center py-4">No certifications yet.</p>
            </div>
          ) : (
            <div className="card space-y-4">
              {recentItems.certifications.map((cert) => (
                <div key={cert._id} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{cert.name}</p>
                    <p className="text-xs text-neutral-500">{cert.platform} • {formatDate(cert.completionDate)}</p>
                  </div>
                  {cert.certificateLink && (
                    <a
                      href={cert.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
