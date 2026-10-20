import { lazy, Suspense, useEffect, useState } from 'react';
import Topbar from './components/Topbar.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';
const demoUser = { fullName: 'Duri Raj', email: 'durirajvv@gmail.com', phone: '9876543210', state: 'Tamil Nadu', occupation: 'Developer' };

const processCatalog = [
  ['driving-licence', 'Driving Licence', 'Understand learner and permanent licence requirements with document-ready steps.', 'https://parivahan.gov.in/sarathiservice/stateSelection', 'fa-car'],
  ['scholarship', 'Scholarship Application', 'Prepare for eligibility checks, supporting documents, and submission timelines.', 'https://scholarships.gov.in/', 'fa-graduation-cap'],
  ['college-admission', 'College Admission', 'Navigate admission portals, prerequisites, and document verification.', 'https://www.ugc.gov.in/', 'fa-university'],
  ['pan', 'PAN Card Application', 'Review forms, identity proofs, and important submission notes.', 'https://www.tin-nsdl.com', 'fa-id-card'],
  ['aadhaar', 'Aadhaar Address Update', 'Get the right documents and steps for updating your address details.', 'https://myaadhaar.uidai.gov.in/', 'fa-address-card'],
  ['business', 'Business Registration', 'Plan your registration journey with business structure and document checklists.', 'https://www.mca.gov.in/content/mca/global/en/home.html', 'fa-building'],
  ['gst', 'GST Registration', 'Check eligibility, documents, and stakeholder data for registration.', 'https://www.gst.gov.in/', 'fa-receipt'],
  ['voter-id', 'Voter ID Registration', 'Learn about proof of identity and address requirements before you apply.', 'https://voters.eci.gov.in/', 'fa-vote-yea'],
].map(([id, title, description, officialUrl, icon]) => ({ id, title, description, officialUrl, icon }));

const processDetails = {
  'driving-licence': ['Driving Licence', 'Understand the basics for learner licences, driving tests, and licence renewals.', ['Applicant must meet age and medical requirements', 'Learner licence requires a valid application and fee'], ['Age proof', 'Address proof', 'Form 1/1A', 'Passport-size photo'], ['Submit the licence application', 'Complete the learner test', 'Book and pass the road test', 'Receive the licence'], 'Do I need a test?', 'Yes, a practical driving test is generally required for the permanent licence.'],
  scholarship: ['Scholarship Application', 'Prepare your scholarship submission with an eligibility-focused checklist.', ['Applicant must meet the academic or income criteria', 'Required supporting documents must be valid'], ['Academic records', 'Income certificate', 'Identity proof', 'Recommendation letters'], ['Review the scholarship criteria', 'Gather supporting documents', 'Submit the online application', 'Track application status'], 'Can I edit after submitting?', 'Most portals allow limited edits before the deadline.'],
  'college-admission': ['College Admission', 'Create a smoother admission plan by understanding prerequisites and documents.', ['Applicants must satisfy course-specific academic requirements', 'Some institutions may require entrance test scores'], ['Marksheets', 'Certificates', 'Identity proof', 'Entrance test results'], ['Check admissions criteria', 'Prepare documents', 'Register and pay the application fee', 'Attend counselling or interviews'], 'Is counselling mandatory?', 'Many institutions require a counselling or interview round.'],
  pan: ['PAN Card Application', 'Prepare a strong PAN application with the right form and documents.', ['Applicant must have a valid identity and residence proof', 'Foreign citizens may need extra documentation'], ['Identity proof', 'Address proof', 'Date of birth proof'], ['Complete the online form', 'Upload documents', 'Pay the fee', 'Track acknowledgment'], 'Is PAN mandatory for tax filing?', 'Yes, PAN is commonly required for financial and tax-related activities.'],
  aadhaar: ['Aadhaar Address Update', 'Get a shorter path to updating your address details with the right proof.', ['The applicant must already have an Aadhaar number'], ['Aadhaar number', 'Address proof', 'Supporting identity document'], ['Open update request', 'Upload proof', 'Submit request', 'Verify status'], 'Can I do this online?', 'Yes, you can begin the update online and follow the portal instructions.'],
  business: ['Business Registration', 'Review the key documents, steps, and common issues for business registration.', ['Applicant must provide business details and owner identity', 'Depending on the entity type, additional documents may be required'], ['Identity proof', 'Address proof', 'Business name reservation', 'Partnership or incorporation forms'], ['Choose the business structure', 'Reserve name and gather documents', 'Submit filings', 'Receive registration certificate'], 'How long does registration take?', 'This depends on the jurisdiction and the completeness of the filing.'],
  gst: ['GST Registration', 'Understand the basics of GST registration and the documents you will need.', ['Businesses crossing turnover thresholds may be required to register', 'Some businesses may register voluntarily'], ['PAN', 'Proof of business address', 'Identity proof', 'Bank account details'], ['Check eligibility', 'Prepare business information', 'Submit the application', 'Receive GSTIN'], 'Is GST registration mandatory?', 'It depends on the turnover, business nature, and registration rules applicable to you.'],
  'voter-id': ['Voter ID Registration', 'Make your election registration process smoother with a practical checklist.', ['Applicant must be a citizen and meet age requirements'], ['Proof of age', 'Proof of address', 'Passport-size photo'], ['Fill the application', 'Upload documents', 'Submit form', 'Track status'], 'Can I update my address?', 'Yes, address changes can often be requested through a separate update flow.'],
};

