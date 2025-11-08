# ⚓ Fuel EU Compliance Dashboard

A **full-stack web application** for calculating and managing **Fuel EU Maritime compliance** metrics for ships.  
It enables shipping companies to track, bank, and pool **Compliance Balances (CB)** based on greenhouse gas (GHG) intensity and energy consumption.

---

## 🌍 Features

✅ **Compliance Balance (CB)** calculation per ship and year  
✅ **Banking** — store surplus CB for future years  
✅ **Pooling** — balance deficits between ships automatically  
✅ **Persistent storage** via **Neon PostgreSQL + Prisma ORM**  
✅ **Frontend UI** built with **React + Axios + TailwindCSS + Sonner (toasts)**  

---

## 🔎 Overview

The **Fuel EU Compliance Dashboard** helps monitor vessel emissions relative to the **target GHG intensity** mandated by the FuelEU Maritime regulation.

| Module | Purpose |
|--------|----------|
| **Compliance Calculation** | Computes surplus or deficit for each vessel/year |
| **Banking** | Allows saving positive balances for future usage |
| **Pooling** | Enables redistribution of surplus across ships |
| **Persistent Storage** | Saves data in Neon PostgreSQL via Prisma ORM |

---

## 🧮 Core Compliance Formulas

| Metric | Formula |
|--------|----------|
| **Target GHG Intensity (2025)** | `89.3368 gCO₂e / MJ` |
| **Energy in Scope (MJ)** | `fuelConsumption × 41,000` |
| **Compliance Balance (CB)** | `(Target − ActualIntensity) × EnergyInScope` |
| **Interpretation** | Positive CB → Surplus <br> Negative CB → Deficit |

---

## 🏗️ Architecture (Hexagonal / Clean)

This project follows **Hexagonal Architecture (Ports & Adapters)** for modularity, testability, and framework independence.

| Layer | Responsibility | Example Components |
|--------|----------------|--------------------|
| **Domain** | Core business entities and logic | `Route`, `Compliance` |
| **Application / Service** | Business workflows | `ComplianceService`, `PoolService` |
| **Ports / Interfaces** | Contracts for persistence & APIs | `ComplianceRepositoryPort` |
| **Adapters** | Implementations for DB & HTTP | `CompliancePostgresAdapter`, `ExpressController` |
| **Infrastructure** | Framework, DB, and API setup | `Express`, `Prisma`, `Axios`, `Tailwind` |

🧩 **Benefits:**  
- Independent, reusable domain logic  
- Replaceable adapters (e.g., DB, API)  
- Easily testable core logic  
- Framework-agnostic architecture  

---

## 🚀 Quick Setup (Backend + Frontend)

Run **all setup steps** with the following commands 👇  

```bash
# 1️⃣ Clone the Repository
git clone https://github.com/<PavanSaiReddyM>/fuel-eu-maritime-compliance.git
cd fuel-eu-maritime-compliance

# 2️⃣ Install Dependencies for Backend and Frontend
cd backend && npm install
cd ../frontend && npm install
cd ..


# 6️⃣ Start Backend Server
npm run dev &
cd ../frontend

# 7️⃣ Start Frontend App
npm run dev
