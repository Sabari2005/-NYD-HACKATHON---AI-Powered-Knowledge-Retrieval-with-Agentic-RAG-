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
window.chat_id = null; // Tracks the current active chat ID
window.set_id = null;  // Tracks the last set chat ID
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




// new_chat.addEventListener("click", async () => {
//     console.log("Creating new chat...");
//     chat_id = await createNewChat();
//     if (chat_id) {
//         console.log("New chat created with ID:", chat_id);
//         console.log("Now you can send messages to the new chat.");

//     } else {
//         console.error("Failed to create new chat.");
//     }
// });
let lastChatId = null; // Store the ID of the last created chat
new_chat.addEventListener("click", async () => {
    console.log("Creating new chat...");
    const lastChatHasContent = await checkLastChatHasContent(lastChatId);

    if (!lastChatId || lastChatHasContent) {
        const chat_id = await createNewChat();
        if (chat_id) {
            console.log("New chat created with ID:", chat_id);
            console.log("Now you can send messages to the new chat.");
            lastChatId = chat_id; // Update lastChatId
        } else {
            console.error("Failed to create new chat.");
        }
    } else {
        console.warn("The last chat is empty. Please add content before creating a new chat.");
    }
});
async function checkLastChatHasContent(chat_id) {
    if (!chat_id) return true; // If there's no last chat, allow new chat creation

    try {
        const response = await fetch(`/get_chat_messages/${chat_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Messages for chat:", chat_id, data.messages);
            return data.messages && data.messages.length > 0; // Check if there are any messages
        } else {
            console.error("Error retrieving messages:", data.detail);
        }
    } catch (error) {
        console.error("Error:", error);
    }

    return false; // Default to false if unable to check
}
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

function displayMessages(messages) {
    console.log(messages); // Log the messages array for debugging

    // Hide the intro template and adjust the layout


    // Clear previous messages
    msgContain.innerHTML = "";
    // introTemplate.style.display="none";

    // Iterate over the messages array and create message elements
    messages.forEach((message) => {
        // Create the send (question) container
        const sendDiv = document.createElement("div");
        sendDiv.classList.add("send");

        const sendSpan = document.createElement("span");
        sendSpan.textContent = message.question; // Add the question text

        const sendImg = document.createElement("img");
        sendImg.src = "../static/img/user.png"; // User image

        sendDiv.appendChild(sendSpan);
        sendDiv.appendChild(sendImg);

        // Create the receive (answer) container
        const receiveDiv = document.createElement("div");
        receiveDiv.classList.add("receive");

        const receiveImg = document.createElement("img");
        receiveImg.src = "../static/img/spark.png"; // Spark image
        receiveImg.style.animationName="none";
        const receiveInnerDiv = document.createElement("div");
        receiveInnerDiv.classList.add("receive_div");

        const receiveSpan = document.createElement("span");
        receiveSpan.innerHTML = formatTextWithGaps(message.answer); // Add the answer text

        receiveInnerDiv.appendChild(receiveSpan);
        receiveDiv.appendChild(receiveImg);
        receiveDiv.appendChild(receiveInnerDiv);

        // Append the send and receive containers to the main container
        msgContain.appendChild(sendDiv);
        msgContain.appendChild(receiveDiv);
    });
    msgContain.scrollTo({
        top: msgContain.scrollHeight,
        behavior: "smooth",
    });
    console.log("Messages displayed successfully.");
}
// function addTemplate(chat_id,question) {
//     console.log(`Attempting to create template for chat_id: ${chat_id}`);

//     // Check if an element with the same chat_id is already present
//     const existingTemplate = Array.from(titles.children).find((child) => {
//         return child.getAttribute("data-chat-id") === String(chat_id); // Compare chat_id
//     });

//     if (existingTemplate) {
//         console.log(`Template for chat_id ${chat_id} already exists. Skipping creation.`);
//         return;
//     }

//     console.log(`Creating template for chat_id: ${chat_id}`);
//     const titleTemplate = document.createElement("div");
//     titleTemplate.classList.add("title-template");
//     titleTemplate.setAttribute("data-chat-id", chat_id);
//     const titleDiv = document.createElement("div");
//     titleDiv.classList.add("title-first");

//     const titleDivImg = document.createElement("img");
//     titleDivImg.src = "../static/img/msg.png";

//     // const titleAtag = document.createElement("a");
//     const titleDivSpan = document.createElement("span");
//     titleDivSpan.textContent = question;

//     // titleAtag.appendChild(titleDivSpan);

//     titleDiv.appendChild(titleDivImg);
//     titleDiv.appendChild(titleDivSpan);

//     const titleBtn = document.createElement("button");
//     const titleBtnImg = document.createElement("img");
//     titleBtnImg.src = "../static/img/dots.png";
//     titleBtn.appendChild(titleBtnImg);

//     titleTemplate.appendChild(titleDiv);
//     titleTemplate.appendChild(titleBtn);

//     // Add an onclick event to the template for fetching chat messages
//     titleTemplate.onclick = () => {
//         console.log(`Clicked on template for chat_id: ${chat_id}`);
//         window.chat_id = chat_id; // Update the global chat_id
//         setId(); // Ensure the current chat ID is updated
//         getChatMessages(chat_id); // Fetch and display messages for this chat
//     };

//     titles.append(titleTemplate);
//     console.log(`Template for chat_id ${chat_id} successfully added.`);
// }
function addTemplate(chat_id, question) {
    console.log(`Attempting to create template for chat_id: ${chat_id}`);

    // Check if an element with the same chat_id is already present
    const existingTemplate = Array.from(titles.children).find((child) => {
        return child.getAttribute("data-chat-id") === String(chat_id); // Compare chat_id
    });

    if (existingTemplate) {
        console.log(`Template for chat_id ${chat_id} already exists. Skipping creation.`);
        return;
    }

    console.log(`Creating template for chat_id: ${chat_id}`);
    const titleTemplate = document.createElement("div");
    titleTemplate.classList.add("title-template");
    titleTemplate.setAttribute("data-chat-id", chat_id);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-first");

    const titleDivImg = document.createElement("img");
    titleDivImg.src = "../static/img/msg.png";

    const titleDivSpan = document.createElement("span");
    titleDivSpan.textContent = question;

    titleDiv.appendChild(titleDivImg);
    titleDiv.appendChild(titleDivSpan);

    const titleBtn = document.createElement("button");
    titleBtn.classList.add("dot-btn");
    const titleBtnImg = document.createElement("img");
    titleBtnImg.src = "../static/img/dots.png";
    titleBtn.appendChild(titleBtnImg);

    titleTemplate.appendChild(titleDiv);
    titleTemplate.appendChild(titleBtn);

    // Add delete button functionality
    // titleBtn.addEventListener("click", (event) => {
    //     event.stopPropagation(); // Prevent triggering the titleTemplate click event

    //     // Check if the delete button already exists
    //     if (!titleTemplate.querySelector(".delete-btn")) {
    //         const deleteBtn = document.createElement("button");
    //         deleteBtn.textContent = "Delete";
    //         deleteBtn.classList.add("delete-btn");
        
    //         // Add event listener for the delete button
    //         deleteBtn.addEventListener("click", async (e) => {
    //             e.stopPropagation(); // Prevent triggering the outside click handler
    //             const confirmed = confirm(`Are you sure you want to delete this chat?`);
    //             if (confirmed) {
    //                 // Remove the template from the UI
    //                 titleTemplate.remove();
    //                 console.log(`Template for chat_id ${chat_id} removed.`);
        
    //                 // Call the API to delete the chat_id from the database
    //                 try {
    //                     const response = await fetch(`/delete_chat/${chat_id}/`, {
    //                         method: "DELETE",
    //                     });
        
    //                     if (response.ok) {
    //                         console.log(`chat_id ${chat_id} deleted successfully from the database.`);
    //                         const remainingTemplates = Array.from(titles.children);
    //                         if (remainingTemplates.length > 0) {
    //                             const lastTemplate = remainingTemplates[remainingTemplates.length - 1];
    //                             lastTemplate.click();
    //                         } else {
    //                             console.log("No templates remaining.");
    //                             createNewChat();
    //                         }
    //                     } else {
    //                         console.error(`Failed to delete chat_id ${chat_id} from the database.`);
    //                     }
    //                 } catch (error) {
    //                     console.error("Error deleting chat_id:", error);
    //                 }
    //             }
    //         });
        
    //         // Add the delete button to the title template
    //         titleTemplate.appendChild(deleteBtn);
    //     }
        
    //     // Toggle the delete button visibility on dots button click
    //     const dotsBtn = titleTemplate.querySelector(".dots-btn");
    //     dotsBtn.addEventListener("click", (e) => {
    //         e.stopPropagation(); // Prevent triggering outside click handler
    //         const deleteBtn = titleTemplate.querySelector(".delete-btn");
        
    //         if (deleteBtn.style.display === "none" || !deleteBtn.style.display) {
    //             // Show the delete button
    //             deleteBtn.style.display = "block";
        
    //             // Add outside click handler to hide the delete button
    //             const handleOutsideClick = (event) => {
    //                 if (!titleTemplate.contains(event.target)) {
    //                     deleteBtn.style.display = "none";
    //                     document.removeEventListener("click", handleOutsideClick); // Cleanup listener
    //                 }
    //             };
        
    //             document.addEventListener("click", handleOutsideClick);
    //         } else {
    //             // Hide the delete button
    //             deleteBtn.style.display = "none";
    //         }
    //     });
        
    // });
    titleBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the titleTemplate click event
    
        // Check if the delete button already exists
        if (!titleTemplate.querySelector(".delete-btn")) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
    
            deleteBtn.addEventListener("click", async (e) => {
                e.stopPropagation(); // Prevent triggering the outside click handler
    
                const confirmed = confirm(`Are you sure you want to delete this chat?`);
                if (!confirmed) return;
    
                try {
                    // Attempt to delete from the database
                    const response = await fetch(`/delete_chat/${chat_id}/`, { method: "DELETE" });
    
                    if (response.ok) {
                        console.log(`chat_id ${chat_id} deleted successfully from the database.`);
                        
                        // Remove the template from the UI
                        titleTemplate.remove();
    
                        // Handle remaining templates
                        const remainingTemplates = Array.from(titles.children);
                        if (remainingTemplates.length > 0) {
                            const lastTemplate = remainingTemplates[remainingTemplates.length - 1];
                            lastTemplate.click(); // Auto-select last template
                        } else {
                            console.log("No templates remaining.");
                            createNewChat(); // Reset to default state
                        }
                    } else {
                        console.error(`Failed to delete chat_id ${chat_id} from the database.`);
                        alert("Failed to delete the chat. Please try again.");
                    }
                } catch (error) {
                    console.error("Error deleting chat_id:", error);
                    alert("An error occurred while deleting the chat.");
                }
            });
    
            titleTemplate.appendChild(deleteBtn);
        }
    });
    
    
    // Add onclick event to the template for fetching chat messages
    titleTemplate.onclick = () => {
        console.log(`Clicked on template for chat_id: ${chat_id}`);
        window.chat_id = chat_id; // Update the global chat_id
        setId(); // Ensure the current chat ID is updated
        getChatMessages(chat_id); // Fetch and display messages for this chat

        // Remove the active class from all templates
        Array.from(titles.children).forEach((child) => {
            child.classList.remove("active");
            child.style.boxShadow = "none";
        });

        // Add the active class to the clicked template
        titleTemplate.classList.add("active");
        titleTemplate.style.boxShadow = "0 0 5px rgb(101, 142, 255)";
    };

    // Check if this is the active chat and apply styles
    if (window.chat_id === chat_id) {
        Array.from(titles.children).forEach((child) => {
            child.classList.remove("active");
            child.style.boxShadow = "none";
        });
        titleTemplate.classList.add("active");
        titleTemplate.style.boxShadow = "0 0 5px rgb(101, 142, 255)";
    }

    titles.append(titleTemplate);
    console.log(`Template for chat_id ${chat_id} successfully added.`);
    // titleBtn.addEventListener("click", (event) => {
    //     event.stopPropagation(); // Prevent triggering the titleTemplate click event
    
    //     // Check if the delete button already exists
    //     if (!titleTemplate.querySelector(".delete-btn")) {
    //         const deleteBtn = document.createElement("button");
    //         deleteBtn.textContent = "Delete";
    //         deleteBtn.classList.add("delete-btn");
    
    //         // Add event listener for delete button
    //         deleteBtn.addEventListener("click", async (e) => {
    //             e.stopPropagation(); // Prevent triggering the titleTemplate click event
    
    //             const confirmed = confirm(`Are you sure you want to delete this chat?`);
    //             if (confirmed) {
    //                 // Remove the template from the UI
    //                 titleTemplate.remove();
    //                 console.log(`Template for chat_id ${chat_id} removed.`);
    
    //                 // Call the API to delete the chat_id from the database
    //                 try {
    //                     const response = await fetch(`/delete_chat/${chat_id}/`, {
    //                         method: "DELETE",
    //                     });
    
    //                     if (response.ok) {
    //                         console.log(`chat_id ${chat_id} deleted successfully from the database.`);
    //                         introDefault();
    //                         resetui();
    //                         // Check if there are any remaining templates
    //                         const remainingTemplates = Array.from(titles.children);
    //                         if (remainingTemplates.length > 0) {
    //                             const lastTemplate = remainingTemplates[remainingTemplates.length - 1];
    //                             lastTemplate.click();
    //                         } else {
    //                             console.log("No templates remaining.");
    //                             createNewChat();
    //                         }
    //                     } else {
    //                         console.error(`Failed to delete chat_id ${chat_id} from the database.`);
    //                     }
    //                 } catch (error) {
    //                     console.error("Error deleting chat_id:", error);
    //                 }
    //             }
    //         });
    
    //         titleTemplate.appendChild(deleteBtn);
    
    //         // Add a listener to detect clicks outside the titleBtn and deleteBtn
    //         const handleOutsideClick = (e) => {
    //             if (!titleTemplate.contains(e.target)) {
    //                 // Remove the delete button
    //                 if (deleteBtn) {
    //                     deleteBtn.remove();
    //                 }
    //                 console.log("Clicked outside the dots menu. Resetting state.");
    //                 document.removeEventListener("click", handleOutsideClick); // Cleanup listener
    //             }
    //         };
    
    //         document.addEventListener("click", handleOutsideClick);
    //     }
    // });
}


async function getChatMessages(chat_id) {
    try {
        const response = await fetch(`/get_chat_messages/${chat_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Messages for chat:", chat_id);
            displayMessages(data.messages);
        } else {
            console.error("Error retrieving messages:", data.detail);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createNewChat() {
    console.log("Creating a new chat...");
    resetui();
    introDefault();
    try {
        const response = await fetch('/new_chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log("New Chat Created:", data.chat_id);
            window.chat_id = data.chat_id; // Update global chat_id
            setId(); // Update active chat ID
            return data.chat_id;
        } else {
            console.error("Failed to create a new chat.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    return null; // Return null if chat creation fails
}

async function sendMessage(chat_id, question) {
    const message = { question: question };
    addTemplate(chat_id,question);
    introTemplate.style.display = "none";
    chatContentDisplay.style.marginTop = "30px";
    navBar.style.top = "10px";
    msgContain.style.display = "flex";
    const sendDiv = document.createElement("div");
        sendDiv.classList.add("send");

        const sendSpan = document.createElement("span");
        sendSpan.textContent = message.question; // Add the question text

        const sendImg = document.createElement("img");
        sendImg.src = "../static/img/user.png"; // User image

        sendDiv.appendChild(sendSpan);
        sendDiv.appendChild(sendImg);
        msgContain.appendChild(sendDiv);
        // const loadingContainer = document.createElement('div');
    const receiveDiv = document.createElement("div");
    receiveDiv.classList.add("receive");
    const receiveImg = document.createElement("img");
    receiveImg.src = "../static/img/spark.png"; // Spark image
    receiveImg.style.animationName="pop";
    receiveDiv.appendChild(receiveImg);
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading_contain';
    // Create the first loading div
    const loading1 = document.createElement('div');
    loading1.className = 'loading';

    // Create the second loading div with custom style
    const loading2 = document.createElement('div');
    loading2.className = 'loading';
    loading2.style.width = '100px';

    // Append the loading divs to the container
    loadingContainer.appendChild(loading1);
    loadingContainer.appendChild(loading2);
    receiveDiv.appendChild(loadingContainer)
    msgContain.appendChild(receiveDiv);
    msgContain.scrollTo({
        top: msgContain.scrollHeight,
        behavior: "smooth",
    });
    try {
        const response = await fetch(`/add_message/${chat_id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Message added successfully");
            getChatMessages(chat_id);
        } else {
            console.error("Error adding message:", data.detail);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function setId() {
    window.set_id = window.chat_id;
    console.log(`Active chat set to: ${window.chat_id}`);
}


function sendTemplateText(a){
    textField.value=a;
    totalSubmit.click();
}

// textField.addEventListener("keydown", async function (event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         const text = textField.value.trim();
//         if (isListening) {
//             recognition.stop();
//             isListening = false;
//             micIcon.src = "../static/img/mic.png";
//             console.log("Microphone turned off.");
//         }
//         if (!text) {
//             console.error("Cannot send an empty message.");
//             return;
//         }

//         if (window.chat_id>0) {
//             console.log(`Sending message to chat_id: ${window.chat_id}`);
//             textField.value="";
//             sendMessage(window.chat_id, text);
//         } else {
//             console.log("No active chat. Creating a new chat...");
//             const newChatId = await createNewChat();
//             if (newChatId) {
//                 textField.value="";
//                 sendMessage(newChatId, text);
//             } else {
//                 console.error("Failed to create a new chat.");
//             }
//         }
//     }
// });

// totalSubmit.addEventListener("click", async function (event) {

//         event.preventDefault();
//         const text = textField.value.trim();
//         if (isListening) {
//             recognition.stop();
//             isListening = false;
//             micIcon.src = "../static/img/mic.png";
//             console.log("Microphone turned off.");
//         }
//         if (!text) {
//             console.error("Cannot send an empty message.");
//             return;
//         }

//         if (window.chat_id>0) {
//             console.log(`Sending message to chat_id: ${window.chat_id}`);
//             textField.value="";
//             sendMessage(window.chat_id, text);
//         } else {
//             console.log("No active chat. Creating a new chat...");
//             const newChatId = await createNewChat();
//             if (newChatId) {
//                 textField.value="";
//                 sendMessage(newChatId, text);
//             } else {
//                 console.error("Failed to create a new chat.");
//             }
//         }

// });


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
let isListening = false; // Define isListening globally

const voiceButton = document.getElementById("voice");
const micIcon = document.getElementById("micIcon");
// const textField = document.getElementById("textField");
// const totalSubmit = document.getElementById("totalSubmit");

// Check for Speech Recognition API support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    // Set Speech Recognition properties
    recognition.lang = "en-US"; // Set language
    recognition.continuous = true; // Continue listening for speech

    // Event when the button is clicked
    voiceButton.addEventListener("click", () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micIcon.src = "../static/img/stopmic.png";
        } else {
            recognition.stop();
            isListening = false;
            micIcon.src = "../static/img/mic.png";
        }
    });

    // Capture speech and write to input field
    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        textField.value = transcript;
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        recognition.stop();
        isListening = false;
        micIcon.src = "../static/img/mic.png";
    };
} else {
    // Fallback for browsers without Speech Recognition support
    console.warn("Speech Recognition API is not supported in this browser.");
    voiceButton.addEventListener("click", () => {
        alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
    });
}

// Event listeners for sending messages
textField.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const text = textField.value.trim();
        if (isListening) {
            recognition.stop();
            isListening = false;
            micIcon.src = "../static/img/mic.png";
        }
        if (!text) {
            console.error("Cannot send an empty message.");
            return;
        }

        if (window.chat_id) {
            console.log(`Sending message to chat_id: ${window.chat_id}`);
            textField.value = "";
            sendMessage(window.chat_id, text);
        } else {
            console.log("No active chat. Creating a new chat...");
            const newChatId = await createNewChat();
            if (newChatId) {
                textField.value = "";
                sendMessage(newChatId, text);
            } else {
                console.error("Failed to create a new chat.");
            }
        }
    }
});

totalSubmit.addEventListener("click", async function (event) {
    event.preventDefault();
    const text = textField.value.trim();
    if (isListening) {
        recognition.stop();
        isListening = false;
        micIcon.src = "../static/img/mic.png";
    }
    if (!text) {
        console.error("Cannot send an empty message.");
        return;
    }

    if (window.chat_id > 0) {
        console.log(`Sending message to chat_id: ${window.chat_id}`);
        textField.value = "";
        sendMessage(window.chat_id, text);
    } else {
        console.log("No active chat. Creating a new chat...");
        const newChatId = await createNewChat();
        if (newChatId) {
            textField.value = "";
            sendMessage(newChatId, text);
        } else {
            console.error("Failed to create a new chat.");
        }
    }
});