function storedUser() { try { return JSON.parse(localStorage.getItem('pathpilot_user') || '{}'); } catch { return {}; } }
function token() { return localStorage.getItem('pathpilot_token'); }
function saveUser(user) { localStorage.setItem('pathpilot_user', JSON.stringify(user)); }
function clearAuth() { localStorage.removeItem('pathpilot_token'); localStorage.removeItem('pathpilot_user'); }
async function apiRequest(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Your session expired. Please sign in again.');
  }
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function Feedback({ loading, toast }) {
  return <><div id="loader" className={`loader-overlay${loading ? ' show' : ''}`}><div className="spinner" /></div><div id="toast" className={toast ? 'show' : ''}>{toast}</div></>;
}

function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2200); };
  return { loading, setLoading, toast, notify };
}

function Splash() {
  useEffect(() => { const timer = window.setTimeout(() => { window.location.hash = '#/login'; }, 2400); return () => window.clearTimeout(timer); }, []);
  return <div className="splash-page"><div className="splash-screen"><div className="orb orb-one" /><div className="orb orb-two" /><div className="logo-bubble"><i className="fas fa-compass" /></div><h1>PathPilot AI</h1><p>Know the Process. Prepare the Documents. Apply with Confidence.</p><a href="login.html" className="btn btn-primary">Get Started</a></div></div>;
}

function AuthHero({ register }) { return <section className="auth-hero"><div className="hero-badge">{register ? 'New Here?' : 'AI Process Navigator'}</div><h1>{register ? 'Build a calmer path to formal applications.' : 'Welcome back to PathPilot AI'}</h1><p>{register ? 'Get step-by-step support for processes, documents, and eligibility checks.' : 'Move from uncertainty to clarity with AI-guided government and institutional workflows.'}</p><div className="hero-list">{(register ? [['fa-bolt', 'Personalized guidance'], ['fa-file-alt', 'Document-ready summaries'], ['fa-comments', 'Ask AI questions instantly']] : [['fa-check-circle', 'Intelligent eligibility insights'], ['fa-check-circle', 'Document checklists and timelines'], ['fa-check-circle', 'Guided assistance for every step']]).map(([icon, text]) => <div key={text}><i className={`fas ${icon}`} /> {text}</div>)}</div></section>; }

function Login() {
  const { loading, setLoading, toast, notify } = useFeedback();
  const submit = async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const email = form.get('email').trim(); const password = form.get('password'); if (!email || !password) return notify('Please enter both email and password.'); setLoading(true); try { const payload = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); localStorage.setItem('pathpilot_token', payload.token); saveUser(payload.user || { email, name: email.split('@')[0] }); notify('Login successful'); window.setTimeout(() => { window.location.hash = '#/dashboard'; }, 600); } catch (error) { notify(error.message || 'Login failed'); } finally { setLoading(false); } };
  return <><main className="auth-shell"><AuthHero /><section className="auth-card"><div className="card-head"><h2>Sign In</h2><p>Access your personalized process dashboard.</p></div><form id="loginForm" className="auth-form" onSubmit={submit}><label>Email<input type="email" name="email" id="email" placeholder="you@example.com" required /></label><label>Password<input type="password" name="password" id="password" placeholder="Enter your password" required /></label><div className="form-row"><label className="checkbox-row"><input type="checkbox" id="rememberMe" /><span>Remember me</span></label><a href="#" className="text-link">Forgot Password?</a></div><button type="submit" className="btn btn-primary btn-block">Login</button></form><div className="auth-footer"><span>Don’t have an account?</span><a href="register.html" className="text-link">Register</a></div></section></main><Feedback loading={loading} toast={toast} /></>;
}

