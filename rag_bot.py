from rag_setup import get_qa_chain

def main():
    qa_chain = get_qa_chain()
    
    print("\n🤖 Medical RAG Bot Ready! Type your questions or type 'bye' to quit.")
    while True:
        query = input("\n🧠 Your question: ")
        if query.lower().strip() == "bye":
            print("\n👋 Goodbye! Stay healthy.")
            break

        result = qa_chain.invoke({"query": query})
        print("\n💬 Answer:", result["result"])

if __name__ == "__main__":
    main()
