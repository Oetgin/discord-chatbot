from langchain_community.vectorstores import faiss
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.document_loaders import WebBaseLoader
import os

VECTOR_STORE_PATH = "data/vectorDB"

# Load the embeddings
embeddings = OllamaEmbeddings()

# Load the vector store
try :
    vector_store = faiss.FAISS.load_local(VECTOR_STORE_PATH, embeddings)
except:
    vector_store = faiss.FAISS.from_texts(["You are an IA assistant"], embeddings)

# Load the text splitter
text_splitter = CharacterTextSplitter()

def addDocs(documents: list[Document]):
    return vector_store.add_documents(documents)

def add(string:str):
    strings = text_splitter.split_text(string)
    return vector_store.add_texts(strings)

def addFile(path:str):
    with open(path, "r") as f:
        return add(f.read())
    
def addWebPage(url:str):
    # Load the web page loader
    web_page_loader = WebBaseLoader(url)
    return addDocs(web_page_loader.load(url))

def query(query:str, k:int=1):
    return [doc.page_content for doc in vector_store.similarity_search(query, k=k, fetch_k=k)]

def save():
    return vector_store.save_local(VECTOR_STORE_PATH)

def print_vector_store():
    print("Vector Store:")
    print("  - Embeddings : " + str(vector_store.embeddings))
    print("  - Documents : " + str(vector_store.similarity_search("", k=1000, fetch_k=1000))) 

def delete():
    os.remove(os.path.join(VECTOR_STORE_PATH, "index.faiss"))
    os.remove(os.path.join(VECTOR_STORE_PATH, "index.pkl"))


wtd = input("What to do? (add, query, save, add_and_save, print_db, add_page, add_file, delete, test): ")
if wtd == "add":
    string = input("String: ")
elif wtd == "query":
    q = input("Query: ")
    print(query(q, k=4))
elif wtd == "save":
    save()
elif wtd == "add_and_save":
    string = input("String: ")
    add(string)
    save()
elif wtd == "print_db":
    print_vector_store()
elif wtd == "add_page":
    url = input("URL: ")
    addWebPage(url)
    save()
elif wtd == "add_file":
    path = input("Path: ")
    addFile(path)
    save()
elif wtd == "delete":
    delete()
elif wtd == "test":
    pass