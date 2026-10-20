export default function Topbar({ active, actions = false }) {
  return <header className="topbar glass-card">
    <a href="dashboard.html" className="brand"><div className="brand-bubble"><i className="fas fa-compass" /></div><div><strong>PathPilot AI</strong><span>Process &amp; Document Intelligence</span></div></a>
    <nav className="topnav"><a href="dashboard.html" className={active === 'dashboard' ? 'active' : ''}>Dashboard</a><a href="chat.html" className={active === 'chat' ? 'active' : ''}>AI Assistant</a><a href="profile.html" className={active === 'profile' ? 'active' : ''}>Profile</a></nav>
    {actions && <div className="topbar-actions"><a href="profile.html" className="profile-pill">Profile</a></div>}
  </header>;
}