function Register() {
  const { loading, setLoading, toast, notify } = useFeedback();
  const submit = async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const values = Object.fromEntries(form.entries()); if (Object.values(values).some((value) => !value)) return notify('Please fill in all fields.'); if (values.password.length < 6) return notify('Password must be at least 6 characters.'); if (values.password !== values.confirmPassword) return notify('Passwords do not match.'); setLoading(true); try { const payload = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify({ fullName: values.fullName, email: values.email, phone: values.phone, state: values.state, occupation: values.occupation, password: values.password }) }); localStorage.setItem('pathpilot_token', payload.token || 'demo-token'); saveUser(payload.user || values); notify('Registration successful'); window.setTimeout(() => { window.location.hash = '#/dashboard'; }, 600); } catch (error) { notify(error.message || 'Registration failed'); } finally { setLoading(false); } };
  return <><main className="auth-shell reverse"><section className="auth-card"><div className="card-head"><h2>Create Account</h2><p>Start building clarity around your next application.</p></div><form id="registerForm" className="auth-form grid-form" onSubmit={submit}>{[['fullName', 'Full Name', 'Alicia Gomez', 'text'], ['email', 'Email', 'you@example.com', 'email'], ['phone', 'Phone Number', '9876543210', 'tel'], ['state', 'State', 'Delhi', 'text'], ['occupation', 'Occupation', 'Student', 'text'], ['password', 'Password', 'Create a strong password', 'password'], ['confirmPassword', 'Confirm Password', 'Repeat your password', 'password']].map(([id, label, placeholder, type]) => <label key={id}>{label}<input type={type} name={id} id={id} placeholder={placeholder} required /></label>)}<button type="submit" className="btn btn-primary btn-block">Register</button></form><div className="auth-footer"><span>Already have an account?</span><a href="login.html" className="text-link">Login</a></div></section><AuthHero register /></main><Feedback loading={loading} toast={toast} /></>;
}

function Dashboard() {
  const user = storedUser(); const { loading, setLoading, toast, notify } = useFeedback(); const [processes, setProcesses] = useState(processCatalog); const [search, setSearch] = useState('');
  useEffect(() => { apiRequest('/api/processes').then((payload) => { const list = payload.processes || payload.data?.processes || []; if (list.length) setProcesses(list.map((item) => { const fallback = processCatalog.find((entry) => entry.id === item.id || entry.title === item.name); return { ...fallback, ...item, title: item.name || item.title || fallback?.title, officialUrl: item.officialWebsite || item.officialUrl || fallback?.officialUrl, icon: fallback?.icon || 'fa-file-alt' }; })); }).catch((error) => notify(error.message || 'Could not load processes')); }, []);
  const filtered = processes.filter((item) => (item.title || '').toLowerCase().includes(search.toLowerCase()) || (item.description || '').toLowerCase().includes(search.toLowerCase()));
  const openDetails = (id) => { localStorage.setItem('selectedProcessId', id); window.location.hash = '#/process'; };
  const register = (item) => item.officialUrl ? window.open(item.officialUrl, '_blank', 'noopener,noreferrer') : notify('Official registration link not available for this process.');
  return <><Topbar active="dashboard" actions /><main className="page-shell"><section className="hero-card glass-card"><div><p className="eyebrow">Good morning</p><h1 id="welcomeName">Welcome back, {user.fullName || user.name || 'there'}!</h1><p>Find the process, gather the documents, and move forward with clarity.</p></div><div className="hero-search"><i className="fas fa-search" /><input id="searchInput" value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Search processes, documents, FAQs" /></div></section><section className="dashboard-grid"><div className="main-column"><div className="panel glass-card"><div className="panel-head"><div><h2>Popular Processes</h2><p>Guided support across key government and institutional workflows.</p></div></div><div id="processGrid" className="process-grid">{filtered.length ? filtered.map((item) => <article className="process-card" key={item.id}><div className="icon"><i className={`fas ${item.icon}`} /></div><h3>{item.title}</h3><p>{item.description}</p><div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}><button className="btn btn-primary view-details" onClick={() => openDetails(item.id)}>View Details</button><button className="btn btn-secondary register-now" onClick={() => register(item)}>Register</button></div></article>) : <p>No processes found.</p>}</div></div><div className="panel glass-card"><div className="panel-head"><div><h2>Recent Processes</h2><p>Pick up where you left off.</p></div></div><div id="recentList" className="recent-list">{processes.slice(0, 4).map((item) => <div className="recent-item" key={item.id}><div><strong>{item.title}</strong><p>{item.description}</p></div><button className="btn btn-secondary view-details" onClick={() => openDetails(item.id)}>Open</button></div>)}</div></div></div><aside className="side-column"><div className="panel glass-card quick-card"><div className="panel-head"><div><h2>Quick AI Assistant</h2><p>Ask anything about documents, eligibility, or next steps.</p></div></div><div className="assistant-actions">{[['Documents', 'What documents are required?'], ['Eligibility', 'Am I eligible?'], ['Application Venue', 'Where should I apply?']].map(([label, prompt]) => <button className="assistant-chip" key={label} onClick={() => { localStorage.setItem('chatPrompt', prompt); window.location.hash = '#/chat'; }}>{label}</button>)}</div><a href="chat.html" className="btn btn-primary btn-block">Open Assistant</a></div><div className="panel glass-card profile-shortcut"><div className="profile-pill-card"><div className="avatar">P</div><div><strong id="profileShortName">{user.fullName || 'Your Profile'}</strong><p id="profileShortRole">{user.occupation || 'Continue personalizing your experience.'}</p></div></div><a href="profile.html" className="text-link">Edit profile</a></div></aside></section></main><Feedback loading={loading} toast={toast} /></>;
}

