const processDetails = {
  'driving-licence': {
    title: 'Driving Licence',
    description: 'Understand the basics for learner licences, driving tests, and licence renewals.',
    officialUrl: 'https://parivahan.gov.in/sarathiservice/stateSelection',
    eligibility: ['Applicant must meet age and medical requirements', 'Learner licence requires a valid application and fee'],
    documents: ['Age proof', 'Address proof', 'Form 1/1A', 'Passport-size photo'],
    timeline: ['Submit the licence application', 'Complete the learner test', 'Book and pass the road test', 'Receive the licence'],
    faqs: [
      { question: 'Do I need a test?', answer: 'Yes, a practical driving test is generally required for the permanent licence.' },
    ],
    mistakes: ['Submitting incomplete forms', 'Ignoring the test slot instructions'],
  },
  scholarship: {
    title: 'Scholarship Application',
    description: 'Prepare your scholarship submission with an eligibility-focused checklist.',
    officialUrl: 'https://scholarships.gov.in/',
    eligibility: ['Applicant must meet the academic or income criteria', 'Required supporting documents must be valid'],
    documents: ['Academic records', 'Income certificate', 'Identity proof', 'Recommendation letters'],
    timeline: ['Review the scholarship criteria', 'Gather supporting documents', 'Submit the online application', 'Track application status'],
    faqs: [{ question: 'Can I edit after submitting?', answer: 'Most portals allow limited edits before the deadline.' }],
    mistakes: ['Missing deadlines', 'Submitting inconsistent academic information'],
  },
  'college-admission': {
    title: 'College Admission',
    description: 'Create a smoother admission plan by understanding prerequisites and documents.',
    officialUrl: 'https://www.ugc.gov.in/',
    eligibility: ['Applicants must satisfy course-specific academic requirements', 'Some institutions may require entrance test scores'],
    documents: ['Marksheets', 'Certificates', 'Identity proof', 'Entrance test results'],
    timeline: ['Check admissions criteria', 'Prepare documents', 'Register and pay the application fee', 'Attend counselling or interviews'],
    faqs: [{ question: 'Is counselling mandatory?', answer: 'Many institutions require a counselling or interview round.' }],
    mistakes: ['Forgetting to upload translated documents', 'Ignoring portal-specific instructions'],
  },
  pan: {
    title: 'PAN Card Application',
    description: 'Prepare a strong PAN application with the right form and documents.',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    eligibility: ['Applicant must have a valid identity and residence proof', 'Foreign citizens may need extra documentation'],
    documents: ['Identity proof', 'Address proof', 'Date of birth proof'],
    timeline: ['Complete the online form', 'Upload documents', 'Pay the fee', 'Track acknowledgment'],
    faqs: [{ question: 'Is PAN mandatory for tax filing?', answer: 'Yes, PAN is commonly required for financial and tax-related activities.' }],
    mistakes: ['Providing incorrect date of birth', 'Using the wrong application category'],
  },
  aadhaar: {
    title: 'Aadhaar Address Update',
    description: 'Get a shorter path to updating your address details with the right proof.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    eligibility: ['The applicant must already have an Aadhaar number'],
    documents: ['Aadhaar number', 'Address proof', 'Supporting identity document'],
    timeline: ['Open update request', 'Upload proof', 'Submit request', 'Verify status'],
    faqs: [{ question: 'Can I do this online?', answer: 'Yes, you can begin the update online and follow the portal instructions.' }],
    mistakes: ['Uploading unsupported document formats', 'Entering an incorrect address'],
  },
  business: {
    title: 'Business Registration',
    description: 'Review the key documents, steps, and common issues for business registration.',
    officialUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
    eligibility: ['Applicant must provide business details and owner identity', 'Depending on the entity type, additional documents may be required'],
    documents: ['Identity proof', 'Address proof', 'Business name reservation', 'Partnership or incorporation forms'],
    timeline: ['Choose the business structure', 'Reserve name and gather documents', 'Submit filings', 'Receive registration certificate'],
    faqs: [{ question: 'How long does registration take?', answer: 'This depends on the jurisdiction and the completeness of the filing.' }],
    mistakes: ['Choosing an unavailable business name', 'Submitting conflicting owner details'],
  },
  gst: {
    title: 'GST Registration',
    description: 'Understand the basics of GST registration and the documents you will need.',
    officialUrl: 'https://www.gst.gov.in/',
    eligibility: ['Businesses crossing turnover thresholds may be required to register', 'Some businesses may register voluntarily'],
    documents: ['PAN', 'Proof of business address', 'Identity proof', 'Bank account details'],
    timeline: ['Check eligibility', 'Prepare business information', 'Submit the application', 'Receive GSTIN'],
    faqs: [{ question: 'Is GST registration mandatory?', answer: 'It depends on the turnover, business nature, and registration rules applicable to you.' }],
    mistakes: ['Using incorrect business category', 'Providing inconsistent address details'],
  },
  'voter-id': {
    title: 'Voter ID Registration',
    description: 'Make your election registration process smoother with a practical checklist.',
    officialUrl: 'https://voters.eci.gov.in/',
    eligibility: ['Applicant must be a citizen and meet age requirements'],
    documents: ['Proof of age', 'Proof of address', 'Passport-size photo'],
    timeline: ['Fill the application', 'Upload documents', 'Submit form', 'Track status'],
    faqs: [{ question: 'Can I update my address?', answer: 'Yes, address changes can often be requested through a separate update flow.' }],
    mistakes: ['Submitting duplicate applications', 'Using outdated address proof'],
  }
};

