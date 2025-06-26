import pandas as pd
import os
import pickle
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA

CHROMA_DIR = "chroma_db"
DOC_PKL = "documents.pkl"
CSV_FILE = "data/database.csv"

def load_csv_to_documents():
    df = pd.read_csv(CSV_FILE)
    documents = []
    for _, row in df.iterrows():
        content = " ".join([f"{col}: {row[col]}" for col in df.columns])
        documents.append(Document(page_content=content))
    with open(DOC_PKL, "wb") as f:
        pickle.dump(documents, f)
    print(f"Saved {len(documents)} documents to {DOC_PKL}")
    return documents

def load_documents():
    if os.path.exists(DOC_PKL):
        with open(DOC_PKL, "rb") as f:
            return pickle.load(f)
    else:
        return load_csv_to_documents()

def create_vectorstore(documents):
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(documents, embedding_model, persist_directory=CHROMA_DIR)
    vectorstore.persist()
    print("Vectorstore created and persisted.")
    return vectorstore

def load_vectorstore():
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return Chroma(persist_directory=CHROMA_DIR, embedding_function=embedding_model)

def get_llm():
    return Ollama(model="phi3")  # or "gemma:2b" for lower RAM
def get_qa_chain():
    if not os.path.exists(CHROMA_DIR):
        docs = load_documents()
        vectorstore = create_vectorstore(docs)
    else:
        vectorstore = load_vectorstore()

    retriever = vectorstore.as_retriever()
    llm = get_llm()
    return RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
