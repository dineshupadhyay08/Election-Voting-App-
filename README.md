# 🗳️ Election Voting App.

A full-stack **Election Voting System** built with the **MERN stack**, designed to simulate a real-world digital voting platform.  
The project focuses on **role-based access (Admin / Voter)**, **secure authentication**, and a **dashboard-style UI**.

---

## 🚀 Features

### 👤 Authentication & Authorization
- Secure login & registration using **JWT (Cookie-based auth)**
- Role-based access:
  - **Admin**: Manage elections & candidates
  - **Voter**: View elections, candidates & vote
- Protected routes using middleware

 **Normal User**
- Email :- dienshu@gmail.com
- Password :- Dinesh@123

**Admin**
- Email :- dk@gmail.com
- Password :- Dinesh@123
---

### 🗳️ Elections
- Create, update, delete elections (Admin only)
- View all elections (Voters)
- Live / Upcoming election handling
- Election status & dates

---

### 🧑‍💼 Candidates
- Add candidates under a specific election (Admin)
- View all candidates
- Candidate profile with personal & political details
- Vote for a candidate (One vote per election)

---

### 👤 Voter Profile
- View logged-in voter profile
- Role display (Admin / Voter)
- Voting history support (extensible)
- Designed to expand into full voter identity system

---

### 🎨 Frontend UI
- Dashboard-style layout
- Sidebar + Header (Desktop)
- Mobile-first responsive approach
- Clean cards, grids, and modals
- Built with **Tailwind CSS**

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie-based auth

---

## 📁 Project Structure

```
Election-Voting-App/
│
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ ├── router/ # React Router config
│ │ ├── store/ # Axios setup
│ │ └── index.css
│
├── server/ # Backend (Node + Express)
│ ├── controller/ # Route controllers
│ ├── model/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & admin middleware
│ └── index.js
│
└── README.md
```


---

## 🔐 Authentication Flow

1. User logs in
2. Backend generates JWT
3. JWT stored in **HTTP-only cookie**
4. Every protected request validates token via middleware
5. Role (`isAdmin`) decides access level

---

## ⚙️ Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SRCRET=your_jwt_secret
```
---

## ▶️ How to Run Locally

### 1️⃣ Clone the repository
---
```bash
git clone https://github.com/dineshupadhyay08/Election-Voting-App.git
cd Election-Voting-App
```
2️⃣ Backend setup
---
```
	cd server
	npm install
	npm run dev
``````
3️⃣ Frontend setup
---

```
    cd client
    npm install 
    npm run dev
```

🔗 Local URLs
---
```
	Frontend: http://localhost:5173

	Backend: http://localhost:5000
	
```
---
🧪 API Overview (Sample)
---
```
Method	Route	Description
POST	/voters/register	---(Register voter)
POST	/voters/login	    ---(Login)
GET	/voters/me					---(Get logged-in voter profile)
GET	/elections					---(Get all elections)
POST	/elections				---(Add election (Admin only))
GET	/candidates					---(Get all candidates)
POST	/candidates				---(Add candidate (Admin only))
PATCH	/candidates/:id		---(Vote for a candidate)
```
---


## 📌 Future Enhancements

-   Profile image upload
    
-   Aadhaar / Proof ID verification simulation
    
-   Election countdown timer
    
-   Result analytics & charts
    
-   PWA (App-like mobile experience)
    
-   Notification system

---


## 👨‍💻 Author

**Dinesh Upadhyay**

- GitHub: https://github.com/dineshupadhyay08
- Portfolio: https://dinesh-upadhyay-portfolio-jbh1.vercel.app/
    
-   Role: MERN Stack Developer

---
⭐ Support
If you like this project, give it a ⭐
Feedback and contributions are welcome!
---

