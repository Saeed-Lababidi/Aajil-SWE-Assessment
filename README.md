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

## How to Run the Project

### 1. Clone the Repository

git clone
