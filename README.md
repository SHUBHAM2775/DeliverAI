# DeliverAI

DeliverAI is a full-stack delivery management system designed to optimize driver assignment, route planning, and time-slot based deliveries. It provides role-based dashboards for Admin, Sender, and Driver, supports geocoding of addresses, and offers installable PWA capabilities with an offline shell.

## Project Description

### Problem Statement

Manual dispatching and static delivery workflows lead to inefficient routing, delayed deliveries, and poor visibility across operations. Traditional systems struggle to handle dynamic driver availability and accurate time-slot commitments.

### Objective

Enable customized time-slot delivery with intelligent driver selection, geo-aware routing, and clear operational visibility for all roles.

## Key Features

### Admin

- Monitor live operations and delivery throughput
- Track driver availability and status
- Access analytics and performance dashboards

### Sender

- Create deliveries using string-based addresses
- Select preferred delivery time slots
- Track order status and driver assignment

### Driver

- Receive delivery requests based on proximity
- Accept/decline assignments
- Update delivery status (Delivered/Failed)

### Platform Capabilities

- Geocoding of string addresses to latitude/longitude
- Top 5 nearest-driver selection logic
- Route optimization using Haversine distance
- Role-based authentication and dashboards
- Progressive Web App (PWA) with offline shell

## System Architecture (High Level)

- **Frontend:** Next.js App Router, TypeScript, PWA layer
- **Backend:** Node.js API routes (REST)
- **Database:** MongoDB with Mongoose
- **Services:** Geocoding API, driver distance engine, notifications

## Route Optimization Logic

- Drivers are ranked by distance to the pickup location.
- **AVAILABLE** drivers are scored by distance from current location to pickup.
- **ON_ROUTE** drivers are scored by remaining distance to current drop, then to the new pickup.
- The top 5 closest drivers receive the request; the first to accept gets assigned.
- Distances are calculated using the Haversine formula (conceptual great-circle distance).

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript (TSX), Tailwind CSS
- **Backend:** Node.js API routes
- **Database:** MongoDB, Mongoose
- **Auth:** Role-based login with phone + password
- **Maps & Geo:** Geocoding API, Haversine distance
- **PWA:** Web App Manifest, installable offline shell

## Folder Structure (High Level)

```
app/                Frontend pages and API routes
components/         Shared UI components
lib/                DB, geocoding, distance, optimization logic
models/             Mongoose schemas
public/             Static assets and PWA icons
python/             ML-based slot recommendations (FastAPI)
services/           External services (email, SMS)
store/              State management
```

## Getting Started

### Install Dependencies

- `npm install`

### Run Locally

- `npm run dev`

### Optional: Run ML Slot API

- Start the Python server from the python folder
- Ensure `PYTHON_API_URL` points to the running service

## PWA Support

- Installable from supported browsers
- Offline shell for core navigation and UI
- Manifest and icons stored in public

## Roles & Access Flow

1. **Sender** creates an order with an address and slot preference.
2. Address is geocoded to latitude/longitude.
3. Driver optimization selects top 5 nearest drivers.
4. **Driver** accepts the request and updates status.
5. **Admin** monitors progress and operational metrics.

## License

This project is provided for educational and hackathon use. See the license file if available.
