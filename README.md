Swasthya Sarthi - Your Health Companion 🩺💬
Swasthya Sarthi is an intelligent Medical Retrieval Augmented Generation (RAG) Bot designed to provide accurate and relevant answers to health-related queries. It leverages a local knowledge base and a powerful Large Language Model (LLM) to offer quick, reliable, and privacy-focused health information directly through a user-friendly web interface.

✨ Features
Intelligent Q&A: Get precise answers to your medical questions using a RAG architecture.

Local LLM Integration: Powered by Ollama and the phi3 model for privacy and offline capability.

Customizable Knowledge Base: Easily update the bot's medical knowledge by modifying a simple CSV file.

User-Friendly Web Interface: A responsive and intuitive chat interface built with HTML, Tailwind CSS, and JavaScript.

Chat History Management: Clear chat history and download conversations as styled HTML files.

Message Copy Functionality: Right-click on any message to copy its text.

🚀 Getting Started
Follow these steps to get Swasthya Sarthi up and running on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Git: For cloning the repository.

Download Git

Python 3.9+: The backend is built with Python.

Download Python (Make sure to check "Add Python to PATH" during installation)

Ollama: This is crucial for running the local phi3 Large Language Model.

Download Ollama (Install the version for your operating system)

Installation Steps
Clone the Repository:
Open your terminal or command prompt and run:

git clone https://github.com/your-username/swasthya-sarthi.git
cd swasthya-sarthi

Set Up Python Virtual Environment (Recommended):
It's good practice to create a virtual environment to manage project dependencies.

python -m venv venv

On Windows:

.\venv\Scripts\activate

On macOS/Linux:

source venv/bin/activate

Install Python Dependencies:
With your virtual environment activated, install the required Python packages:

pip install -r requirements.txt

(If requirements.txt is not provided, you will need to create one. Based on app.py and rag_setup.py, the key libraries are flask, flask-cors, pandas, langchain, langchain-core, langchain-community, ollama.)

If requirements.txt is missing, create it manually:
Create a file named requirements.txt in the root directory of your project with the following content:

flask
flask-cors
pandas
langchain
langchain-core
langchain-community
ollama
sentence-transformers
chromadb

Then run pip install -r requirements.txt.

Download the LLM Model (phi3) using Ollama:
Open a new terminal or command prompt (separate from where you'll run the Flask app) and ensure Ollama is running in the background. Then, pull the phi3 model:

ollama pull phi3

This might take some time depending on your internet connection as the model file is large.

Prepare the Knowledge Base:
Ensure you have a data directory in your project root, and inside it, a database.csv file. This file contains the medical information your bot will use.

If you don't have data/database.csv, create an empty data folder and an empty database.csv file inside it. The rag_setup.py script expects this structure.

Example database.csv content (for testing):

disease,symptoms,treatment
Common Cold,"Runny nose, sore throat, cough, sneezing","Rest, fluids, over-the-counter cold medicines"
Influenza,"Fever, body aches, fatigue, cough, sore throat","Antiviral drugs, rest, fluids"
Diabetes,"Frequent urination, increased thirst, unexplained weight loss, blurred vision","Insulin therapy, diet control, exercise"
Hypertension,"Often no symptoms, headaches, shortness of breath, nosebleeds (severe)","Medication, lifestyle changes, diet"

The rag_setup.py script will process this CSV to create a vector store.

Running the Application
Start the Flask Backend:
In your first terminal (where your Python virtual environment is activated), navigate to the project root and run the Flask application:

python app.py

You should see output indicating that the Flask app is running, typically on http://0.0.0.0:5000 or http://127.0.0.1:5000. The first run will also initialize the RAG chain and create the chroma_db directory.

Access the Web Interface:
Open your web browser and go to:

http://127.0.0.1:5000/

You should see the Swasthya Sarthi chat interface.

Interact with the Bot:
Type your health questions into the input field and press Enter or click the send button. The bot will retrieve information from your database.csv and generate a response using the phi3 model running via Ollama.

📁 Project Structure
swasthya-sarthi/
├── app.py              # Flask backend application to serve the web UI and handle chat API.
├── rag_setup.py        # Contains logic for setting up the RAG chain, loading documents, and creating/loading the vector store.
├── rag_bot.py          # (Optional) A simple script for testing the RAG bot directly via the terminal.
├── index.html          # The main HTML file for the web-based chat interface.
├── script.js           # JavaScript for frontend interactivity (sending messages, UI updates, chat download).
├── styles.css          # Tailwind CSS customizations and animations for the web interface.
├── data/               # Directory for the medical knowledge base.
│   └── database.csv    # Your CSV file containing medical information.
├── chroma_db/          # (Generated) Directory where the Chroma vector store is persisted.
└── venv/               # (Generated) Python virtual environment.

⚙️ Customization
Updating the Knowledge Base
To update the medical information the bot uses:

Edit the data/database.csv file with your desired medical data. Ensure the CSV format is consistent (e.g., disease,symptoms,treatment).

After modifying database.csv, you will need to delete the chroma_db directory.

Restart the app.py server. The rag_setup.py script will detect that chroma_db is missing and will regenerate the vector store from your updated database.csv.

troubleshooting
"Chatbot backend is not ready" or Connection Errors:

Ensure app.py is running in your terminal and there are no errors in its output.

Verify that Ollama is running in the background and you have successfully pulled the phi3 model (ollama pull phi3).

Check your firewall settings if you are unable to connect to http://127.0.0.1:5000.

"I couldn't find a relevant answer for that.":

This usually means the RAG model couldn't find relevant information in your database.csv for the given query.

Check the content of your database.csv to ensure it contains information related to your questions.

Consider expanding your database.csv with more diverse medical data.

ModuleNotFoundError:

Make sure you have activated your Python virtual environment (venv) and installed all dependencies using pip install -r requirements.txt.

📄 License
This project is open-source and available under the MIT License.
