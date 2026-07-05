const processCatalog = [
  {
    id: 'driving-licence',
    title: 'Driving Licence',
    description: 'Understand learner and permanent licence requirements with document-ready steps.',
    officialUrl: 'https://parivahan.gov.in/sarathiservice/stateSelection',
    icon: 'fa-car',
  },
  {
    id: 'scholarship',
    title: 'Scholarship Application',
    description: 'Prepare for eligibility checks, supporting documents, and submission timelines.',
    officialUrl: 'https://scholarships.gov.in/',
    icon: 'fa-graduation-cap',
  },
  {
    id: 'college-admission',
    title: 'College Admission',
    description: 'Navigate admission portals, prerequisites, and document verification.',
    officialUrl: 'https://www.ugc.gov.in/',
    icon: 'fa-university',
  },
  {
    id: 'pan',
    title: 'PAN Card Application',
    description: 'Review forms, identity proofs, and important submission notes.',
    officialUrl: 'https://www.tin-nsdl.com',
    icon: 'fa-id-card',
  },
  {
    id: 'aadhaar',
    title: 'Aadhaar Address Update',
    description: 'Get the right documents and steps for updating your address details.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    icon: 'fa-address-card',
  },
  {
    id: 'business',
    title: 'Business Registration',
    description: 'Plan your registration journey with business structure and document checklists.',
    officialUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
    icon: 'fa-building',
  },
  {
    id: 'gst',
    title: 'GST Registration',
    description: 'Check eligibility, documents, and stakeholder data for registration.',
    officialUrl: 'https://www.gst.gov.in/',
    icon: 'fa-receipt',
  },
  {
    id: 'voter-id',
    title: 'Voter ID Registration',
    description: 'Learn about proof of identity and address requirements before you apply.',
    officialUrl: 'https://voters.eci.gov.in/',
    icon: 'fa-vote-yea',
  },
];

function normalizeProcessList(processes = []) {
  return processes.map((process) => {
    const fallback = processCatalog.find((item) => item.id === process.id) || processCatalog.find((item) => item.title === process.name);
    return {
      id: process.id || fallback?.id || process.name?.toLowerCase().replace(/\s+/g, '-'),
      title: process.name || process.title || fallback?.title,
      description: process.description || fallback?.description || '',
      officialUrl: process.officialWebsite || process.officialUrl || fallback?.officialUrl,
      icon: fallback?.icon || 'fa-file-alt',
    };
  });
}

function renderProcessCards(processes = processCatalog, filter = '') {
  const grid = document.getElementById('processGrid');
  if (!grid) return;

  const filtered = processes.filter((process) => {
    const query = filter.toLowerCase();
    return (
      process.title.toLowerCase().includes(query) ||
      process.description.toLowerCase().includes(query)
    );
  });

  if (!filtered.length) {
    grid.innerHTML = '<p>No processes found.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (process) => `
        <article class="process-card">
          <div class="icon"><i class="fas ${process.icon}"></i></div>
          <h3>${process.title}</h3>
          <p>${process.description}</p>
          <div style="display:flex;gap:0.6rem;align-items:center">
            <button class="btn btn-primary view-details" data-id="${process.id}">View Details</button>
            <button class="btn btn-secondary register-now" data-id="${process.id}">Register</button>
          </div>
        </article>
      `
    )
    .join('');

  grid.querySelectorAll('.view-details').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('selectedProcessId', button.dataset.id);
      window.location.href = 'process.html';
    });
  });
  grid.querySelectorAll('.register-now').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const proc = filtered.find((item) => item.id === id) || processCatalog.find((item) => item.id === id);
      if (proc?.officialUrl) {
        window.open(proc.officialUrl, '_blank', 'noopener,noreferrer');
      } else {
        showToast('Official registration link not available for this process.');
      }
    });
  });
}

function renderRecentProcesses(processes = processCatalog) {
  const recentList = document.getElementById('recentList');
  if (!recentList) return;
  recentList.innerHTML = processes
    .slice(0, 4)
    .map(
      (process) => `
        <div class="recent-item">
          <div>
            <strong>${process.title}</strong>
            <p>${process.description}</p>
          </div>
          <button class="btn btn-secondary view-details" data-id="${process.id}">Open</button>
        </div>
      `
    )
    .join('');

  recentList.querySelectorAll('.view-details').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem('selectedProcessId', button.dataset.id);
      window.location.href = 'process.html';
    });
  });
}

async function hydrateProfileSummary() {
  const user = getStoredUser();
  const welcomeName = document.getElementById('welcomeName');
  const profileShortName = document.getElementById('profileShortName');
  const profileShortRole = document.getElementById('profileShortRole');
  if (welcomeName) {
    welcomeName.textContent = `Welcome back, ${user.fullName || user.name || 'there'}!`;
  }
  if (profileShortName) {
    profileShortName.textContent = user.fullName || 'Your Profile';
  }
  if (profileShortRole) {
    profileShortRole.textContent = user.occupation || 'Continue personalizing your experience.';
  }
}

async function loadProcesses() {
  try {
    const payload = await apiRequest('/api/processes');
    const backendProcesses = payload.processes || payload.data?.processes || [];
    const processes = normalizeProcessList(backendProcesses);
    window.__pathpilotProcesses = processes;
    renderProcessCards(processes);
    renderRecentProcesses(processes);
  } catch (error) {
    renderProcessCards(processCatalog);
    renderRecentProcesses(processCatalog);
    showToast(error.message || 'Could not load processes');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProcesses();
  hydrateProfileSummary();

  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', (event) => {
    const currentProcesses = window.__pathpilotProcesses || processCatalog;
    renderProcessCards(currentProcesses, event.target.value);
  });

  document.querySelectorAll('.assistant-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      localStorage.setItem('chatPrompt', chip.dataset.prompt);
      window.location.href = 'chat.html';
    });
  });
});
