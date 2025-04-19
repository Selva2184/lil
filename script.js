//Selva
    // const firebaseConfig = {
    //   apiKey: "AIzaSyA8EQ2ObsVH5ARVAuLzK52AoWudXCTAwWU",
    //   authDomain: "login-tracker-b0a69.firebaseapp.com",
    //   projectId: "login-tracker-b0a69",
    //   storageBucket: "login-tracker-b0a69.appspot.com",
    //   messagingSenderId: "782634710850",
    //   appId: "1:782634710850:web:2f7a36d6e5102c1c147adb",
    //   measurementId: "G-QEJLMNE3L2"
    // };

//Muthu
const firebaseConfig = {
    apiKey: "AIzaSyDC9uxj_QJiMpbfk1g8uuiFXQkKmOVYxoU",
    authDomain: "project1-67245.firebaseapp.com",
    projectId: "project1-67245",
    storageBucket: "project1-67245.firebasestorage.app",
    messagingSenderId: "958396699264",
    appId: "1:958396699264:web:2415c78e0ab61aad5dcc65",
    measurementId: "G-JX6932EQMQ"
  };
  
  // ✅ Use compat method to initialize Firebase
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  

// ✅ Login function
function login(){
    const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
auth.signInWithEmailAndPassword(email, password)
  .then(userCredential => {
    const user = userCredential.user;
    const loginTime = new Date().toLocaleString();

    db.collection("users").doc(user.uid).collection("logins").add({
      action: "Login",
      timestamp: loginTime
    });

    sendEmailNotification(user.email, "Login", loginTime);
    loadInstagramClone(user); // Load the clone UI
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
            // Optional: remove this line if not necessary
            // displayLogHistory(user.uid);

            // ✅ Redirect to login page
            window.location.href = "index.html"; // change to your login page path if different
        })
        .catch(error => {
            alert(`❌ Error: ${error.message}`);
        });
}

//Clone 
function loadInstagramClone(user) {
    const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "insta.css"; // points to your custom dark-themed CSS
  document.head.appendChild(link);
    document.body.innerHTML = `
      <div class="insta-container">
        <h1>📸 InstaClone</h1>
  
        <div class="profile">
          <p>Welcome, <strong>${user.email}</strong></p>
          <button onclick="logout()" class="logout-btn">Logout</button>
        </div>
  
        <div class="upload-box">
          <input type="file" id="imageUpload" accept="image/*" />
          <input type="text" id="captionInput" placeholder="Write a caption..." />
          <button onclick="uploadPost()">Upload Post</button>
        </div>
  
        <h2>📰 Feed</h2>
        <div class="feed" id="feed"></div>
      </div>
    `;
  
    fetchPosts();
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

  function uploadPost() {
    const fileInput = document.getElementById("imageUpload");
    const caption = document.getElementById("captionInput").value;
    const file = fileInput.files[0];
  
    if (!file || !caption) return alert("⚠️ Please select an image and write a caption.");
  
    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result;
  
      db.collection("posts").add({
        image: base64Image,
        caption: caption,
        timestamp: new Date().toLocaleString()
      }).then(() => {
        alert("✅ Post uploaded!");
        fetchPosts(); // Refresh feed
      });
    };
    reader.readAsDataURL(file);
  }
  
  function fetchPosts() {
    db.collection("posts").orderBy("timestamp", "desc").get()
      .then(snapshot => {
        const feed = document.getElementById("feed");
        feed.innerHTML = "";
  
        snapshot.forEach(doc => {
          const post = doc.data();
          feed.innerHTML += `
            <div class="post">
              <img src="${post.image}" alt="Post">
              <p>${post.caption}</p>
              <button>Like 💙</button>
            </div>
          `;
        });
      });
  }
  
  

