const sidePanel = document.getElementById("side");
const mainPanel = document.getElementById("main-content");
const openSideBtn = document.getElementById("openside-btn");
const closeSideBtn = document.getElementById("closeside-btn");
const totalSubmit=document.getElementById("submit");
const introTemplate=document.getElementById("intro-template");
const msgContain=document.getElementById("msg-contain");
const textField = document.getElementById("sendText");
const chatContentDisplay=document.getElementById("chat-content-display");
const navBar=document.getElementById("nav");
const resetUiButton=document.getElementById("nav");
const generalPanel=document.getElementById("general-call");
const voicePanel=document.getElementById("voice-call");
const aboutPanel=document.getElementById("about-call");
const contactUsPanel=document.getElementById("contact_us-call");
const titles=document.getElementById("titles");
const new_chat=document.getElementById("new_chat");
let entered=0;
let chat_id = 1;
openSideBtn.addEventListener("click", () => {
    console.log("openside");
    mainPanel.style.width="80%";
    openSideBtn.style.display = "none";
    closeSideBtn.style.display = "block";
});
closeSideBtn.addEventListener("click", () => {
    console.log("closebtn");
    mainPanel.style.width="100%";
    sidePanel.style.zIndex=0;
    openSideBtn.style.display = "block";
    closeSideBtn.style.display = "none";
});
document.addEventListener('DOMContentLoaded', () => {
    // createNewChat();
    const tools = document.querySelectorAll('.tool-name');
    const sections = document.querySelectorAll('.content-section');
    const backgroundIndicator = document.querySelector('.background-indicator');

    if (tools.length > 0) {
        tools[0].classList.add('selected');
        activateSection('general');
        moveBackground(tools[0]);
    }

    tools.forEach(tool => {
        tool.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            
            // Switch active tool
            tools.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');

            // Switch active section
            activateSection(targetSection);

            // Animate background indicator
            moveBackground(this);
        });
    });
    function activateSection(targetSection) {
        sections.forEach(section => {
            if (section.dataset.section === targetSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    function moveBackground(target) {
        const rect = target.getBoundingClientRect();
        const parentRect = target.parentElement.getBoundingClientRect();
        const leftOffset = rect.left - parentRect.left;
        backgroundIndicator.style.transform = `translateX(${leftOffset}px)`;
        backgroundIndicator.style.width = `${rect.width}px`;
    }

});


function addTemplate(chat_id) {
    console.log(`Attempting to create template for chat_id: ${chat_id}`);
    
    // Check if an element with the same chat_id is already present
    const existingTemplate = Array.from(titles.children).find((child) => {
        const span = child.querySelector("span");
        return span && span.textContent === String(chat_id);
    });

    if (existingTemplate) {
        console.log(`Template for chat_id ${chat_id} already exists. Skipping creation.`);
        return;
    }

    console.log(`Creating template for chat_id: ${chat_id}`);
    const titleTemplate = document.createElement("div");
    titleTemplate.classList.add("title-template");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-first");

    const titleDivImg = document.createElement("img");
    titleDivImg.src = "../static/img/msg.png";

    const titleAtag = document.createElement("a");
    titleAtag.href = `#${chat_id}`;
    const titleDivSpan = document.createElement("span");
    titleDivSpan.textContent = chat_id;

    titleAtag.appendChild(titleDivSpan);

    titleDiv.appendChild(titleDivImg);
    titleDiv.appendChild(titleAtag);

    const titleBtn = document.createElement("button");
    const titleBtnImg = document.createElement("img");
    titleBtnImg.src = "../static/img/dots.png";
    titleBtn.appendChild(titleBtnImg);

    titleTemplate.appendChild(titleDiv);
    titleTemplate.appendChild(titleBtn);

    // Add an onclick event to the template for fetching chat messages
    titleTemplate.onclick = () => {
        console.log(`Clicked on template for chat_id: ${chat_id}`);
         // Update the global chat_id
        getChatMessages(chat_id); // Fetch and display messages for this chat
    };

    titles.append(titleTemplate);
    console.log(`Template for chat_id ${chat_id} successfully added.`);
}

//////////////////////////////////////////////////////////



new_chat.addEventListener("click", async () => {
    console.log("Creating new chat...");
    chat_id = await createNewChat();
    if (chat_id) {
        console.log("New chat created with ID:", chat_id);
        console.log("Now you can send messages to the new chat.");

    } else {
        console.error("Failed to create new chat.");
    }
});




// async function sendTemplateText(a) {
//     // const text = document.getElementById("sendText").value;
//     entered=1;
//     const text=a;
//     console.log(text);
//     console.log(a);
//     // Prepare the data to send
//     // const data = { text: text };

//     //    // Send the data to the FastAPI server using a POST request
//     // const response = await fetch("http://127.0.0.1:8000/send-text/", {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify(data),
//     // });
//     introTemplate.style.display="none";
//     msgContain.style.display="flex";
//     textField.value=a;
//     sendText();
//     // // Get the response and display it
//     // const result = await response.json();
//     // console.log(result);
//     // document.getElementById("response").textContent = result.message;
// }
// async function sendText() {
//     entered = 1;
//     const text = textField.value.trim(); // Trim whitespace
//     const msgContain = document.getElementById("msg-contain");

//     if (text === "") {
//         alert("Please enter a message before sending.");
//         return;
//     }

//     // Adjust UI elements for the chat interface
//     if (introTemplate.style.display !== "none") {
//         introTemplate.style.display = "none";
//         msgContain.style.display = "flex";
//     }

//     if (chatContentDisplay.style.marginTop !== "30px") {
//         chatContentDisplay.style.marginTop = "30px";
//     }

//     if (window.getComputedStyle(navBar).top === "30px") {
//         console.log("Navbar shrunk");
//         navBar.style.top = "10px";
//     }

//     console.log("Sending text:", text);

//     // Create and append the "send" message div
//     const sendDiv = document.createElement("div");
//     sendDiv.classList.add("send");
//     sendDiv.innerHTML = `
//         <span>${text}</span>
//         <img src="../static/img/user.png" alt="User">
//     `;
//     msgContain.appendChild(sendDiv);
//     textField.value = "";

//     // Create and append the "receive" div with loading animation
//     const receiveDiv = document.createElement("div");
//     receiveDiv.classList.add("receive");
//     receiveDiv.innerHTML = `
//         <img src="../static/img/spark.png">
//         <div class="loading_contain fade-out">
//             <div class="loading"></div>
//             <div class="loading" style="width: 100px;"></div>
//         </div>
//     `;
//     msgContain.appendChild(receiveDiv);
//     msgContain.scrollTo({
//         top: msgContain.scrollHeight,
//         behavior: "smooth",
//     });
//     const loadingContainer = receiveDiv.querySelector(".loading_contain");

//     // Enable animation for the image
//     const receiveImg = receiveDiv.querySelector("img");
//     receiveImg.classList.add("pop");

//     try {
//         const response = await fetch("http://127.0.0.2:8001/send-text", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ text }),
//         });

//         if (!response.ok) {
//             introTemplate.style.display = "flex";
//             msgContain.style.display = "none";
//             chatContentDisplay.style.marginTop = "0px";
//             navBar.style.top = "30px";
//             msgContain.innerHTML = "";
//             alert("Failed to send message to the server.");
//             return;
//         }

//         const result = await response.json();
//         console.log("Server response:", result);

//         // Add fade-out class to loading container
//         loadingContainer.classList.add("hidden");
//         receiveImg.style.animation = "none";

//         setTimeout(() => {
//             // Replace loading with the server response text
//             loadingContainer.remove();

//             const divReceive = document.createElement("div");
//             divReceive.classList.add("receive_div");

//             const answerText = document.createElement("span");
//             answerText.classList.add("fade-in");
//             answerText.innerHTML = formatTextWithGaps(result.content);
//             divReceive.appendChild(answerText);

//             receiveDiv.appendChild(divReceive);

//             // Add title template
//             const titleTemplate = document.createElement("div");
//             titleTemplate.classList.add("title-template");

//             const titleDiv = document.createElement("div");
//             titleDiv.classList.add("title-first");

//             const titleDivImg = document.createElement("img");
//             titleDivImg.src = "../static/img/msg.png";

//             const titleDivSpan = document.createElement("span");
//             titleDivSpan.textContent = result.title;

//             titleDiv.appendChild(titleDivImg);
//             titleDiv.appendChild(titleDivSpan);

//             const titleBtn = document.createElement("button");
//             const titleBtnImg = document.createElement("img");
//             titleBtnImg.src = "../static/img/dots.png";
//             titleBtn.appendChild(titleBtnImg);

//             titleTemplate.appendChild(titleDiv);
//             titleTemplate.appendChild(titleBtn);

//             titles.append(titleTemplate);

//             setTimeout(() => {
//                 answerText.classList.add("visible");
//                 msgContain.scrollTo({
//                     top: msgContain.scrollHeight,
//                     behavior: "smooth",
//                 });
//             }, 0);
//         }, 500);

//         // Scroll to the bottom of the message container
//         msgContain.scrollTo({
//             top: msgContain.scrollHeight,
//             behavior: "smooth",
//         });

//     } catch (error) {
//         console.error("Error sending message:", error);
//         introTemplate.style.display = "flex";
//         msgContain.style.display = "none";
//         msgContain.innerHTML = "";
//         chatContentDisplay.style.marginTop = "0px";
//         navBar.style.top = "30px";
//         entered = 0;
//         alert("Failed to send your message. Please try again later.");
//     }
// }

/////////////////////////////////////
// original code do not delete
// /**
//  * Adds two-line gaps before Sanskrit or Hindi text and renders **words** as bold.
//  * @param {string} text - The input text to format.
//  * @returns {string} The formatted text with gaps and bold words.
//  */
// function formatTextWithGaps(text) {
//     const devanagariRegex = /[\u0900-\u097F]/; // Matches Devanagari script characters
//     const boldRegex = /\*\*(.+?)\*\*/g; // Matches words enclosed with ** (e.g., **word**)
//     const lines = text.split("\n");

//     let formattedText = "";
//     let isSanskritBlock = false;

//     lines.forEach((line, index) => {
//         const trimmedLine = line.trim(); // Remove unnecessary whitespace
//         if (!trimmedLine) return; // Skip empty lines

//         // Replace **words** with <b>word</b>
//         const lineWithBold = trimmedLine.replace(boldRegex, "<b>$1</b>");

//         const isDevanagariLine = devanagariRegex.test(lineWithBold);

//         if (isDevanagariLine) {
//             if (!isSanskritBlock) {
//                 // Start a new Sanskrit block with <div> instead of <span>
//                 formattedText += `<div id="sanskrit">`;
//                 isSanskritBlock = true;
//             }
//             formattedText += lineWithBold; // Add the line to the Sanskrit block
//         } else {
//             if (isSanskritBlock) {
//                 // Close the Sanskrit block when non-Sanskrit text is encountered
//                 formattedText += `</div>`;
//                 isSanskritBlock = false;
//             }
//             // Add the non-Sanskrit line
//             formattedText += `<span>${lineWithBold}</span>`;
//         }

//         // Add a line break unless it's the last line
//         if (index < lines.length - 1) {
//             formattedText += "<br>";
//         }
//     });

//     // Close any open Sanskrit block at the end
//     if (isSanskritBlock) {
//         formattedText += `</div>`;
//     }

//     return formattedText;
// }

// //////////////////////////////////////////


/**
 * Adds two-line gaps before text in any non-English language and renders **words** as bold.
 * @param {string} text - The input text to format.
 * @returns {string} The formatted text with gaps and bold words.
 */
function formatTextWithGaps(text) {
    const nonEnglishRegex = /[^\u0000-\u007F]/; // Matches any non-ASCII character
    const boldRegex = /\*\*(.+?)\*\*/g; // Matches words enclosed with ** (e.g., **word**)
    const lines = text.split("\n");

    let formattedText = "";
    let isNonEnglishBlock = false;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim(); // Remove unnecessary whitespace
        if (!trimmedLine) return; // Skip empty lines

        // Replace **words** with <b>word</b>
        const lineWithBold = trimmedLine.replace(boldRegex, "<b>$1</b>");

        const isNonEnglishLine = nonEnglishRegex.test(lineWithBold);

        if (isNonEnglishLine) {
            if (!isNonEnglishBlock) {
                // Start a new non-English block with <div> instead of <span>
                formattedText += `<div id="sanskrit">`;
                isNonEnglishBlock = true;
            }
            formattedText += lineWithBold; // Add the line to the non-English block
        } else {
            if (isNonEnglishBlock) {
                // Close the non-English block when English text is encountered
                formattedText += `</div>`;
                isNonEnglishBlock = false;
            }
            // Add the English line
            formattedText += `<span>${lineWithBold}</span>`;
        }

        // Add a line break unless it's the last line
        if (index < lines.length - 1) {
            formattedText += "<br>";
        }
    });

    // Close any open non-English block at the end
    if (isNonEnglishBlock) {
        formattedText += `</div>`;
    }

    return formattedText;
}
 // Declare chat_id and initialize to null

