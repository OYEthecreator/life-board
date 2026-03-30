document.addEventListener("DOMContentLoaded", function() {

    const signupBtn = document.getElementById("signupBtn");
    if (!signupBtn) return; // ⛔ Stop running on pages without signupBtn

    signupBtn.addEventListener("click", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const dob = document.getElementById("dob").value.trim();
        const password = document.getElementById("password").value.trim();

        // ==== IMPROVED VALIDATION ====
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dobRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        const existingPopup = document.querySelector('[style*="position: fixed"][style*="z-index: 9999"]');
        if (existingPopup) existingPopup.remove();

        if(!name || !email || !dob || !password){
            showPopup("All fields are required.");
            return;
        }

        if(name.length < 3){
            showPopup("Name must be at least 3 characters long.");
            return;
        }

        if(!emailRegex.test(email)){
            showPopup("Please enter a valid email address.");
            return;
        }

        if(!dobRegex.test(dob)){
            showPopup("Please enter a valid date of birth (MM/DD/YYYY or YYYY-MM-DD).");
            return;
        }

        if(!passwordRegex.test(password)){
            showPopup("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        if(localStorage.getItem("lifeboard_user_" + email)){
            showPopup("User already exists. Please login.");
            return;
        }

        const userData = { 
            name, 
            email, 
            dob, 
            password:password
        };
        localStorage.setItem("lifeboard_user_" + email, JSON.stringify(userData));
        localStorage.setItem('current_user_email', email);
        showPopup(`Welcome, ${name}! Your account has been created.`, true);

        setTimeout(() => {
            window.location.href = "welcome.html";
        }, 2000);
    });

    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            signupBtn.click();
        }
    });
});


// ✅ ADD THIS POPUP FUNCTION (this was missing)
function showPopup(message, success = false) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "15px 20px";
    popup.style.background = success ? "green" : "red";
    popup.style.color = "#fff";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "14px";
    popup.style.zIndex = "9999";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  // =====================================================
  // === QUESTION 1 PAGE ===
  // =====================================================
  if (path.includes("question1.html")) {
    const currentEmail = localStorage.getItem("current_user_email");
    const storedUser = currentEmail
      ? JSON.parse(localStorage.getItem("lifeboard_user_" + currentEmail)) || {}
      : {};
    const userName = storedUser.name ? storedUser.name.split(" ")[0] : "there";
    const questionText = document.getElementById("questionText");

    if (questionText) questionText.textContent = `Hey ${userName}, what’s your main goal with LifeBoard?`;

    const buttons = document.querySelectorAll(".answer-btn");
    const progressBar = document.getElementById("progressBar");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        let onboarding = JSON.parse(localStorage.getItem("lifeboard_onboarding")) || {};
        onboarding.q1 = btn.textContent;
        localStorage.setItem("lifeboard_onboarding", JSON.stringify(onboarding));

        if (progressBar) progressBar.style.width = "33%";
        const card = document.getElementById("questionCard");
        if (card) card.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = "question2.html";
        }, 800);
      });
    });
  }

  // =====================================================
  // === QUESTION 2 PAGE ===
  // =====================================================
  else if (path.includes("question2.html")) {
    const email = localStorage.getItem("current_user_email");
    const storedUser = email ? JSON.parse(localStorage.getItem("lifeboard_user_" + email)) : null;
    const userName = storedUser && storedUser.name ? storedUser.name.split(" ")[0] : "there";

    const questionText = document.getElementById("questionText");
    if (questionText) questionText.textContent = `Hey ${userName}, what’s your biggest struggle right now?`;

    const buttons = document.querySelectorAll(".answer-btn");
    const progressBar = document.getElementById("progressBar");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        let onboarding = JSON.parse(localStorage.getItem("lifeboard_onboarding")) || {};
        onboarding.q2 = btn.textContent;
        localStorage.setItem("lifeboard_onboarding", JSON.stringify(onboarding));

        progressBar.style.width = "66%";

        const card = document.getElementById("questionCard");
        card.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = "question3.html";
        }, 800);
      });
    });
  }

  // =====================================================
  // === QUESTION 3 PAGE ===
  // =====================================================
  else if (path.includes("question3.html")) {
    const email = localStorage.getItem("current_user_email");
    const storedUser = email ? JSON.parse(localStorage.getItem("lifeboard_user_" + email)) : null;
    const userName = storedUser && storedUser.name ? storedUser.name.split(" ")[0] : "there";

    const questionText = document.getElementById("questionText");
    if (questionText) questionText.textContent = `Hey ${userName}, how do you want LifeBoard to motivate you?`;

    const buttons = document.querySelectorAll(".answer-btn");
    const progressBar = document.getElementById("progressBar");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        let onboarding = JSON.parse(localStorage.getItem("lifeboard_onboarding")) || {};
        onboarding.q3 = btn.textContent;
        localStorage.setItem("lifeboard_onboarding", JSON.stringify(onboarding));

        progressBar.style.width = "100%";
        const card = document.getElementById("questionCard");
        card.classList.add("fade-out");

        setTimeout(() => {
          document.body.innerHTML = `
            <div class="final-screen">
              <img src="./images/Screenshot 2025-09-26 091052.png" class="final-logo" alt="LifeBoard Logo">
              <div class="final-slogan">Organize Your Life, Amplify Your Potential</div>
            </div>
          `;
          setTimeout(() => {
            window.location.href = "firstpage.html";
          }, 10000);
        }, 900);
      });
    });
  }

 // =====================================================
