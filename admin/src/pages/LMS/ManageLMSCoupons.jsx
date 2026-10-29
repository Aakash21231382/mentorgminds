import React, { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaTag, 
  FaPercentage, 
  FaRupeeSign, 
  FaCheckCircle, 
  FaTimes,
  FaSearch,
  FaGift
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import "../../assets/css/lms-admin.css";

const ManageLMSCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    code: "",
    discountPercent: 20,
    maxDiscount: 2000,
    minCartAmount: 0,
    usageLimit: 500
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await lmsAdminApi.getAllCoupons();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    try {
      const res = await lmsAdminApi.createCoupon(form);
      if (res.success) {
        setShowModal(false);
        setForm({
          code: "",
          discountPercent: 20,
          maxDiscount: 2000,
          minCartAmount: 0,
          usageLimit: 500
        });
        fetchCoupons();
      }
    } catch (e) {
      alert("Failed to create coupon.");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await lmsAdminApi.deleteCoupon(couponId);
      fetchCoupons();
    } catch (e) {
      alert("Could not delete coupon.");
    }
  };

  // Metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.IsActive).length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + (c.UsedCount || 0), 0);
  const avgDiscount = totalCoupons > 0
    ? Math.round(coupons.reduce((acc, c) => acc + (c.DiscountPercent || 0), 0) / totalCoupons)
    : 20;

  const filteredCoupons = coupons.filter(c => 
    (c.Code || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lms-admin-container">
      
      {/* Header */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <FaTag className="text-warning" /> Discount Coupons & Promo Codes
          </h1>
          <p>Create and manage discount codes for course checkouts and seasonal promotional campaigns.</p>
        </div>

        <button className="btn-lms-action" onClick={() => setShowModal(true)}>
          <FaPlus /> Create New Coupon
        </button>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaTag />
          </div>
          <div className="lms-stat-info">
            <h3>{totalCoupons}</h3>
            <span>Total Coupons</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{activeCoupons}</h3>
            <span>Active Promo Codes</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaPercentage />
          </div>
          <div className="lms-stat-info">
            <h3>{avgDiscount}%</h3>
            <span>Average Discount</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaGift />
          </div>
          <div className="lms-stat-info">
            <h3>{totalRedemptions}</h3>
            <span>Total Redeemed</span>
          </div>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="lms-toolbar">
        <div className="lms-search-box">
          <FaSearch className="text-muted" />
          <input 
            type="text"
            placeholder="Search by coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <span className="text-muted small fw-semibold">
          Showing {filteredCoupons.length} Active Codes
        </span>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="lms-empty-state">
          <div className="lms-empty-icon">
            <FaTag />
          </div>
          <h3>No Coupons Created Yet</h3>
          <p>Create your first discount coupon like WELCOME50 or DIWALI2026 to boost course sales.</p>
          <button className="btn-lms-action" onClick={() => setShowModal(true)}>
            <FaPlus /> Create First Coupon
          </button>
        </div>
      ) : (
        <div className="lms-module-card">
          <div className="lms-table-responsive">
            <table className="lms-modern-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount Off</th>
                  <th>Max Cap (₹)</th>
                  <th style={{ width: 220 }}>Usage (Used / Limit)</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center", width: 80 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c) => (
                  <tr key={c.CouponID}>
                    <td>
                      <span 
                        style={{ 
                          background: "var(--lms-primary-light)", 
                          color: "var(--lms-primary)", 
                          border: "1.5px dashed var(--lms-primary)", 
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: 13,
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          letterSpacing: 0.5
                        }}
                      >
                        <FaTag size={12} /> {c.Code}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: "#10B981", fontSize: 15 }}>{c.DiscountPercent}% OFF</strong>
                    </td>

                    <td>
                      <span className="lms-table-title">₹{c.MaxDiscount || 'No Limit'}</span>
                    </td>

                    <td>
                      <div className="lms-progress-wrap">
                        <div className="lms-progress-track">
                          <div 
                            className="lms-progress-fill"
                            style={{ width: `${Math.min(100, ((c.UsedCount || 0) / (c.UsageLimit || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="lms-progress-text">{c.UsedCount || 0} / {c.UsageLimit}</span>
                      </div>
                    </td>

                    <td>
                      {c.IsActive ? (
                        <span className="badge-status active">
                          <FaCheckCircle size={10} /> Active
                        </span>
                      ) : (
                        <span className="badge-status inactive">Expired</span>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button 
                        className="action-icon-btn danger"
                        onClick={() => handleDeleteCoupon(c.CouponID)}
                        title="Delete Coupon"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showModal && (
        <div className="lms-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lms-modal-header">
              <h3>Create New Discount Coupon</h3>
              <button className="action-icon-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon}>
              <div className="lms-modal-body">
                <div className="lms-form-group">
                  <label>Coupon Code *</label>
                  <input 
                    type="text" 
                    className="lms-form-control"
                    style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}
                    placeholder="e.g. FLAT30, SPECIAL50, MASTERCLASS"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required 
                  />
                </div>

                <div className="lms-form-row">
                  <div className="lms-form-group">
                    <label>Discount Percentage (%) *</label>
                    <input 
                      type="number"
                      className="lms-form-control"
                      value={form.discountPercent}
                      onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                      required 
                    />
                  </div>
                  <div className="lms-form-group">
                    <label>Max Cap Amount (₹)</label>
                    <input 
                      type="number"
                      className="lms-form-control"
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="lms-form-group">
                  <label>Max Redemption Limit (Total Students)</label>
                  <input 
                    type="number"
                    className="lms-form-control"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="lms-modal-footer">
                <button type="button" className="btn-lms-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lms-action">
                  Save & Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSCoupons;
