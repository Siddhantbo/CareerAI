# Interview with AI

Overview

The Interview with AI project is a web-based application built using Node.js and Express.js. It provides three user panels—Admin, User, and Recruiter—to streamline the process of skill development, course enrollment, and interview management.

There is link of deployed backend "https://interview-ai-backend-etzo.onrender.com"

# Features

## 1. Admin Panel

Role Management: Create and manage roles.

Course Management:

Create courses and add detailed course information.

Define skills associated with each course.

Exam Management:

Create theory and practical exam questions and answers.

Recruiter Management:

Create recruiters and send their credentials via email.

## 2. User Panel

Course Enrollment: Enroll in available courses.

Exam Participation:

Take theory and practical exams.

Live Interview:

Work with integrated APIs (e.g., Google Meet) for live interviews.

Schedule and attend interviews.

Profile Management:

Create and update personal and other related information.

## 3. Recruiter Panel

Interview Management:

Mark user interviews as complete or pending.

Update user status as selected or not selected.

Technology Stack

Backend: Node.js, Express.js

Database: MongoDB (for storing user, course, and exam information)

Email Service: Nodemailer (for sending recruiter credentials)

Live APIs: Integration with Google Meet or similar platforms for live interviews

Installation

Prerequisites

Node.js (>=14.x)

MongoDB (local or cloud)


---

## Backend Technologies

The **backend** of the Society Management System is responsible for handling business logic, user authentication, data management, and communication with the database. Below are the technologies used:

### 1. **Node.js**

- Node.js is used as the runtime environment for running JavaScript code on the server. It allows us to handle backend operations and create APIs efficiently.

### 2. **Express**

- Express is a web application framework for Node.js. It simplifies the creation of routes, middleware, and API endpoints for the application.

### 3. **JWT (JSON Web Token)**

- JWT is used for secure authentication and authorization. It allows users to log in and access protected resources in the application.

### 4. **Bcrypt**

- Bcrypt is used for hashing passwords. It helps in securely storing user passwords in the database by encrypting them.

### 5. **Cloudinary**

- Cloudinary is used for managing and uploading images and other media files. It helps store images like profile pictures and document uploads in the cloud.

### 6. **Nodemailer**

- Nodemailer is used for sending emails. It is useful for sending password reset emails, notifications, and other messages to users.

---

# Steps

**Clone the repository:**

git clone https://github.com/swiftrut/Interview_AI-backend


**Install dependencies:**
```
npm install
```

**Create a .env file in the root directory with the following variables:**

PORT=3000
MONGO_URI=mongodb://localhost:27017/interview_ai
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=cloud_key
CLOUDINARY_API_SECRET=cloud-secret
Client_ID = cloud_client_id
Client_secret = client_secret
GEMINI_API_KEY=gemini_api_key


**Start the server:**

```
npm start
```

**The server will run on**

```
 http://localhost:3000.
```

### THANK YOU !
