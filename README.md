# Aajil SWE Assessment – Subscription Manager

This project is my implementation of the Aajil Software Engineering Assessment.  
It is a full-stack application that allows users to manage subscriptions, track upcoming renewals, and view cost breakdowns. The backend is built using Django REST Framework, and the frontend is built using React + Vite.

The repository includes:
- A Django backend that exposes RESTful CRUD endpoints
- A React dashboard for adding, editing, canceling, and viewing subscriptions
- A statistics endpoint for cost summaries and upcoming renewals
- Documentation of my decisions and development process in DECISIONS.md

---

## Features

### Backend (Django + DRF)
- Create, read, update, and cancel subscriptions  
- Automatic renewal date calculation based on billing cycle  
- Soft delete using `is_active`  
- Stats endpoint calculating:
  - Total monthly and yearly cost equivalents
  - Subscriptions renewing within the next 7 days
  - Upcoming renewals list  
- Validation for cost, billing cycle, and dates  

### Frontend (React + Vite)
- Dashboard displaying all active subscriptions
- Add/Edit subscription form
- Cancel subscription functionality
- Cost breakdown chart (monthly/yearly cost)
- Upcoming renewal reminders
- Savings calculator for comparing billing cycles

---

## Tech Stack

### Backend
- Python 3
- Django
- Django REST Framework
- SQLite (default, no configuration needed)

### Frontend
- React
- Vite
- Axios
- Recharts
- Tailwind CSS

---

## Project Structure

aajil-subscriptions (is the Django backend)/
config/
subscriptions/
manage.py

src (is the React Frontend)/
components/
hooks/
lib/
types/
App.css
App.tsx
index.css
main.tsx

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Saeed-Lababidi/Aajil-SWE-Assessment.git
```
```bash
cd <your-project-folder>
```

---

## Backend Setup (Django)

### Install dependencies

```bash
cd aajil-subscriptions
```
```bash
pip install -r requirements.txt
```

### Run Migrations

```bash
python manage.py makemigrations
```
```bash
python manage.py migrate
```

### Start the backend server

```bash
python manage.py runserver
```

Backend will be available at: http://127.0.0.1:8000/
API root: http://127.0.0.1:8000/api/subscriptions/

---

## Frontend Setup (React + Vite)

### Install dependencies

You have to be in the root project directory
```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

Frontend will run on: http://127.0.0.1:5173/

---

## Endpoints Summary

### Main CRUD
- `GET /api/subscriptions/`
- `POST /api/subscriptions/`
- `GET /api/subscriptions/<id>/`
- `PATCH /api/subscriptions/<id>/`
- `DELETE /api/subscriptions/<id>/`  (soft delete → sets `is_active=False`)

### Stats
- `GET /api/subscriptions/stats/`

---

## Notes About the Assignment

- All reasoning, architectural decisions, challenges, debugging steps, and trade-offs are documented in DECISIONS.md.
- My goal was to keep the implementation clean, understandable, and maintainable.
- I focused on fulfilling the user stories clearly and reliably.

---

## Future Improvements (If I Had More Time)
- Add authentication and user-specific subscriptions
- Add pagination and filtering
- Allow category management
- More detailed analytics
- Add background tasks (e.g., email reminders)
- Add unit tests
