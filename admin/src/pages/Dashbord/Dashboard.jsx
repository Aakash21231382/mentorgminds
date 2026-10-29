import React, { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaBars,
  FaBook,
  FaUserCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaChartArea,
  FaChartPie,
  FaLink,
  FaClipboardList,
  FaBolt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { adminDashboardApi, adminLeadsApi } from "../../api/adminApi";
import PageLoader from "../../components/PageLoader";
import "../../assets/css/Dashbord.css";

/* ── Brand colors ────────────────────────────────────────── */
const COLORS = [
  "#3182ce",
  "#48bb78",
  "#F6881F",
  "#9f7aea",
  "#f6ad55",
  "#fc8181",
];

/* ── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div
      className="stat-icon-wrapper"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <Icon />
    </div>
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

/* ── Chart Title with icon ───────────────────────────────── */
const ChartTitle = ({ icon: Icon, color, children }) => (
  <h3 className="chart-title">
    <span
      className="chart-title-icon"
      style={{ background: `${color}22`, color }}
    >
      <Icon />
    </span>
    {children}
  </h3>
);

/* ── Custom Tooltip ──────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="tooltip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Dashboard ───────────────────────────────────────────── */
const Dashboard = () => {
  const { adminUser } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [navLinks, setNavLinks] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminDashboardApi.getUsers(),
      adminDashboardApi.getNavbarLinks(),
      adminLeadsApi.getAdmissions().catch(() => ({ success: false })),
      adminLeadsApi.getCallbacks().catch(() => ({ success: false })),
    ])
      .then(([usersRes, navRes, admRes, cbRes]) => {
        if (usersRes.success) {
          const users = usersRes.users || [];
          setRecentUsers(users.slice(0, 5));
          setStats({
            totalUsers: users.length,
            verifiedUsers: users.filter((u) => u.is_verified).length,
          });
        }
        if (navRes.success) setNavLinks(navRes.flatLinks || []);
        if (admRes.success)
          setAdmissions(admRes.admissions || admRes.data || []);
        if (cbRes.success) setCallbacks(cbRes.callbacks || cbRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived numbers ── */
  const navbarCount = navLinks.filter((l) => !l.ParentId).length;
  const dropdownCount = navLinks.filter((l) => !!l.ParentId).length;
  const activeNavCount = navLinks.filter((l) => l.IsActive).length;
  const totalAdmissions = admissions.length;
  const totalCallbacks = callbacks.length;
  const unreadCB = callbacks.filter((c) => !c.is_read).length;
  const pendingAdm = admissions.filter((a) => a.status === "pending").length;

  /* ── Theme-aware chart styles ── */
  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "#2e3347" : "#f0f4f8";
  const legendColor = isDark ? "#94a3b8" : "#4a5568";

  /* ── Chart data ── */
  const usersPieData = [
    { name: "Verified", value: stats?.verifiedUsers ?? 0 },
    {
      name: "Unverified",
      value: (stats?.totalUsers ?? 0) - (stats?.verifiedUsers ?? 0),
    },
  ];

  const navBarData = [
    { name: "Main", count: navbarCount },
    { name: "Dropdown", count: dropdownCount },
    { name: "Active", count: activeNavCount },
    { name: "Hidden", count: navLinks.length - activeNavCount },
  ];

  const leadsBarData = [
    { name: "Admissions", total: totalAdmissions, pending: pendingAdm },
    { name: "Callbacks", total: totalCallbacks, pending: unreadCB },
  ];

  const radialData = [
    {
      name: "Users",
      value: Math.min((stats?.totalUsers ?? 0) * 2, 100),
      fill: "#3182ce",
    },
    {
      name: "Nav Links",
      value: Math.min(navLinks.length * 5, 100),
      fill: "#F6881F",
    },
    {
      name: "Admissions",
      value: Math.min(totalAdmissions * 3, 100),
      fill: "#48bb78",
    },
    {
      name: "Callbacks",
      value: Math.min(totalCallbacks * 3, 100),
      fill: "#9f7aea",
    },
  ];

  const base = stats?.totalUsers ?? 0;
  const areaData = [
    { month: "Mar", users: Math.max(0, base - 5) },
    { month: "Apr", users: Math.max(0, base - 4) },
    { month: "May", users: Math.max(0, base - 3) },
    { month: "Jun", users: Math.max(0, base - 2) },
    { month: "Jul", users: Math.max(0, base - 1) },
    { month: "Aug", users: base },
  ];

  if (loading) return <PageLoader message="Loading dashboard..." />;

  return (
    <div className="dashboard-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Welcome ── */}
      <div className="dashboard-welcome">
        <h1 className="welcome-title">
          Welcome back, {adminUser?.full_name || "Admin"} 👋
        </h1>
        <p className="welcome-subtitle">
          Here's what's happening on your platform today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={FaUsers}
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          color="#667eea"
        />
        <StatCard
          icon={FaUserCheck}
          label="Verified Users"
          value={stats?.verifiedUsers ?? 0}
          color="#10b981"
        />
        <StatCard
          icon={FaEnvelope}
          label="Admissions"
          value={totalAdmissions}
          color="#06b6d4"
          sub={`${pendingAdm} pending`}
        />
        <StatCard
          icon={FaPhoneAlt}
          label="Callbacks"
          value={totalCallbacks}
          color="#8b5cf6"
          sub={`${unreadCB} unread`}
        />
        <StatCard
          icon={FaBars}
          label="Navbar Items"
          value={navLinks.length}
          color="#f59e0b"
        />
        <StatCard
          icon={FaBook}
          label="Active Links"
          value={activeNavCount}
          color="#ec4899"
        />
      </div>

      {/* ── Row 1: Area + Pie ── */}
      <div className="dashboard-charts-row">
        {/* Area – User Growth */}
        <div className="dashboard-chart-card">
          <ChartTitle icon={FaChartArea} color="#3182ce">
            User Growth (Last 6 Months)
          </ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={areaData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#3182ce"
                    stopOpacity={isDark ? 0.4 : 0.3}
                  />
                  <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#3182ce"
                strokeWidth={2.5}
                fill="url(#colorUsers)"
                dot={{ r: 4, fill: "#3182ce", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie – Users Verification */}
        <div className="dashboard-chart-card">
          <ChartTitle icon={FaChartPie} color="#48bb78">
            Users Verification Status
          </ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={usersPieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {usersPieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(val) => (
                  <span style={{ color: legendColor, fontSize: 12 }}>
                    {val}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 2: Bar Navbar + Bar Leads ── */}
      <div className="dashboard-charts-row">
        {/* Bar – Navbar Breakdown */}
        <div className="dashboard-chart-card">
          <ChartTitle icon={FaLink} color="#F6881F">
            Navbar Breakdown
          </ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={navBarData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              barSize={36}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                {navBarData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar – Leads Overview */}
        <div className="dashboard-chart-card">
          <ChartTitle icon={FaClipboardList} color="#9f7aea">
            Leads Overview
          </ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={leadsBarData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              barSize={28}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(val) => (
                  <span style={{ color: legendColor, fontSize: 12 }}>
                    {val}
                  </span>
                )}
              />
              <Bar
                dataKey="total"
                name="Total"
                fill="#F6881F"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#9f7aea"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Radial + Recent Users ── */}
      <div className="dashboard-charts-row">
        {/* Radial – Platform Summary */}
        <div className="dashboard-chart-card">
          <ChartTitle icon={FaBolt} color="#f6ad55">
            Platform Summary
          </ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart
              innerRadius={20}
              outerRadius={100}
              data={radialData}
              startAngle={90}
              endAngle={-270}
              // margin={{ bottom: 20 }}
            >
              <RadialBar
                background={{ fill: isDark ? "#2e3347" : "#f0f4f8" }}
                dataKey="value"
                cornerRadius={6}
                label={{
                  position: "insideStart",
                  fill: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: "18px" }}
                formatter={(val) => (
                  <span style={{ color: legendColor, fontSize: 12 }}>
                    {val}
                  </span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users Table */}
        <div className="dashboard-chart-card">
          <div className="section-title">
            <FaUsers style={{ color: "#3182ce" }} /> Recent Registrations
            <Link to="/admin/users" className="section-link">
              View All →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="empty-state">No users yet</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th className="dashboard-th">Name</th>
                    <th className="dashboard-th">Email</th>
                    <th className="dashboard-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="dashboard-td">{u.full_name}</td>
                      <td className="dashboard-td" title={u.email}>
                        {u.email.length > 22
                          ? u.email.slice(0, 22) + "…"
                          : u.email}
                      </td>
                      <td className="dashboard-td">
                        <span
                          className={`status-badge ${u.is_verified ? "badge-success" : "badge-pending"}`}
                        >
                          {u.is_verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom: Summary Cards ── */}
      <div className="dashboard-columns">
        <div className="dashboard-section">
          <div className="section-title">
            <FaBars style={{ color: "#F6881F" }} /> Navbar Overview
            <Link to="/admin/manage-navbar" className="section-link">
              Manage →
            </Link>
          </div>
          <div className="navbar-summary-list">
            <div className="summary-item">
              <span className="summary-label">Main Menu Items</span>
              <strong className="summary-value">{navbarCount}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Dropdown Items</span>
              <strong className="summary-value">{dropdownCount}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active Links</span>
              <strong className="summary-value val-success">
                {activeNavCount}
              </strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Hidden Links</span>
              <Link
                to="/admin/manage-navbar?filter=hidden"
                className="summary-value val-danger"
                style={{ textDecoration: "none" }}
              >
                {navLinks.length - activeNavCount}
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-title">
            <FaEnvelope style={{ color: "#F6881F" }} /> Leads Summary
            <Link to="/admin/admissions" className="section-link">
              View →
            </Link>
          </div>
          <div className="navbar-summary-list">
            <div className="summary-item">
              <span className="summary-label">Total Admissions</span>
              <strong className="summary-value">{totalAdmissions}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pending Admissions</span>
              <strong className="summary-value val-danger">{pendingAdm}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Callbacks</span>
              <strong className="summary-value">{totalCallbacks}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Unread Callbacks</span>
              <strong className="summary-value val-danger">{unreadCB}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
