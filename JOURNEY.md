# Mandi Markt - Product Journey & Academic Research

This document tracks the technical and psychological evolution of Mandi Markt, serving as a record for Applied Psychology research and business portfolio development.

## 1. Project Initialization & Infrastructure
- **What we built**: Core Next.js 15 application structure with Tailwind CSS and TypeScript.
- **The technical challenge**: Setting up a modern, scalable frontend architecture that supports fast iterations while maintaining type safety.
- **The psychological 'User Friction'**: Reducing **Visual Noise**. By choosing a clean, utility-first styling approach (Tailwind), we ensure the interface remains uncluttered for users who may be overwhelmed by complex digital interfaces.

## 2. Backend & Real-time Sync (Convex)
- **What we built**: Integration of Convex for database and serverless functions.
- **The technical challenge**: Moving away from traditional REST/GraphQL to a reactive database model to ensure real-time data consistency across all clients.
- **The psychological 'User Friction'**: Reducing **Wait Anxiety**. Real-time sync ensures that shopkeepers see changes (like price updates or inventory) instantly, fostering trust in the digital system and reducing the stress of "is this up to date?".

## 3. PWA Capabilities
- **What we built**: Progressive Web App (PWA) configuration.
- **The technical challenge**: Configuring service workers and manifest files within the Next.js App Router environment for offline support and installability.
- **The psychological 'User Friction'**: Addressing **Connectivity Dread**. In markets with spotty internet, a PWA ensures the app remains functional, reducing the barrier to entry for users who fear losing work due to poor signals.
