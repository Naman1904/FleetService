# FleetLink

FleetLink is a vehicle management and booking application. It includes a React frontend, an Express API, and MongoDB for storing users, vehicles, and bookings.

## Features

- Register and log in to a customer account.
- Add vehicles with a name, load capacity, and tyre count.
- Search for vehicles by required capacity, route pincodes, and start time.
- Create bookings while checking for overlapping bookings.
- View bookings associated with the signed-in account.

## Requirements

- Node.js 18 or later and npm for local development.
- Docker Desktop or Docker Engine with Docker Compose for the containerized setup.
- MongoDB for local development and backend tests if MongoDB is not started with Docker.

## Run with Docker Compose

From the project root, build and start the frontend, backend, and MongoDB:

```sh
docker compose up --build
```

If your installation uses the legacy Compose command, use `docker-compose up --build` instead. The first build may take a few minutes.

- Open the web application at [http://localhost:3000](http://localhost:3000).
- The API listens at [http://localhost:5000](http://localhost:5000). Its root health response is available at [http://localhost:5000/](http://localhost:5000/).
- MongoDB is exposed on port `27017`; Compose stores its data in the `mongo-data` volume.

Stop the services with `Ctrl+C`. To stop the containers when they were started in the background, run:

```sh
docker compose down
```

To remove the stored MongoDB data as well, run `docker compose down --volumes`. This permanently deletes the database volume.

## Run Locally

Use this setup to run the React app and API as separate development processes. Start MongoDB first, either locally on port `27017` or with `docker compose up -d mongo` from the project root.

1. In `backend/`, create a `.env` file with the database URL and a development JWT secret:

	```dotenv
	MONGO_URL=mongodb://localhost:27017/fleetlink
	JWT_SECRET=replace-with-a-long-random-value
	PORT=5000
	```

	`MONGO_URL` defaults to `mongodb://localhost:27017/fleetlink` and `PORT` defaults to `5000`, but setting `JWT_SECRET` avoids using the development fallback. Do not commit `.env` files.

2. In a terminal, install backend dependencies and start the API:

	```sh
	cd backend
	npm install
	npm run dev
	```

	The API starts at `http://localhost:5000` after it connects to MongoDB. Use `npm start` instead of `npm run dev` to run without the development file watcher.

3. In a second terminal, install frontend dependencies and start React:

	```sh
	cd frontend
	npm install
	npm start
	```

	The development server opens at `http://localhost:3000`. The frontend is configured to proxy API requests to `http://localhost:5000`.

## Use the Web App

1. Open `http://localhost:3000`.
2. Select **Register** and create an account with a username and password.
3. Select **Login** and sign in with that account.
4. Open **Add Vehicle** and enter a vehicle name, capacity in kilograms, and tyre count.
5. Open **Search & Book**, enter the required capacity, origin and destination pincodes, and a start time, then search for available vehicles.
6. Choose an available vehicle to create a booking. Open **My Bookings** to see bookings for the signed-in account.

Vehicle creation is available through the app without signing in. Booking creation and the **My Bookings** view require a signed-in account.

## API Reference

All request and response bodies use JSON. Routes are relative to `http://localhost:5000`.

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/` | None | API health response. |
| `POST` | `/api/auth/register` | None | Create an account. Body: `{"username":"sam","password":"example-password"}`. |
| `POST` | `/api/auth/login` | None | Log in; returns a JWT token and user object. Body uses `username` and `password`. |
| `POST` | `/api/vehicles` | None | Add a vehicle. Body: `{"name":"Truck A","capacityKg":1000,"tyres":6}`. |
| `GET` | `/api/vehicles/available` | None | Search using `capacityRequired`, `fromPincode`, `toPincode`, and `startTime` query parameters. |
| `POST` | `/api/bookings` | Bearer token | Book a vehicle. Requires `vehicleId`, `fromPincode`, `toPincode`, and `startTime`. |
| `GET` | `/api/bookings/me` | Bearer token | List bookings for the signed-in user. |
| `DELETE` | `/api/bookings/:id` | None | Delete a booking by its ID. |

For protected routes, send the login token in the header as `Authorization: Bearer <token>`. For example, the availability search can be called with:

```sh
curl "http://localhost:5000/api/vehicles/available?capacityRequired=1000&fromPincode=100001&toPincode=100010&startTime=2026-10-21T10:00:00.000Z"
```

## Run Backend Tests

The Jest tests connect to `mongodb://localhost:27017/fleetlink_test`. Ensure MongoDB is running on port `27017`, then run:

```sh
cd backend
npm install
npm test
```

The test suites drop the `fleetlink_test` database when they finish. Keep this test database separate from any data you need to retain.

## Configuration and Troubleshooting

- If the API exits with a MongoDB connection error, verify MongoDB is running and `MONGO_URL` points to the correct address. When using Compose, the backend is configured to connect to the `mongo` service automatically.
- If port `3000`, `5000`, or `27017` is already in use, stop the other process or change the relevant port configuration before starting FleetLink.
- The default JWT secret in the backend is for development only. Set a strong, private `JWT_SECRET` before deploying the application; use a production-grade MongoDB URL and do not expose database credentials.
