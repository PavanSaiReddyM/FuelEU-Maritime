# ⚓ Fuel EU Compliance Dashboard

A **full-stack web application** for calculating and managing **Fuel EU Maritime compliance** metrics for ships.  
It enables shipping companies to track, bank, and pool compliance balances (CB) based on greenhouse gas (GHG) intensity and energy consumption.

---

## 🌍 Features

✅ **Compliance Balance (CB)** calculation per ship and year  
✅ **Banking** — store surplus CB for future years  
✅ **Pooling** — balance deficits between ships automatically  
✅ **Persistent storage** via **Neon PostgreSQL + Prisma ORM**  
✅ **Frontend UI** built with React + Axios + Tailwind + Sonner (toasts)

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

The project follows **Hexagonal Architecture (Ports & Adapters)** to ensure modularity, testability, and clear separation of concerns.

| Layer | Responsibility | Example Components |
|--------|----------------|--------------------|
| **Domain** | Core business entities and logic | `Route`, `Compliance` |
| **Application / Service** | Implements business workflows | `ComplianceService`, `PoolService` |
| **Ports / Interfaces** | Contracts for persistence & APIs | `ComplianceRepositoryPort` |
| **Adapters** | Concrete implementations for DB & HTTP | `CompliancePostgresAdapter`, `ExpressController` |
| **Infrastructure** | Frameworks, database, and API setup | `Express`, `Prisma`, `Axios`, `Tailwind` |

🧩 **Benefits:**  
- Independent domain logic  
- Replaceable DB or API adapters  
- Testable business rules  
- Framework-agnostic core  

---

## 🚀 Backend Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/fuel-eu-maritime-compliance.git
cd fuel-eu-maritime-compliance/backend
