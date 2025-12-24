# ✨ Stellar Memories

https://memory-galaxy-canvas.lovable.app

A beautiful, interactive web application that transforms your cherished memories into constellations in the night sky. Each memory becomes a star, connected by the threads of your experiences.

![Stellar Memories](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-teal) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

Tranform your memories into beautiful stars in sky
<img width="800" height="900" alt="friendship-day-2025-poster" src="https://github.com/user-attachments/assets/e5aafa5e-5035-41fa-a1ee-d61f8d1b252f" />


## 🌟 Features

### Core Features
- **Memory Constellations** - Upload photos and create personalized constellations from your memories
- **Interactive Star Map** - Pan, zoom, and explore your memory universe with smooth animations
- **Mood Tracking** - Tag memories with emotions (Happy, Calm, Energetic, Reflective, Romantic) and visualize patterns
- **3D Constellation View** - Experience your memories in an immersive 3D environment
- **Multiple Constellation Patterns** - Choose from various patterns (Orion, Ursa Major, Cassiopeia, and more)

### Additional Features
- **Timeline View** - Browse memories chronologically
- **Statistics Dashboard** - Insights into your memory patterns and emotions
- **Downloadable Posters** - Export your constellations as beautiful artwork
- **Ambient Sound** - Optional cosmic soundscape for immersive experience
- **Photo Booth** - Capture moments directly within the app
- **Asteroid Dodge Game** - A fun mini-game with keyboard controls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎮 Controls

### Constellation Canvas
- **Mouse Drag** - Pan around the star map
- **Scroll Wheel** - Zoom in/out
- **Click on Star** - View memory details

### Asteroid Dodge Game
- **← → Arrow Keys** - Move spaceship left/right
- **↑ Arrow Key** - Increase speed
- **↓ Arrow Key** - Decrease speed
- **Mouse/Touch** - Direct control on mobile

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Drei
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **State Management**: TanStack React Query
- **Charts**: Recharts

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, backgrounds)
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── Star.tsx     # Individual star component
│   ├── ConstellationCanvas.tsx
│   ├── ConstellationLines.tsx
│   ├── AsteroidDodgeGame.tsx
│   └── ...
├── hooks/           # Custom React hooks
│   ├── useConstellations.ts
│   ├── useZoomPan.ts
│   └── ...
├── pages/           # Route pages
│   ├── Landing.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── lib/             # Library configurations
```

## 🎨 Design System

The app uses a cosmic-themed design system with:
- **Colors**: Deep space backgrounds with luminous accents
- **Animations**: Twinkling stars, smooth transitions, parallax effects
- **Typography**: Space Grotesk display font with system sans-serif
- **Mood Colors**: Each emotion has a unique color palette

## 📱 Mobile Support

Fully responsive design with:
- Touch-optimized interactions
- Mobile-friendly navigation
- Adaptive layouts for all screen sizes

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📄 License

This project is open source and available under the MIT License.

---

Built with 💜 using [Lovable](https://lovable.dev)
