# KinetiqAI

**KinetiqAI** is a personalized, AI-powered full-stack fitness and wellness platform. Designed to help users intelligently manage their workouts, nutrition, and daily meals, it leverages Google's Gemini AI to provide a highly tailored, conversational fitness experience that adapts to your specific goals, equipment, and lifestyle.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

---

## ✨ Features

### 🤖 AI Coach
- **Conversational Fitness Assistant**: Ask complex, multi-turn questions about training, recovery, and diet.
- **Contextual Memory**: The AI Coach retains conversation history during your session to provide relevant follow-up advice and adjustments.
- **Smart Adaptability**: Ask natural-language questions like *"I only have eggs and oats, suggest a meal"* or *"Can I swap barbell squats for something else?"*

### 🏋️ AI Workout Generation
- **Hyper-Personalized Plans**: Generate structured, multi-day workout routines based on specific user inputs.
- **Customizable Constraints**: Set your primary goal (e.g., Muscle Gain, Fat Loss, Strength), workout frequency (days per week), preferred split (e.g., Push/Pull/Legs, Full Body), and available equipment.
- **Persistent Regeneration**: Regenerate your routine anytime without losing your active configurations and equipment filters.

### 🥗 AI Nutrition & Meal Tracking
- **Natural Language Meal Analysis**: Simply describe your meal (e.g., *"150g chicken breast with 200g rice and some broccoli"*) and the Gemini AI engine will automatically extract the ingredients, estimate portions, and calculate total calories, protein, carbs, and fats.
- **Food Search**: Search and log individual ingredients leveraging a vast nutritional database powered by USDA FoodData Central.
- **Macro Tracking**: Monitor your daily caloric and macronutrient intake against dynamic, user-specific nutritional targets.

### 📊 Dashboard & Progress Tracking
- **Centralized Hub**: View your daily nutrition progress, active workout plan, and intelligent insights in one place.
- **Habit Tracking & Progress Logging**: Log your bodyweight, track daily habits, and visualize your progress over time with interactive charts.

### 👤 Secure Authentication & Profiles
- **JWT Authentication**: Secure user registration, login, and session management using HTTP-bearer JSON Web Tokens.
- **Dynamic Profiles**: Automatically provisions user profiles upon registration, tailoring the AI experience to your baseline metrics.

### 🎨 Premium UI/UX
- **Dark-Themed Interface**: A sleek, modern, and immersive dark mode design built with Tailwind CSS.
- **Interactive Animations**: Smooth page transitions and micro-interactions powered by Framer Motion.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop environments.

---

## 🧠 AI Architecture

KinetiqAI implements a robust, fault-tolerant AI orchestration pipeline leveraging Google's Gemini 3.x models:

```text
User Input (React Frontend)
          ↓
Express API Route (e.g., /api/ai/coach, /api/workouts/generate)
          ↓
AI Controller (Constructs dynamic prompts with user state/history)
          ↓
AI Provider Layer (Manages rate limits, transient errors, and failover across Gemini models)
          ↓
Google Gemini API (Generative AI)
          ↓
Raw JSON / Text Response
          ↓
Output Normalization & Zod Schema Validation (Ensures strict type-safety & structural integrity)
          ↓
Validated Data Saved to MongoDB & Returned to Frontend
```

### AI Use Cases
1. **AI Coach**: Utilizes flexible system prompts tailored with the user's current fitness profile to generate open-ended, contextual advice.
2. **Workout Generation**: Enforces strict JSON schemas to guarantee the AI outputs highly structured, parseable arrays of exercises, sets, reps, and rest periods.
3. **Natural Language Nutrition Analysis**: Parses unstructured, colloquial meal descriptions into precise, structured macronutrient data objects via LLM entity extraction and estimation.

---

## 🏗️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React (Vite)** | Frontend framework for building a fast, interactive user interface |
| **TypeScript** | Static typing across the frontend for robust component architecture |
| **Tailwind CSS v4** | Utility-first CSS framework for rapid, responsive styling |
| **Framer Motion** | Declarative library for sophisticated UI animations and transitions |
| **Node.js** | JavaScript runtime environment for the backend |
| **Express.js** | Fast, unopinionated web framework for the RESTful API |
| **MongoDB & Mongoose** | NoSQL database and Object Data Modeling (ODM) library |
| **Google Gemini API** | Large Language Model (LLM) powering all core AI functionality |
| **Zod** | TypeScript-first schema declaration and data validation for AI outputs |
| **JWT & bcryptjs** | Secure stateless authentication and password hashing |
| **Recharts** | Composable charting library for visualizing fitness progress |

---

## 📁 Project Structure

```text
KinetiqAI/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main route views (Dashboard, AICoach, Workout, Nutrition, etc.)
│   │   ├── App.jsx             # Root component and React Router configuration
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── ai/                 # Gemini API integration, prompt templates, & failover logic
│   │   ├── config/             # Environment & Database configurations
│   │   ├── controllers/        # Request handlers (AI, Workout, Nutrition, Auth)
│   │   ├── middleware/         # Auth verification and rate limiters
│   │   ├── models/             # Mongoose schemas (User, Profile, WorkoutPlan, MealLog, etc.)
│   │   ├── routes/             # Express API route definitions
│   │   └── utils/              # Calculation helpers and custom error handling
│   ├── .env                    # Environment variables (API Keys, Secrets)
│   ├── package.json
│   └── server.js               # Express application entry point
│
└── README.md
```

---

## 👨‍💻 Author

**Yash Kashyap**
- **LinkedIn**: [https://www.linkedin.com/in/yash-kashyap-3a8a2524b/](https://www.linkedin.com/in/yash-kashyap-3a8a2524b/)
- **Portfolio**: [https://yash-portfoliov2.vercel.app/](https://yash-portfoliov2.vercel.app/)

---
*Built with modern web technologies and state-of-the-art Generative AI.*
