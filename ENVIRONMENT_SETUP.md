# Environment Setup Instructions

## 🔒 Setting up Environment Variables

This project uses environment variables to securely store API keys and sensitive configuration. Follow these steps to set up your local environment:

### 1. Create Environment Files

Copy the example files and add your actual values:

```bash
# For the main application
cp .env.example .env

# For the backend
cp backend/.env.example backend/.env
```

### 2. Add Your API Keys

Edit the `.env` files and replace the placeholder values with your actual credentials:

#### Required Variables:

- **ASTRA_DB_TOKEN**: Your DataStax Astra DB token
- **ASTRA_DB_ENDPOINT**: Your DataStax Astra DB endpoint URL
- **COLLECTION_NAME**: Your vector collection name (default: "doc")

#### Optional Variables:

- **HUGGINGFACE_API_TOKEN**: For HuggingFace Inference API (if needed)
- **REACT_APP_API_BASE_URL**: Backend API URL (default: http://localhost:8000)

### 3. Install Dependencies

For Python dependencies:
```bash
pip install python-dotenv
```

### 4. Security Notes

- ⚠️ **Never commit `.env` files to git**
- ✅ The `.gitignore` file is configured to exclude `.env` files
- ✅ Only commit `.env.example` files with placeholder values
- 🔒 Keep your API keys secure and never share them publicly

### 5. Getting Your DataStax Credentials

1. Go to [DataStax Astra](https://astra.datastax.com/)
2. Create a database or use an existing one
3. Generate an Application Token
4. Copy the token and endpoint URL to your `.env` file

## 🚀 Running the Application

Once your environment is set up:

```bash
# Backend (if using Flask)
cd backend
python app.py

# Frontend (React)
npm install
npm run dev

# Streamlit (if using)
streamlit run app.py
```