// Event listener for creating a new chat

async function createNewChat() {
    console.log("new_chat");
    resetui();
    introDefault();
    try {
        const response = await fetch('http://127.0.0.1:8000/new_chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            console.log('New Chat Created:', data.chat_id);
            
            return data.chat_id; // Return chat_id to the caller
        } 
    } catch (error) {
        console.error('Error:', error);
        
    }
}




async function sendMessage(chat_id, question) {
    const message = { question: question };
    addTemplate(chat_id);
    try {
        const response = await fetch(`http://127.0.0.1:8000/add_message/${chat_id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Message added successfully');
            // Retrieve messages after sending a message
            getChatMessages(chat_id);
        } else {
            console.error('Error adding message:', data.detail);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}




async function getChatMessages(chat_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/get_chat_messages/${chat_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Messages for chat:', chat_id);
            // console.log(data.messages); // This contains the messages array
            // You can now display these messages on the page
            displayMessages(data.messages);
        } else {
            console.error('Error retrieving messages:', data.detail);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayMessages(messages) {
    console.log(messages); // Log the messages array for debugging

    // Hide the intro template and display the message container
    introTemplate.style.display = "none";
    chatContentDisplay.style.marginTop="30px";
    navBar.style.top = "10px";
    msgContain.style.display = "flex";

    // Clear previous messages
    msgContain.innerHTML = "";

    // Iterate over the messages array and format each message
    messages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Customize the display based on your message object structure
        messageDiv.innerHTML = `
            <p><strong>Question:</strong> ${message.question}</p>
            <p><strong>Answer:</strong> ${message.answer}</p>
        `;

        // Append the formatted message to the container
        msgContain.appendChild(messageDiv);
        window.chat_id = chat_id;
    });
}
textField.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const text = textField.value.trim();
        console.log(`before send msg chat_id=${chat_id}`);
        
        if (chat_id > 0) {
            sendMessage(chat_id, text);
        } else {
            console.log("No active chat. Creating a new chat...");
            const newChatId = await createNewChat(); // Create a new chat
            if (newChatId) {
                window.chat_id = newChatId; // Update global chat_id
                sendMessage(chat_id, text);
            } else {
                console.error("Failed to create a new chat.");
            }
        }
    }
});




totalSubmit.addEventListener("click", () => {
    console.log("Submit clicked");
    const text = textField.value.trim();
    if (chat_id) {
        sendMessage(chat_id, text);
    } else {
        console.error("No active chat. Please create a new chat first.");
    }
});

function introDefault(){
    introTemplate.style.display="flex";
    msgContain.style.display="none";
    msgContain.innerHTML="";
    chatContentDisplay.style.marginTop="0px";
}
function resetui() {
    console.log("reseted");
    console.log("nav shrinked");
    navBar.style.top = "30px";
    first=0;
    // introTemplate.style.display = "flex";
    // msgContain.style.display = "none";/
    // msgContain.innerHTML = ""; // Clears the message container
    // chatContentDisplay.style.marginTop = "0px"; // Resets chat content margin
    // navBar.style.top = "30px"; // Adjusts the navbar position
}
generalPanel.addEventListener("click",()=>{
    console.log("general");
    // if(entered===1){
        // if (chatContentDisplay.style.marginTop == "30px") {
            if (navBar.style.top === "30px") {
                console.log("nav shrinked");
                navBar.style.top = "10px";
            }
        // }
    // }
    
});
voicePanel.addEventListener("click",()=>{
    console.log("voice");
    resetui();
});
aboutPanel.addEventListener("click",()=>{
    console.log("about");
    resetui();
});
contactUsPanel.addEventListener("click",()=>{
    console.log("contactus");
    resetui();
});
// Get references to DOM elements
const voiceButton = document.getElementById("voice");
const micIcon = document.getElementById("micIcon");

// Initialize Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Set Speech Recognition properties
recognition.lang = "en-US"; // Set language
recognition.continuous = true; // Continue listening for speech

let isListening = false; // Track listening state

// Event when the button is clicked
voiceButton.addEventListener("click", () => {
    if (!isListening) {
        // Start listening
        recognition.start();
        isListening = true;

        // Change icon to "stop mic"
        micIcon.src = "../static/img/stopmic.png";
    } else {
        // Stop listening
        recognition.stop();
        isListening = false;

        // Change icon back to "mic"
        micIcon.src = "../static/img/mic.png";
    }
});

// Capture speech and write to input field
recognition.onresult = (event) => {
    let transcript = ""; // To hold the recognized text
    for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript; // Append each result
    }

    // Write the recognized speech to the input field
    textField.value = transcript;
};

// Handle errors
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    recognition.stop();
    isListening = false;
    micIcon.src = "../static/img/mic.png"; // Reset icon
};
// createNewChat();
// Ensure 'resetUi' is properly selected from the DOM
// const resetUiButton = document.getElementById("resetUi"); // Replace with the actual ID