// === DASHBOARD WELCOME POPUP ===
// =====================================================
else if (path.includes("dashboard") || document.getElementById("dashboardWelcome")) {
  const popup = document.getElementById("dashboardWelcome");
  if (!popup) return;

  const popupShownKey = "lifeboard_welcome_shown";

  // ✅ Only show once per login session
  if (sessionStorage.getItem(popupShownKey) === "true") return;

  const email = localStorage.getItem("current_user_email");
  const storedUser = email ? JSON.parse(localStorage.getItem("lifeboard_user_" + email)) : null;
  const onboarding = JSON.parse(localStorage.getItem("lifeboard_onboarding")) || {};

  const name = storedUser?.name ? storedUser.name.split(" ")[0] : "there";
  const q1 = onboarding.q1 || "";
  const q2 = onboarding.q2 || "";
  const q3 = onboarding.q3 || "";

  const title = document.getElementById("welcomeTitle");
  const message = document.getElementById("welcomeMessage");
  const closeBtn = document.getElementById("closeWelcome");

  // === Personalized title ===
  let titleText = "";
  if (q1.includes("productivity")) titleText = `Welcome back, ${name}!`;
  else if (q1.includes("organized")) titleText = `Good to see you again, ${name}!`;
  else if (q1.includes("time")) titleText = `Hey ${name}, ready to manage your time smarter?`;
  else if (q1.includes("procrastination")) titleText = `Let's crush procrastination today, ${name}.`;
  else if (q1.includes("Discipline")) titleText = `Welcome back, focused mind.`;
  else titleText = `Welcome to LifeBoard, ${name}!`;

  // === Personalized message ===
  let messageText = "";
  if (q2 === "Staying consistent")
    messageText = "Let’s help you build unstoppable momentum through small, steady progress.";
  else if (q2 === "Managing time")
    messageText = "Your dashboard is ready to make every hour count.";
  else if (q2 === "Overthinking or decision fatigue")
    messageText = "Let’s clear the noise so your focus can shine.";
  else if (q2 === "Balancing work and personal life")
    messageText = "Here’s to finding flow between your work and your peace.";

  if (q3 === "Calm & encouraging")
    messageText += " Breathe — progress, not pressure.";
  else if (q3 === "Firm & direct")
    messageText += " Stay sharp, stay intentional.";
  else if (q3 === "Motivational & energetic")
    messageText += " You’ve got this — make today unstoppable!";
  else if (q3 === "Gentle reminders")
    messageText += " Just soft nudges when you need them most.";
  else if (q3 === "Visual & inspiring cues")
    messageText += " Expect subtle visuals to keep you inspired.";

  // === Apply content ===
  title.textContent = titleText;
  message.textContent = messageText;

  // === Fade-in animation for popup ===
  popup.classList.add("active");
  popup.querySelector(".popup-content").classList.add("fade-in");

  // ✅ Only mark as shown after actually displaying
  sessionStorage.setItem(popupShownKey, "true");

  // === X icon closes popup ===
  closeBtn.addEventListener("click", () => {
    const content = popup.querySelector(".popup-content");
    content.classList.remove("fade-in");
    content.classList.add("fade-out");
    setTimeout(() => {
      popup.classList.remove("active");
      content.classList.remove("fade-out");
    }, 300);
  });
}

});