# Dance Booking Web Application

This is a coursework project for Web Application Development 2.  
It allows users to browse and book dance classes, while organisers can manage courses, view bookings, and control user access.

---

## Features

### For Members (Users):
- Register and log in
- Browse available courses
- Book a course
- View and cancel their own bookings

### For Organisers:
- Log in as an admin
- Add, edit, and delete courses
- View course bookings
- Add or remove other organisers
- View and remove registered users

---

## Authentication

The app uses JSON Web Tokens (JWT) to manage sessions:
- Members and organisers are kept separate
- Secure login and cookie-based authentication
- Passwords are hashed using `bcrypt`

---

## Technologies Used

| Stack | Description |
|-------|-------------|
| Node.js | Backend runtime |
| Express.js | Server framework |
| Mustache | Templating engine |
| NeDB | Lightweight database (file-based) |
| bcrypt | Password hashing |
| jsonwebtoken | Authentication via JWT |
| Bootstrap 5 | Frontend layout and styling |
| Render | Hosting the deployed app |
| GitHub | Version control and repo |

---

## Architecture

The application follows an **MVC structure**:
- `models/` handles data (courses, bookings, users)
- `controllers/` processes requests and renders views
- `routes/` maps endpoints to controllers
- `views/` contains Mustache templates with shared header/footer

---

## Coursework Notes

- Bootstrap was not required but was intentionally used as comfortable styling tool to meet the “user-friendly interface” requirement.
- The entire app was built in VS Code and deployed using Render.
- Registration for admins aka organisers is accesible only by manual navigating by typing /register to the home page address

---

## How to Run Locally

Create an `.env` file in the root folder and add:

PORT=3000
ACCESS_TOKEN_SECRET=yourRandomStringHere

Run by this commands:

npm install
node index.js

And then access through "http://localhost:3000" address

### Default Admin Account (for testing/reset)
If no organiser exists, a default admin will be created on startup:

- Username: `admin`
- Password: `admin`

## Project Screenshots

### Homepage
![Homepage](images/Home-page.png)

### Organiser Dashboard
![Dashboard](images/Dashboard-page.png)

### My Bookings (Member View)
![Bookings](images/Courses-page.png)
