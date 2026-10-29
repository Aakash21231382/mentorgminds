import React, { useState, useEffect } from 'react';
import '../../assets/css/ManageStudyAbroadLeads.css';
import { getStudyAbroadLeads, updateLeadStatus, deleteStudyAbroadLead } from '../../api/adminApi';
import PageLoader from '../../components/PageLoader';

const ManageStudyAbroadLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getStudyAbroadLeads();
      console.log('API Response:', response); // Debug log
      setLeads(response.leads || response || []);
    } catch (error) {
      console.error('Error fetching study abroad leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead => 
        lead.Id === leadId ? { ...lead, Status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    }
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    
    try {
      await deleteStudyAbroadLead(leadToDelete.Id);
      setLeads(leads.filter(lead => lead.Id !== leadToDelete.Id));
      setShowDeleteModal(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Pending': 'status-pending',
      'Contacted': 'status-contacted',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || lead.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: leads.length,
    Pending: leads.filter(l => l.Status === 'Pending').length,
    Contacted: leads.filter(l => l.Status === 'Contacted').length,
    'In Progress': leads.filter(l => l.Status === 'In Progress').length,
    Completed: leads.filter(l => l.Status === 'Completed').length,
    Cancelled: leads.filter(l => l.Status === 'Cancelled').length
  };

  if (loading) {
    return (
      <div className="study-abroad-leads-container">
        {/* <div className="loading-spinner">Loading...</div> */}
        <PageLoader message="Loading Advisor Leads" />
      </div>
    );
  }

  return (
    <div className="study-abroad-leads-container">
      <div className="study-abroad-leads-header">
        <div>
          <h1>Study Abroad Advisor Leads</h1>
          <p>Manage and track study abroad counseling requests</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{leads.length}</span>
            <span className="stat-label">Total Leads</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{statusCounts.Pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{statusCounts.Completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="study-abroad-leads-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filters">
          {Object.keys(statusCounts).map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="study-abroad-leads-table-wrapper">
        <div className="study-abroad-leads-table">
          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="#F5F5F5"/>
                <path d="M35 45C35 42.2386 37.2386 40 40 40C42.7614 40 45 42.2386 45 45M55 45C55 42.2386 57.2386 40 60 40C62.7614 40 65 42.2386 65 45M35 65C35 65 40 60 50 60C60 60 65 65 65 65" stroke="#999" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <h3>No leads found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Countries</th>
                  <th>Degree</th>
                  <th>Stream</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.Id}>
                  <td>{lead.Id}</td>
                  <td className="name-cell">
                    <div className="user-avatar">
                      {lead.FullName?.charAt(0).toUpperCase()}
                    </div>
                    {lead.FullName}
                  </td>
                  <td>{lead.Email}</td>
                  <td>{lead.Phone}</td>
                  <td>{lead.StudyCountries || 'N/A'}</td>
                  <td>{lead.Degree || 'N/A'}</td>
                  <td>{lead.PreferredStream || 'N/A'}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusClass(lead.Status)}`}
                      value={lead.Status}
                      onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="date-cell">{formatDate(lead.CreatedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(lead)}
                        title="Delete Lead"
                      > 
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 5H15M7 8V13M11 8V13M4 5L5 15C5 15.5304 5.21071 16.0391 5.58579 16.4142C5.96086 16.7893 6.46957 17 7 17H11C11.5304 17 12.0391 16.7893 12.4142 16.4142C12.7893 16.0391 13 15.5304 13 15L14 5M6 5V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2H11C11.2652 2 11.5196 2.10536 11.7071 2.29289C11.8946 2.48043 12 2.73478 12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Lead</h2>
            <p>Are you sure you want to delete the lead for <strong>{leadToDelete?.FullName}</strong>?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudyAbroadLeads;
