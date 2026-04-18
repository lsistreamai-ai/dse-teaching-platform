# DSE Teaching Platform

A teaching platform for Hong Kong DSE curriculum with AI-powered tools.

## Features

- 👤 **User Types**: Teacher/Student with simple dashboards
- 📚 **Resources**: DSE-aligned subjects (EDB curriculum), easy search & filter
- 🤖 **AI Tools**:
  - Lesson Plan Generator
  - Presentation Maker
  - Quiz Generator (DSE-style)
  - Smart Marking Tool
- 🔀 **MERGE TOOL**: Cross-subject collaboration

## Quick Start

### Start Backend (Terminal 1):
```bash
cd ~/workspace/dse-teaching-platform/server
npm start
```
Server runs on: http://localhost:5000

### Start Frontend (Terminal 2):
```bash
cd ~/workspace/dse-teaching-platform/client
npm run dev
```
App runs on: http://localhost:3000

## Tech Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: SQLite (PostgreSQL-ready)
- **Auth**: JWT tokens

## DSE Subjects Supported

Chinese Language, English Language, Mathematics, Physics, Chemistry, Biology, Economics, History, Geography, Chinese History, ICT, BAFS, and more.

---

Built for Patrick Siu | Language Services International (PET) Ltd.
