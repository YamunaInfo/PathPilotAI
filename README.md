# PathPilotAI
PathPilot AI is an AI-powered Process and Document Intelligence Assistant that helps users understand and complete official application processes with confidence. The application provides process guidance, eligibility information, required document checklists, step-by-step instructions, frequently asked questions.

                  📖 Documentation
                  🚀 Quick Start
                  🎯 Features
                  🏗️ Architecture
                  💬 Workflow
                  📂 Project Structure
                  ⚙️ Installation
                  🛠️ Technologies Used
                  🎯 Key Features

                         Feature	Description
         🤖 AI Assistant	Answers user queries using Google Gemini
         📄 Process Guidance	Explains official application procedures
         📑 Document Checklist	Displays required documents
         ✅ Eligibility Checker	Shows eligibility criteria
         📚 FAQ Support	Answers common questions
         🔍 Process Search	Search among supported services
          🗂️ MongoDB Storage	Stores process and document information
          📖 RAG Pipeline	Retrieves official information using ChromaDB
         🌐 Responsive UI	Works on desktop and mobile
         📋 Supported Processes
         🛂 Passport Application
         🚗 Driving Licence
         🎓 Scholarship Application
         🏫 College Admission
         💳 PAN Card Application
         🆔 Aadhaar Address Update
         🏢 Business Registration
         🧾 GST Registration
         🗳️ Voter ID Registration
         📄 Income Certificate

        🏗️ System Architecture

                  User
                   │
                   ▼
        HTML • CSS • JavaScript
                   │
                   ▼
             Python Flask API
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
    MongoDB      ChromaDB     Gemini API
      │            │             │
      └────────────┼─────────────┘
                   ▼
           AI Response to User
           
          ⚙️ Project Workflow
                 User
                  │
                  ▼
            Select Process
                  │
                  ▼
            Flask Backend
                  │
                  ▼
       MongoDB → Process Details
                  │
                  ▼
      ChromaDB → Retrieve Context
                  │
                  ▼
           Google Gemini
                  │
                  ▼
            AI Response
                  │
                  ▼
           Display to User

          🧠 AI Workflow
            User Question
                 │
                 ▼
            Search ChromaDB
                 │
                 ▼
          Retrieve Relevant Context
                 │
                 ▼
            Prompt Engineering
                 │
                 ▼
            Google Gemini API
                 │
                 ▼
           Generate AI Response
                 │
                 ▼
            Return Answer

                📂 Project Structure
                    PathPilot-AI/
                        │
                        ├── frontend/
                        │   ├── index.html
                        │   ├── login.html
                        │   ├── dashboard.html
                        │   ├── process.html
                        │   ├── chat.html
                        │   ├── profile.html
                        │   ├── css/
                        │   ├── js/
                        │   └── images/
                        │
                        ├── backend/
                        │   ├── app.py
                        │   ├── routes/
                        │   ├── models/
                        │   ├── services/
                        │   ├── database/
                        │   ├── seed_data/
                        │   └── uploads/
                        │
                        ├── chroma_db/
                        │
                        ├── requirements.txt
                        ├── Dockerfile
                        ├── README.md
                        └── .env.example

                      🛠️ Technologies Used
                    Technology	Purpose
                    HTML5	User Interface Structure
                    CSS3	Responsive Styling
                    JavaScript	Frontend Interactivity
                    Python	Backend Programming
                    Flask	REST API Development
                    MongoDB	Store Users & Process Data
                    ChromaDB	Vector Database for RAG
                    Google Gemini API	AI-powered Responses
                    render Deployment
                       deployment Link :https://pathpilotai-5-clkx.onrender.com
                     🚀 Quick Start
            git clone https://github.com/yourusername/PathPilot-AI.git
            cd PathPilot-AI
            pip install -r requirements.txt
            python app.py

      py
      💬 Example Query

      User

    What documents are required for Passport Application?

    PathPilot AI

    Required Documents:

       Aadhaar Card
       Address Proof
       Date of Birth Proof
       Passport-size Photograph
       Additional documents based on applicant category

      🌟 Future Enhancements
         Voice-based AI Assistant
         OCR for Document Verification
         Multilingual Support
         Appointment Tracking
         Process Status Notifications

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/f9982921-ec08-4554-a13f-5a20dd96e263" />