function ProcessPage() {
  const { loading, setLoading, toast, notify } = useFeedback(); const [detail, setDetail] = useState(null); const id = localStorage.getItem('selectedProcessId') || 'driving-licence';
  useEffect(() => { setLoading(true); apiRequest(`/api/processes/${id}`).then((payload) => { const item = payload.process || payload.data?.process; if (!item) throw new Error('Process not found'); setDetail({ title: item.name, description: item.description, officialUrl: item.officialWebsite, eligibility: item.eligibility || [], documents: item.requiredDocuments || [], timeline: item.applicationSteps || [], faqs: item.faqs || [], mistakes: ['Review the official instructions carefully', 'Prepare all required documents before submission'] }); }).catch((error) => { const fallback = processDetails[id] || processDetails['driving-licence']; setDetail({ title: fallback[0], description: fallback[1], officialUrl: processCatalog.find((item) => item.id === id)?.officialUrl, eligibility: fallback[2], documents: fallback[3], timeline: fallback[4], faqs: [{ question: fallback[5], answer: fallback[6] }], mistakes: ['Submitting incomplete forms', 'Ignoring the official instructions'] }); notify(error.message || 'Could not load process details'); }).finally(() => setLoading(false)); }, [id]);
  if (!detail) return <><Topbar /><main className="page-shell"><p>Loading process...</p></main><Feedback loading={loading} toast={toast} /></>;
  const archive = detail.officialUrl ? `https://web.archive.org/web/*/${detail.officialUrl}` : '#';
  return <><Topbar /><main className="page-shell"><button id="backBtn" className="back-btn" onClick={() => { window.location.hash = '#/dashboard'; }}><i className="fas fa-arrow-left" /> Back</button><section className="process-hero glass-card"><div className="process-hero-content"><p className="eyebrow">Official Process Guide</p><h1 id="processTitle">{detail.title}</h1><p id="processDescription">{detail.description}</p><div className="hero-actions"><button id="askAiBtn" className="btn btn-primary" onClick={() => { window.location.hash = '#/chat'; }}>Ask AI</button><a id="officialLink" className="btn btn-secondary" href={detail.officialUrl || '#'} target="_blank" rel="noopener noreferrer">Visit Official Website</a><a id="backupLink" className="btn btn-secondary" href={archive} target="_blank" rel="noopener noreferrer">Open Archive / Cached</a></div><div id="linkStatus" className="link-status" aria-live="polite" style={{ marginTop: '0.6rem', color: 'var(--muted)', fontSize: '0.95rem' }}>Official portal provided. If the site shows "Server Unavailable", try the archived snapshot or retry later.</div></div></section><section className="details-grid"><DetailList title="Eligibility" icon="fa-user-check" items={detail.eligibility} /><DetailList title="Required Documents" icon="fa-file-alt" items={detail.documents} /><div className="glass-card detail-card full-width"><h3><i className="fas fa-clock" /> Step-by-Step Timeline</h3><div id="timelineList" className="timeline">{detail.timeline.map((item, index) => <div className="timeline-item" key={item}><div className="timeline-number">{index + 1}</div><div>{item}</div></div>)}</div></div><div className="glass-card detail-card"><h3><i className="fas fa-circle-question" /> FAQs</h3><div id="faqList" className="faq-list">{detail.faqs.map((faq) => <div className="faq-item" key={faq.question}><strong>{faq.question}</strong><div>{faq.answer}</div></div>)}</div></div><DetailList title="Common Mistakes" icon="fa-triangle-exclamation" items={detail.mistakes} /></section></main><Feedback loading={loading} toast={toast} /></>;
}
function DetailList({ title, icon, items }) { return <div className="glass-card detail-card"><h3><i className={`fas ${icon}`} /> {title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>; }

function Profile() {
  const { loading, setLoading, toast, notify } = useFeedback(); const [user, setUser] = useState(storedUser()); const [editing, setEditing] = useState(false);
  useEffect(() => { setLoading(true); apiRequest('/api/profile').then((payload) => { const next = payload.user || payload; saveUser(next); setUser(next); }).catch((error) => notify(error.message || 'Could not load profile')).finally(() => setLoading(false)); }, []);
  const saveProfile = async (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget).entries()); setLoading(true); try { const payload = await apiRequest('/api/profile', { method: 'PUT', body: JSON.stringify(values) }); const next = payload.user || payload; saveUser(next); setUser(next); setEditing(false); notify('Profile updated successfully.'); } catch (error) { notify(error.message || 'Could not update profile'); } finally { setLoading(false); } };
  return <><Topbar active="profile" /><main className="page-shell profile-shell"><section className="profile-card glass-card"><div className="profile-photo"><i className="fas fa-user" /></div><div className="profile-info"><h1 id="profileName">{user.fullName || user.name || 'PathPilot User'}</h1><p id="profileEmail">{user.email || 'No email provided'}</p>{editing ? <form className="auth-form" onSubmit={saveProfile}><label>Full Name<input name="fullName" defaultValue={user.fullName || user.name || ''} required /></label><label>Phone<input name="phone" defaultValue={user.phone || ''} required /></label><label>State<input name="state" defaultValue={user.state || ''} required /></label><label>Occupation<input name="occupation" defaultValue={user.occupation || ''} required /></label><div className="profile-actions"><button className="btn btn-primary" type="submit">Save Changes</button><button className="btn btn-secondary" type="button" onClick={() => setEditing(false)}>Cancel</button></div></form> : <><div className="profile-meta"><span><i className="fas fa-phone" /> <span id="profilePhone">{user.phone || 'Add a phone number'}</span></span><span><i className="fas fa-map-marker-alt" /> <span id="profileState">{user.state || 'Add your state'}</span></span><span><i className="fas fa-briefcase" /> <span id="profileOccupation">{user.occupation || 'Add your occupation'}</span></span></div><div className="profile-actions"><button className="btn btn-primary" id="editProfileBtn" onClick={() => setEditing(true)}>Edit Profile</button><button className="btn btn-secondary" id="changePasswordBtn" onClick={() => notify('Password change flow is ready for backend integration.')}>Change Password</button><button className="btn btn-danger" id="logoutBtn" onClick={() => { clearAuth(); window.location.hash = '#/login'; }}>Logout</button></div></>}</div></section></main><Feedback loading={loading} toast={toast} /></>;
}

