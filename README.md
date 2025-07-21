# RAG Chat Application

## Made by Team Sharanga

**Team Member 1:**
- Name: Suraj Harlekar
- Graduating Year: 2027
- College: Indian Institute of Information Technology Kottayam

**Team Member 2:**
- Name: Amruth Ayaan
- Graduating Year: 2027
- College: Indian Institute of Information Technology Kottayam

## Application Overview

This is a modern Retrieval-Augmented Generation (RAG) application with a Claude.ai-inspired interface. The application allows users to upload documents, process them into vector embeddings, and chat with an AI that has access to the uploaded knowledge base.

### Features

- **Modern Chat Interface**: Claude.ai-style three-panel layout with sidebar, chat area, and context panel
- **File Upload & Processing**: Support for PDF, TXT, and JSON files with automatic text extraction and chunking
- **Vector Search**: Semantic search using DataStax Astra DB vector store with E5-Large-V2 embeddings
- **RAG Implementation**: Context-aware responses using retrieved relevant document chunks
- **Dark/Light Mode**: Toggle between beautiful light and dark themes
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Real-time Chat**: Streaming responses with typewriter effects
- **Session Management**: Persistent chat history and session management

### How to Run

1. **Prerequisites**: Ensure you have Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

2. **Clone and Install**:
   ```sh
   # Clone the repository
   git clone <YOUR_GIT_URL>
   
   # Navigate to project directory
   cd <YOUR_PROJECT_NAME>
   
   # Install dependencies
   npm install
   ```

3. **Start Development Server**:
   ```sh
   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`
   - The application will be running with hot-reload enabled

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (Build tool and dev server)
- Tailwind CSS (Styling)
- shadcn/ui (UI Components)
- React Router (Routing)
- TanStack Query (Data fetching)
- Lucide React (Icons)
- Next Themes (Dark/Light mode)

**Backend Integration Ready:**
- FastAPI (Python backend)
- DataStax Astra DB (Vector database)
- Hugging Face Transformers (LLM integration)
- E5-Large-V2 (Text embeddings)
- PyMuPDF (PDF processing)

**Development Tools:**
- TypeScript (Type safety)
- ESLint (Code linting)
- Class Variance Authority (Component variants)
- React Hook Form (Form handling)

---

*Made by Amruth and Suraj*
