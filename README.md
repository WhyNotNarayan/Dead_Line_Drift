
# 🚗 DeadlineDrift
Live Link:- https://dead-line-drift.onrender.com/dashboard

DeadlineDrift is a web-based toy car racing management system built using Node.js, Express.js, MongoDB, and AngularJS.  
It is designed to manage and display results of a college toy car racing competition.

---

## 📌 Project Overview

In this game, participants must complete an obstacle track within **5 minutes**.

### 🏁 Winning Rules
- If a participant finishes within 5 minutes → Ranking is based on **minimum time taken**.
- If a participant does not finish → Ranking is based on **maximum distance covered**.
- Participants who finish are always ranked above those who do not.

---

## 🖥️ Features

### 🔐 Admin Dashboard
- Add participant details
- Enter distance covered
- Enter time taken
- Mark finish status
- Update race records

### 🏆 User Dashboard (Live Scoreboard)
- Automatic ranking
- Dynamic position numbers
- Performance-based sorting
- Real-time updates

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- AngularJS
- HTML, CSS, JavaScript

---

## 📂 Project Structure

```

deadline-drift/
│
├── backend/
│   ├── server.js
│   ├── models/
│   └── routes/
│
├── frontend/
│   ├── admin.html
│   ├── scoreboard.html
│   └── app.js

```

---

## ⚙️ Installation & Setup

1. Clone the repository:
```

git clone [https://github.com/your-username/deadlinedrift.git](https://github.com/your-username/deadlinedrift.git)

```

2. Install backend dependencies:
```

npm install

```

3. Start MongoDB server.

4. Run the backend:
```

node server.js

```

5. Open frontend files in browser.

---

## 🎯 Purpose

DeadlineDrift demonstrates full-stack development concepts including REST APIs, database integration, and dynamic ranking logic.  
It is suitable for college mini projects and event result management systems.

---

## 👨‍💻 Author
College Project – Toy Car Racing Game
```
