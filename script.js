const firebaseConfig = {
    apiKey: "AIzaSyA8EQ2ObsVH5ARVAuLzK52AoWudXCTAwWU",
    authDomain: "login-tracker-b0a69.firebaseapp.com",
    projectId: "login-tracker-b0a69",
    storageBucket: "login-tracker-b0a69.appspot.com",  // corrected this line
    messagingSenderId: "782634710850",
    appId: "1:782634710850:web:2f7a36d6e5102c1c147adb",
    measurementId: "G-QEJLMNE3L2"
  };
  
  // ✅ Use compat method to initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  

// ✅ Login function
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            let user = userCredential.user;
            let loginTime = new Date().toLocaleString();

            // Log to Firestore
            db.collection("users").doc(user.uid).collection("logins").add({
                action: "Login",
                timestamp: loginTime
            });

            alert(`✅ Logged in successfully at ${loginTime}`);
            sendEmailNotification(email, "Login", loginTime);
            displayLogHistory(user.uid);
        })
        .catch(error => {
            alert(`❌ Error: ${error.message}`);
        });
}

// ✅ Logout function
function logout() {
    const user = auth.currentUser;
    if (!user) return alert("⚠️ No user is logged in!");

    const logoutTime = new Date().toLocaleString();

    db.collection("users").doc(user.uid).collection("logins").add({
        action: "Logout",
        timestamp: logoutTime
    });

    auth.signOut()
        .then(() => {
            alert(`🔴 Logged out at ${logoutTime}`);
            sendEmailNotification(user.email, "Logout", logoutTime);
            displayLogHistory(user.uid);
        })
        .catch(error => {
            alert(`❌ Error: ${error.message}`);
        });
}

// ✅ Display login history
function displayLogHistory(userId) {
    db.collection("users").doc(userId).collection("logins").orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
            const logList = document.getElementById("log-list");
            logList.innerHTML = "";
            snapshot.forEach(doc => {
                const log = doc.data();
                logList.innerHTML += `<li>${log.action} at ${log.timestamp}</li>`;
            });
        });
}

function sendEmailNotification(email, action, timestamp) {
    console.log("📨 Preparing to send email to:", email);
  
    emailjs.send("service_fkdmcq9", "template_iqf6k4i", {
      email: email,
      action: action,
      timestamp: timestamp
    })
    .then(response => {
      console.log("📧 Email sent successfully!", response.status, response.text);
    })
    .catch(error => {
      console.error("📧 Email failed to send:", error);
    });
  }
  

