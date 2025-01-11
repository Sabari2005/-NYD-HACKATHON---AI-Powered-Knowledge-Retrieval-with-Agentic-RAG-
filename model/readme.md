## NYD HACKATHON CHALLENGE

## Table of contents

- [Overview](#overview)
- [Architecture Diagram](#my-process)
- [About RAG Implmentation](#about-rag-implementation)
- [Built with](#built-with)
- [Installation](#installation)
- [Project structure](#structure)
- [Result Analysis](#resultanalysis)
- [Feature](#features)
- [Author](#author)


## Overview
- This is a solution to the [The NYD Hackathon](https://unstop.com/hackathons/the-nyd-hackathon-2025-the-yoga-vivek-group-1281825). 

- Our goal was to create a Retrieval-Augmented Generation (RAG) system capable of answering user queries based on the Bhagavad Gita and Patanjali Yoga Sutra datasets. The system integrates advanced AI technologies for efficient information retrieval and response generation.

## Architecture Diagram
 ### RAG Pipeline

<img src="./assets/img/architecture.png">




## About RAG Pipeline Implementation



## Built with

- ### Frontend:
  - HTML, CSS, JS

- ### Backend:
  - FastAPI
  - Python
  - spaCy/NLTK

- ### Libraries
  - `numpy`, `pandas` for data handling
  - `uvicorn` for FastAPI
  - `PyTorch` For loading, fine-tuning, and deploying the Llama
3.2 models (text and vision)

## Installation

### Prerequirements
  - `python3.11`

### Installation steps

  ```
    git clone https://github.com/Sabari2005/Hackthon_NYD.git
    cd Hackthon_NYD
  ```
  ```
    pip install -r requirements.txt
  ```

  - Execute each commands in a seperate terminal

  ```
  python app.py
  python model_api_endpoint.py

  ```
  - Open ` http://127.0.0.1:8000` in your browser
  
  - **Login Credentials**

  ```
  E-Mail: codeblenders@gmail.com
  Password: codeblenders
  ``` 

  - To run the model seperately

  ```
    python model.py
  ``` 


## Project structure

```
├──          
├── static
│   ├── css 
│   │   ├── index.css      
│   │   ├── login.css
│   │   └── signup.css 
│   ├─js
│   │   ├── index.js      
│   │   ├── login.js
│   │   └── signup.js 
│   └── images                 
├── templates
│   ├── index.html      
│   ├── login.html
│   └── signup.html           
├── app.py   
├── model_api_endpoint.py
├── model.py
├── ollama_highend.ipynb
├── combined_file.csv                           
├── requirements.txt           
└── README.md                  
```
## Result Analysis

- ### Crowd Counting 
    ![](assets/img/f1.jpg) 
    ![](assets/img/p_curve.jpg)


## Features
 ### Introducing **NEGOTIO AI** 
    
  - Get expert guidance powered by AI Negotio specializing in Yoga Bhagavad Gita, and Negotiation. Know your sologa that suits your needs and start your conversation with ease.

  ### Website Overview
<img src="./assets/login.png">
<img src="./assets/main_page.png">
<img src="./assets/content1.png">
<img src="./assets/content2.png">


## Demo 

- Click [here](./assets/videos/demo.mp4) to see the demo video


## Author

- Sabari Vadivelan S (Team Leader) - Contact Gmail [sabari132005@gmail.com]()
- Uvarajan D (Member 2)

