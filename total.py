import os
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import pandas as pd
from groq import Groq
# Initialize Pinecone
pc = Pinecone(api_key="pcsk_6E9B6o_DHFJaybC7zzr4QT9i1tZo1vExTxji5j1syULud17p1HXAzrZPN7Zv4fs9H83L98")  # Replace with your Pinecone API key

index_name = "nyd"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=384,  # Adjust based on your embedding dimension
        metric='cosine',  # Use cosine similarity
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )
index = pc.Index(index_name)
print(f"Connected to index: {index_name}")


# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')


# Function to retrieve answers and metadata from Pinecone
def retrieve_answer(input_question, top_k=1):
    query_embedding = model.encode(input_question, convert_to_numpy=True)
    result = index.query(
        vector=query_embedding.tolist(),
        top_k=top_k,
        include_metadata=True
    )
    answers = []
    for match in result['matches']:
        metadata = match['metadata']
        answers.append({
            "score": match['score'],
            "answer": metadata['answer'],
            "chapter": metadata.get('chapter', 'N/A'),
            "verse": metadata.get('verse', 'N/A'),
            "sanskrit": metadata.get('sanskrit', 'N/A')
        })
    return answers


# Initialize Groq client for Llama
client = Groq(api_key="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")  # Replace with your Groq API key

def answer_query_from_llama(query):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"You are an assistant specialized in answering questions strictly based on the Bhagavad Gita and Patanjali Yoga Sutra. Provide the chapter, verse, Sanskrit text, and a detailed answer to the following question: {query}."
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content

# Llama Query Refinement
def refine_query_with_llama(query, retrieved_info):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"You are an assistant specializing in refining queries for better retrieval. "
                           f"Original query: '{query}'\n"
                           f"Retrieved information:\n{retrieved_info}\n"
                           "Refine the query to include specific details for improved results. "
                           "If the query is already precise, return it unchanged. Refined query:"
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content.strip()

# Llama Final Response Generation
def generate_final_response_with_llama(query, retrieved_info, llm_retrieved):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"You are an expert at combining information to generate detailed answers. "
                           f"Original query: '{query}'\n"
                           f"Retrieved information from semantic search:\n{retrieved_info}\n"
                           f"Retrieved information from Llama:\n{llm_retrieved}\n"
                            "Provide chapter, verse, sanskrit, traslation if the query is directly belongs to sanskrit\n"
                            "Don't say how you process this context in the answer"
                            "Using all the provided context, generate a complete, accurate, and concise answer."
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content.strip()

def main_total(a):
    # Main workflow
    # user_query = input("Enter your query: ")
    user_query=a
    # Step 1: Retrieve answer from Pinecone
    semantic_results = retrieve_answer(user_query, top_k=3)

    retrieved_info = "\n".join([
        f"Score: {item['score']}, Answer: {item['answer']}, Chapter: {item['chapter']}, Verse: {item['verse']}, Sanskrit: {item['sanskrit']}"
        for item in semantic_results
    ])

    # Step 2: Retrieve answer from Llama
    llm_result = answer_query_from_llama(user_query)

    # Step 3: Refine the query with Llama
    refined_query = refine_query_with_llama(user_query, retrieved_info)

    # Step 4: Generate final response using Llama
    final_response = generate_final_response_with_llama(refined_query, retrieved_info, llm_result)

    # Display the results
    print("=====================================================")
    print(f"Refined Query: {refined_query}")
    print("-----------------------------------------------------")
    print(f"Final Response:\n{final_response}")
    print("=====================================================")
    return final_response

# main_total()