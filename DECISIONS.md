# DECISIONS – Subscription Management Dashboard

## 1. Initial Context and Learning Curve

To be honest I had not worked with Django, Django REST Framework (DRF), or serializers before. So I had to learn on the go.
Because the assignment explicitly requires Django + DRF for the backend, my first step was to learn the basics:
- What a Django project and app are
- How models map to database tables
- What an API is in the context of Django
- What DRF serializers and validation do

To speed up this learning process, I used a combination of:
- AI tools (e.g. ChatGPT) to explain concepts in simpler terms and generate small code snippets
- Search through the documentation on https://docs.djangoproject.com/en/5.2/.
- Trial and error by running the server, checking errors, and fixing them

Whenever I used AI-generated code, I:
1. Read through it to understand what each line was doing.
2. Ask for a deeper explanation for the functions of each file and the purpose of the unique file layouts (especially in django)
3. Tested it locally to verify that it behaved as expected.

## 2. Tech Stack Choices

### Backend: Django + Django REST Framework

Since this was my first time using Django, I had to learn the basic structure of a Django project:

- The project (`config`) contains global settings and URL configuration.
- The `subscriptions` app is a focused module that contains the model, views, and API logic for subscriptions.
- The `Subscription` model defines the schema of the `subscriptions` table in the database (fields like `name`, `cost`, `billing_cycle`, etc.).
- Migrations (`makemigrations` and `migrate`) are used to translate model changes into actual database changes.
- I also registered the `Subscription` model in Django’s admin site so I could easily create and inspect subscription records during development.

Understanding this structure was my first step before adding Django REST Framework and building the actual API.

### Database: SQLite

I chose the default SQLite database because:
- It requires no extra setup and works out-of-the-box with Django.
- It is more than enough for a small project.
- If the project needed to scale later, the same Django models could work with other databases with minimal changes.

### Frontend: React

For the frontend, I chose React because:
- The assignment needs charts, lists, and filters, which React can handle with bootstrap components.
- Separates frontend from backend, which matches the idea of a REST API backend.
I considered using Django templates directly, but I have more experience with React.

## 3. Project Structure

I created a Django project called `config` and a Django app called `subscriptions`. The `subscriptions` app is responsible for:
- The `Subscription` model (database schema of a subscription)
- The API endpoints for CRUD operations
- The analytics / stats endpoint

I decided to keep things in a single app to keep the structure straightforward for an entry-level project.
