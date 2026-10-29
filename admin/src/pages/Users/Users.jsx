import React, { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle,
  FaUserShield, FaCalendar, FaUsers, FaExclamationTriangle,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminAuthApi } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/User.css';

const Users = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all'); // all | verified | unverified

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAuthApi.getUsers();
      if (data.success) setUsers(data.users || []);
      else setError(data.message || 'Failed to load users');
    } catch {
      setError('Server error — make sure the backend is running.');
      toast.error('Server error — make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users
    .filter(u => {
      if (filter === 'verified')   return  u.is_verified;
      if (filter === 'unverified') return !u.is_verified;
      return true;
    })
    .filter(u => {
      const q = search.toLowerCase();
      return (
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    });

  if (loading) return <PageLoader message="Loading users..." />;
  if (error) return (
    <div className="users-page">
      <div className="users-card users-message-container users-error-container">
        <FaExclamationTriangle className="users-error-icon" /> {error}
      </div>
    </div>
  );

  return (
    <div className="users-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="users-card">
        <h2 className="users-header-title">
          <FaUsers style={{ color: '#F6881F' }} /> Registered Users
        </h2>
        <p className="users-header-subtitle">
          Total: {users.length} &nbsp;|&nbsp; Verified: {users.filter(u => u.is_verified).length}
        </p>

        <div className="users-toolbar">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="users-search-input"
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="users-filter-select">
            <option value="all">All Users</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="users-message-container">No users found.</div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th><FaUser /> Name</th>
                  <th><FaEnvelope /> Email</th>
                  <th><FaPhone /> Phone</th>
                  <th>Status</th>
                  <th><FaUserShield /> Role</th>
                  <th><FaCalendar /> Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span className={`users-badge ${user.is_verified ? 'badge-verified' : 'badge-unverified'}`}>
                        {user.is_verified
                          ? <><FaCheckCircle /> Verified</>
                          : <><FaTimesCircle /> Unverified</>}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-role ${user.role?.toLowerCase() === 'admin' ? 'admin' : ''}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
