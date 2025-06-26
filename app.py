import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS # Import CORS for cross-origin requests
from rag_setup import get_qa_chain # Import your RAG chain setup

app = Flask(__name__, static_folder='.') # Serve static files from the current directory
CORS(app) # Enable CORS for all routes

# Initialize the QA chain when the app starts
# This will load the documents and create/load the vectorstore once
try:
    qa_chain = get_qa_chain()
    print("🤖 Medical RAG Bot backend chain initialized successfully.")
except Exception as e:
    print(f"Error initializing QA chain: {e}")
    qa_chain = None # Set to None if initialization fails

@app.route('/')
def serve_index():
    """Serve the main HTML file."""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve other static files (CSS, JS, etc.)."""
    return send_from_directory('.', filename)

@app.route('/chat', methods=['POST'])
def chat():
    """
    API endpoint for the chatbot.
    Receives user queries and returns bot responses using the RAG chain.
    """
    if not qa_chain:
        return jsonify({"response": "Chatbot backend is not ready. Please check server logs."}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"response": "No message provided."}), 400

    print(f"\n🧠 User question: {user_message}")
    try:
        # Invoke the RAG chain with the user's query
        result = qa_chain.invoke({"query": user_message})
        bot_response = result.get("result", "I couldn't find a relevant answer for that.")
        print(f"💬 Bot answer: {bot_response}")
        return jsonify({"response": bot_response})
    except Exception as e:
        print(f"Error processing chat message: {e}")
        return jsonify({"response": "An error occurred while processing your request. Please try again later."}), 500

if __name__ == '__main__':
    # Ensure the 'data' directory exists for CSV (if your rag_setup expects it)
    if not os.path.exists('data'):
        os.makedirs('data')
        print("Created 'data' directory.")

    # You might want to change the host and port for deployment
    # For local development, host='0.0.0.0' makes it accessible from your network
    # and port=5000 is standard for Flask.
    app.run(host='0.0.0.0', port=5000, debug=True)
