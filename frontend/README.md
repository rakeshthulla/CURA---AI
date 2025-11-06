
# CURA AI – Intelligent Medical Chatbot

CURA AI is a Retrieval-Augmented Generation (RAG)-based medical chatbot designed to provide accurate, verified, and user-friendly medical information for both patients and doctors.  
It integrates FAISS retrieval, Mistral 7B language generation, and verified medical datasets (MIRIAD + Indian datasets) to ensure factual, grounded, and context-specific responses.

---

## Project Overview

### Objective
To build a highly accurate medical chatbot that provides verified, reliable information to both patients and doctors using a Retrieval-Augmented Generation (RAG) model.  
The system ensures that answers are generated only from expert-verified datasets.

---

## Project Workflow

### 1. Data Curation and Quality Control
- **Sources:** Medical research papers, government-approved datasets, and Indian medical institutions (e.g., AIIMS).  
- **Processing:** Text is converted into Question–Answer pairs.  
- **Quality Control:**  
  - Automated filtering removes low-quality or nonsensical Q&As.  
  - Expert verification by doctors ensures medical accuracy.  
- **Final Output:** Verified dataset of 3100 Indian Q&As combined with the MIRIAD dataset.

---

### 2. RAG Model (Core Engine)

#### Retrieval Step (FAISS)
- Query Embedding:  E<sub>q</sub> ∈ R<sup>d</sup>  
- Document Embedding:  E<sub>i</sub> ∈ R<sup>d</sup>  
- Cosine Similarity:  
  sim(E<sub>q</sub>, E<sub>i</sub>) = (E<sub>q</sub> · E<sub>i</sub>) / (‖E<sub>q</sub>‖ × ‖E<sub>i</sub>‖)  
- Top-K Context Selection:  
  C<sub>k</sub> = argmax<sub>k</sub>[sim(E<sub>q</sub>, E<sub>i</sub>)]  

#### Generation Step (Mistral 7B)
R = f(E<sub>q</sub>, C<sub>k</sub>)  
where f = Transformer (Mistral 7B)

---

## System Architecture

### Frontend
- Built using **React.js**
- Features two modes:
  - **Doctor Mode:** Uses technical medical terminology.
  - **Patient Mode:** Simplified explanations for general users.
- Includes **CURA Atlas Visualization** (implemented using JavaScript Gaussian distribution for non-overlapping data visualization).

### Backend
- Developed using **Node.js / Express** with **Flask API integration** for model handling.
- Implements **JWT Authentication** for secure user access.
- Integrates **RAG Engine** (FAISS retrieval + Mistral 7B generation).
- Stores user data, chat history, and tokens in **MongoDB**.

---

## Technology Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js |
| Backend | Node.js / Flask |
| Model | Mistral 7B |
| Retrieval | FAISS |
| Database | MongoDB |
| Visualization | JavaScript + Gaussian Distribution |
| Authentication | JWT Tokens |
| Dataset | MIRIAD + Indian Verified Q&A Dataset |

---

## Mathematical Foundation

| Component | Core Concept | Formula |
|------------|---------------|----------|
| FAISS | Cosine Similarity | sim(E<sub>q</sub>, E<sub>i</sub>) = (E<sub>q</sub> · E<sub>i</sub>) / (‖E<sub>q</sub>‖ × ‖E<sub>i</sub>‖) |
| RAG | Joint Probability | P(y|x) = Σ<sub>z</sub> P(y|x,z) × P(z|x) |
| Mistral 7B | Transformer Generation | R = f(E<sub>q</sub>, C<sub>k</sub>) |
| JWT | Cryptographic Hashing | HMAC-SHA256(Signature) |

---

## Key Features

- Verified dataset combining global (MIRIAD) and Indian medical data.  
- Separate answer modes for patients and doctors.  
- RAG architecture ensures grounded, factual responses.  
- Secure authentication using JWT tokens.  
- Interactive visualization of medical insights using Gaussian clustering.  

---

## How to Run the Project

### Prerequisites
- Node.js (v16 or above)
- npm or yarn
- MongoDB Atlas connection string
- Python 3 (for Flask backend, if used)
- FAISS and Mistral 7B model (connected via backend API)


### Backend Setup
1. Navigate to the backend folder:
   cd backend

2. Install dependencies:
   npm install
   
3. Create a `.env` file in the backend folder and add:


   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_ORIGIN=http://localhost:3000

4. Start the backend server:

 
   npm start
 

   The backend runs on **[http://localhost:5000](http://localhost:5000)**



### Frontend Setup

1. Navigate to the frontend folder:
   cd frontend
  
2. Install dependencies:
   npm install
  
3. Start the frontend server:
   npm start

   The frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## Requirements

### Node.js Dependencies

Listed in `backend/package.json`
express
cors
dotenv
mongoose
jsonwebtoken

### Python/Flask Dependencies

If your backend uses Flask API for model integration, create a `requirements.txt`:
Flask==2.3.3
Flask-Cors==3.0.10
requests==2.31.0
faiss-cpu==1.7.4
torch==2.1.0
transformers==4.33.0


---

## Outputs

* Interactive chatbot interface for patients and doctors.
* Verified, dataset-grounded responses.
* Visualization of medical knowledge clusters using Gaussian distribution.
* Secure login and token management for user sessions.

---

## Improvements Over Base Paper (MIRIAD)

| Base Paper (MIRIAD)                 | CURA AI Improvements                                      |
| ----------------------------------- | --------------------------------------------------------- |
| Used only American medical datasets | Added Indian medical datasets (3100 verified Q&As)        |
| No model implementation shown       | Implemented RAG with FAISS + Mistral 7B                   |
| Only data repository (Atlas)        | Added full chatbot system + frontend                      |
| No user interface                   | Built React-based interface with Doctor/Patient modes     |
| No visualization                    | Introduced CURA Atlas visualization (JavaScript Gaussian) |


---

## License

This project is for educational and research purposes.
Data used is verified and publicly accessible under institutional or open medical datasets.





