# Recipe Nutrition Planner

A fullstack web application for creating and managing recipes with automatically calculated nutritional values. Each recipe is linked to a user and consists of multiple ingredients.

## Problem Statement

This application helps users easily create recipes and calculate their nutritional values based on selected ingredients.


## Tech Stack
- Frontend: React (Vite)
- Backend: Express.js
- Database: MongoDB Atlas (via Mongoose)
- Tools: concurrently, nodemon


## Project Structure
- client/ → React frontend (components, UI)
- server/ → Express backend (routes, controllers, models)


## Requirements
Make sure you have installed:
- Node.js (v18 or higher recommended)
- npm

> All other dependencies (React, Express, Vite, etc.) are installed automatically.


## Installation

Start by cloning the repository.
Install dependencies for the entire project:
```
npm install
npm install --prefix server
npm install --prefix client
```

## Environment Variables
Create a .env file inside the /server folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Seed Database
Run the following commands **inside** the /server folder:
```
node seed/seedUsers.js
node seed/seedIngredients.js
node seed/seedRecipes.js
```
This will populate the database with realistic data.

## Run the Application
Start both frontend and backend with one command back in root directory:
```
npm run dev
```
This uses concurrently to run:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Features
### Backend
- Full CRUD for recipes
- CRUD for ingredients
- User creation/login (name + email)
- Relationships:
    - Recipe → User
    - Recipe → Ingredients
- Automatic nutrition calculation
- Input validation
- Error handling (400, 404, 409, 500)

### Frontend
- Login / Signup (localStorage)
- Create recipes with multiple ingredients
- Dynamic ingredient inputs (add/remove rows)
- Update & delete recipes and ingredients
- Auto-refresh with setInterval
- Search recipes
- Loading and error states

## API Endpoints (examples)
```
GET    /api/recipes
GET    /api/recipes/:id
GET    /api/recipes?title=<searchTerm>  # Filter recipes by title

POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id

GET    /api/users
POST   /api/users/signup

GET    /api/ingredients
GET    /api/ingredients/:id
POST   /api/ingredients
PUT    /api/ingredients/:id
DELETE /api/ingredients/:id
```

## Database
The application uses MongoDB Atlas as a cloud database.
### Collections:
- Users
- Ingredients
- Recipes
### Relationships:
- Recipes reference a User (userId)
- Recipes reference multiple Ingredients (ingredientId)
- Recipes store an array of ingredient objects:
  - ingredientId (ObjectId)
  - amount (Number)

## Author
Gabriella Johansson