const welcomeMessage = 'I can help you understand eligibility, required documents, fees, timelines, and where to apply. Ask me anything about a process.';
function Chat() {
  const { loading, setLoading, toast, notify } = useFeedback(); const [messages, setMessages] = useState([{ role: 'ai', text: welcomeMessage }]); const [input, setInput] = useState('');
  const send = async (prompt) => { if (!prompt.trim()) return; setMessages((current) => [...current, { role: 'user', text: prompt }, { role: 'ai', text: 'Thinking', typing: true }]); setLoading(true); try { const response = await apiRequest('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message: prompt }) }); setMessages((current) => [...current.filter((message) => !message.typing), { role: 'ai', text: response.reply || 'Here is a concise response based on the available guidance.' }]); } catch (error) { setMessages((current) => [...current.filter((message) => !message.typing), { role: 'ai', text: error.message || 'I could not respond right now.' }]); } finally { setLoading(false); } };
  useEffect(() => { apiRequest('/api/ai/history').then((payload) => { const history = (payload.messages || []).map((message) => ({ role: message.role, text: message.content })); if (history.length) setMessages(history); }).catch((error) => notify(error.message || 'Could not load chat history')); const prompt = localStorage.getItem('chatPrompt'); if (prompt) { localStorage.removeItem('chatPrompt'); send(prompt); } }, []);
  const clearHistory = async () => { try { await apiRequest('/api/ai/history', { method: 'DELETE' }); setMessages([{ role: 'ai', text: welcomeMessage }]); } catch (error) { notify(error.message || 'Could not clear chat history'); } };
  const submit = (event) => { event.preventDefault(); send(input); setInput(''); };
  return <><Topbar active="chat" /><main className="chat-shell"><aside className="chat-sidebar glass-card"><div className="sidebar-head"><h3>Recent Chats</h3><button id="clearChat" className="text-link" onClick={clearHistory}>Clear</button></div><div id="chatHistory" className="chat-history" /></aside><section className="chat-panel glass-card"><div id="messageArea" className="message-area">{messages.map((message, index) => <div className={`message ${message.role}${message.typing ? ' typing' : ''}`} key={`${message.text}-${index}`}>{message.typing ? <span>Thinking</span> : message.text}</div>)}</div><div className="suggestions">{['What documents are required?', 'Am I eligible?', 'What is the application fee?', 'Where should I apply?'].map((prompt) => <button className="chip" data-prompt={prompt} key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div><form id="chatForm" className="composer" onSubmit={submit}><input id="chatInput" value={input} onChange={(event) => setInput(event.target.value)} type="text" placeholder="Ask about any process or document" /><button type="submit" className="btn btn-primary">Send</button></form></section></main><Feedback loading={loading} toast={toast} /></>;
}

const routeComponents = {
  login: lazy(() => import('./pages/Login.jsx')),
  register: lazy(() => import('./pages/Register.jsx')),
  dashboard: lazy(() => import('./pages/Dashboard.jsx')),
  process: lazy(() => import('./pages/Process.jsx')),
  chat: lazy(() => import('./pages/Chat.jsx')),
  profile: lazy(() => import('./pages/Profile.jsx')),
};

function currentRoute() {
  return window.location.hash.replace(/^#\/?/, '') || 'login';
}

export default function App() {
  const [page, setPage] = useState(currentRoute);
  useEffect(() => {
    const updateRoute = () => setPage(currentRoute());
    const navigateHtmlLinks = (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href$=".html"]');
      if (!link || link.origin !== window.location.origin) return;
      const route = link.pathname.split('/').pop().replace(/\.html$/, '');
      if (!routeComponents[route]) return;
      event.preventDefault();
      window.location.hash = `#/${route}`;
    };
    window.addEventListener('hashchange', updateRoute);
    document.addEventListener('click', navigateHtmlLinks);
    return () => {
      window.removeEventListener('hashchange', updateRoute);
      document.removeEventListener('click', navigateHtmlLinks);
    };
  }, []);
  useEffect(() => {
    if (['dashboard', 'process', 'chat', 'profile'].includes(page) && !token()) window.location.hash = '#/login';
  }, [page]);
  useEffect(() => {
    const titles = { login: 'Sign In', register: 'Register', dashboard: 'Dashboard', process: 'Process Details', chat: 'AI Assistant', profile: 'Profile' };
    document.title = `${titles[page] || titles.login} | PathPilot AI`;
  }, [page]);
  const Page = routeComponents[page] || routeComponents.login;
  return <Suspense fallback={null}><Page /></Suspense>;
}

export { Login as LoginView, Register as RegisterView, Dashboard as DashboardView, ProcessPage as ProcessView, Chat as ChatView, Profile as ProfileView };
