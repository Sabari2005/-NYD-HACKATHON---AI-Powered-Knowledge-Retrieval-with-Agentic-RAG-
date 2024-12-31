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
let entered=0;
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

async function sendTemplateText(a) {
    // const text = document.getElementById("sendText").value;
    entered=1;
    const text=a;
    console.log(text);
    console.log(a);
    // Prepare the data to send
    // const data = { text: text };

    //    // Send the data to the FastAPI server using a POST request
    // const response = await fetch("http://127.0.0.1:8000/send-text/", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    // });
    introTemplate.style.display="none";
    msgContain.style.display="flex";
    textField.value=a;
    sendText();
    // // Get the response and display it
    // const result = await response.json();
    // console.log(result);
    // document.getElementById("response").textContent = result.message;
}
async function sendText() {
    entered=1;
    const text = textField.value.trim(); // Trim whitespace
    const msgContain = document.getElementById("msg-contain");

    if (text === "") {
        alert("Please enter a message before sending.");
        return;
    }

    if (introTemplate.style.display != "none") {
        introTemplate.style.display = "none";
        msgContain.style.display = "flex";
    }

        if (chatContentDisplay.style.marginTop != "30px") {
            chatContentDisplay.style.marginTop = "30px";
        }
    
        
    if (window.getComputedStyle(navBar).top === "30px") {
        console.log("nav shrinked");
        navBar.style.top = "10px";
    }

    console.log("Sending text:", text);

    // Create the "send" div
    const sendDiv = document.createElement("div");
    sendDiv.classList.add("send");

    // Add the span and image
    sendDiv.innerHTML = `
        <span>${text}</span>
        <img src="../static/img/user.png" alt="User">
    `;
    msgContain.appendChild(sendDiv);
    textField.value = "";

    // Create the "receive" div with loading animation
    const receiveDiv = document.createElement("div");
    receiveDiv.classList.add("receive");

    receiveDiv.innerHTML = `
        <img src="../static/img/spark.png">
        <div class="loading_contain fade-out">
            <div class="loading"></div>
            <div class="loading" style="width: 100px;"></div>
        </div>
    `;
    msgContain.appendChild(receiveDiv); 
    const loadingContainer = receiveDiv.querySelector(".loading_contain");

    // Enable animation for the image
    const receiveImg = receiveDiv.querySelector("img");
    receiveImg.classList.add("pop");

    try {
        // Prepare and send data to the server
        const response = await fetch("http://127.0.0.1:8000/send-text/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            introTemplate.style.display = "flex";
            msgContain.style.display = "none";
            chatContentDisplay.style.marginTop = "0px";
            navBar.style.top = "30px";
            alert("Failed to send message to the server.");
            return;
        }

        // Parse and display the server response
        const result = await response.json();
        console.log("Server response:", result);
                // Add fade-out class to loading container
        loadingContainer.classList.add("hidden");


        // Update the receiveDiv content with the server response
        // receiveDiv.innerHTML = `
        //     <img src="../static/img/spark.png" alt="Bot">
        //     <span>${result.message}</span>
        // `;

        // Disable animation for the image
        const updatedImg = receiveDiv.querySelector("img");
        updatedImg.style.animation = "none";
                // Wait for fade-out transition to complete
        setTimeout(() => {
            // Replace loading with the server response text
            loadingContainer.remove(); // Remove the loading bars
            const responseText = document.createElement("span");
            responseText.classList.add("fade-in");
            responseText.textContent = result.message;

            receiveDiv.appendChild(responseText);

            // Add visible class to fade-in text
            setTimeout(() => {
                responseText.classList.add("visible");
            }, 0);
        }, 500); // Match the fade-out duration
        // Scroll to the bottom of the message container
        msgContain.scrollTop = msgContain.scrollHeight;

    } catch (error) {
        console.error("Error sending message:", error);
        introTemplate.style.display = "flex";
        msgContain.style.display = "none";
        msgContain.innerHTML = "";
        chatContentDisplay.style.marginTop = "0px";
        navBar.style.top = "30px";
        alert("Failed to send your message. Please try again later.");
    }
}


document.getElementById("sendText").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendText();
    }
});
totalSubmit.addEventListener("click",()=>{
    console.log("submit");
    sendText();
});
function resetui() {
    console.log("reseted");
    if (window.getComputedStyle(navBar).top === "10px") {
        console.log("nav shrinked");
        navBar.style.top = "30px";
    }
    first=0;
    // introTemplate.style.display = "flex";
    // msgContain.style.display = "none";/
    // msgContain.innerHTML = ""; // Clears the message container
    // chatContentDisplay.style.marginTop = "0px"; // Resets chat content margin
    // navBar.style.top = "30px"; // Adjusts the navbar position
}
generalPanel.addEventListener("click",()=>{
    console.log("general");
    if(entered===1){
        // if (chatContentDisplay.style.marginTop != "30px") {
            if (window.getComputedStyle(navBar).top === "30px") {
                console.log("nav shrinked");
                navBar.style.top = "10px";
            }
        // }
    }
    
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

// Ensure 'resetUi' is properly selected from the DOM
// const resetUiButton = document.getElementById("resetUi"); // Replace with the actual ID