function renderProcessDetails(processId) {
  const process = processDetails[processId];
  if (!process) {
    document.getElementById('processTitle').textContent = 'Process not found';
    return;
  }

  document.getElementById('processTitle').textContent = process.title;
  document.getElementById('processDescription').textContent = process.description;
  const officialLink = document.getElementById('officialLink');
  const backupLink = document.getElementById('backupLink');
  const linkStatus = document.getElementById('linkStatus');
  if (officialLink) {
    if (process.officialUrl) {
      officialLink.href = process.officialUrl;
      officialLink.style.display = 'inline-flex';
      if (backupLink) {
        backupLink.href = `https://web.archive.org/web/*/${process.officialUrl}`;
        backupLink.style.display = 'inline-flex';
      }
      if (linkStatus) {
        linkStatus.textContent = 'Official portal provided. If the site shows "Server Unavailable", try the archived snapshot or retry later.';
      }
    } else {
      officialLink.style.display = 'none';
      if (backupLink) backupLink.style.display = 'none';
      if (linkStatus) linkStatus.textContent = '';
    }
  }
  document.getElementById('eligibilityList').innerHTML = process.eligibility.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('documentsList').innerHTML = process.documents.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('timelineList').innerHTML = process.timeline
    .map((item, index) => `
      <div class="timeline-item">
        <div class="timeline-number">${index + 1}</div>
        <div>${item}</div>
      </div>
    `)
    .join('');
  document.getElementById('faqList').innerHTML = process.faqs
    .map((faq) => `<div class="faq-item"><strong>${faq.question}</strong><div>${faq.answer}</div></div>`)
    .join('');
  document.getElementById('mistakesList').innerHTML = process.mistakes.map((item) => `<li>${item}</li>`).join('');
}

async function loadProcessDetails(processId) {
  try {
    const payload = await apiRequest(`/api/processes/${processId}`);
    const process = payload.process || payload.data?.process;
    if (!process) throw new Error('Process not found');

    const detail = {
      title: process.name,
      description: process.description,
      officialUrl: process.officialWebsite,
      eligibility: process.eligibility || [],
      documents: process.requiredDocuments || [],
      timeline: process.applicationSteps || [],
      faqs: process.faqs || [],
      mistakes: ['Review the official instructions carefully', 'Prepare all required documents before submission'],
    };

    document.getElementById('processTitle').textContent = detail.title;
    document.getElementById('processDescription').textContent = detail.description;
    const officialLink = document.getElementById('officialLink');
    const backupLink = document.getElementById('backupLink');
    const linkStatus = document.getElementById('linkStatus');
    if (officialLink) {
      if (detail.officialUrl) {
        officialLink.href = detail.officialUrl;
        officialLink.style.display = 'inline-flex';
        if (backupLink) {
          backupLink.href = `https://web.archive.org/web/*/${detail.officialUrl}`;
          backupLink.style.display = 'inline-flex';
        }
        if (linkStatus) {
          linkStatus.textContent = 'Official portal provided. If the site shows "Server Unavailable", try the archived snapshot or retry later.';
        }
      } else {
        officialLink.style.display = 'none';
        if (backupLink) backupLink.style.display = 'none';
        if (linkStatus) linkStatus.textContent = '';
      }
    }
    document.getElementById('eligibilityList').innerHTML = detail.eligibility.map((item) => `<li>${item}</li>`).join('');
    document.getElementById('documentsList').innerHTML = detail.documents.map((item) => `<li>${item}</li>`).join('');
    document.getElementById('timelineList').innerHTML = detail.timeline
      .map((item, index) => `
        <div class="timeline-item">
          <div class="timeline-number">${index + 1}</div>
          <div>${item}</div>
        </div>
      `)
      .join('');
    document.getElementById('faqList').innerHTML = detail.faqs
      .map((faq) => `<div class="faq-item"><strong>${faq.question}</strong><div>${faq.answer}</div></div>`)
      .join('');
    document.getElementById('mistakesList').innerHTML = detail.mistakes.map((item) => `<li>${item}</li>`).join('');
  } catch (error) {
    renderProcessDetails(processId);
    showToast(error.message || 'Could not load process details');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const selectedId = localStorage.getItem('selectedProcessId') || 'driving-licence';
  loadProcessDetails(selectedId);

  document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  document.getElementById('askAiBtn')?.addEventListener('click', () => {
    window.location.href = 'chat.html';
  });
});
