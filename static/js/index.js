const sidePanel = document.getElementById("side");
const mainPanel = document.getElementById("main-content");
const openSideBtn = document.getElementById("openside-btn");
const closeSideBtn = document.getElementById("closeside-btn");
const totalSubmit=document.getElementById("submit");
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
    const sections = document.querySelectorAll('.changer > div');
    if (tools.length > 0) {
        tools[0].classList.add('selected');
    }
    tools.forEach(tool => {
        tool.addEventListener('click', function () {
            tools.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Fade in
            } else {
                entry.target.classList.remove('visible'); // Fade out
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is in view

    sections.forEach(section => {
        observer.observe(section);
    });
});
async function sendText() {
    const text = document.getElementById("sendText").value;
    console.log(text);
    // Prepare the data to send
    const data = { text: text };

    // Send the data to the FastAPI server using a POST request
    const response = await fetch("http://127.0.0.1:8000/send-text/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    // Get the response and display it
    const result = await response.json();
    console.log(result);
    // document.getElementById("response").textContent = result.message;
}
totalSubmit.addEventListener("click",()=>{
    console.log("submit");
    sendText();
});

