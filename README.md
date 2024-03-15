# Event-app
Event-app is an application that allows users to easily find events in the Helsinki area without registering. Events can be searched for based on the user's location or given location, the user can manually search for events by date, keyword, or category. By logging in the user can also like events and sign up to participate with a simple button press.
The application is designed for individuals who want to easily discover various events in the Helsinki area and see if there are any interesting events nearby. Event-app is also suitable for users who want to create their own events for others to discover.

## Try it out here:
https://blue-hill-0d73d0b03.4.azurestaticapps.net/

## Pictures of Event-app and the functionalities
### Homepage featuring Liked Events and Planned Attendances
![image](https://github.com/siljamat/event-app/assets/104004445/236355cd-6ad1-4861-bf63-4cd105aad179)

### Homepage events
![image](https://github.com/siljamat/event-app/assets/104004445/4e26eaba-a780-45e6-a022-5cbea2ea1cdc)

### Event page
![image](https://github.com/siljamat/event-app/assets/104004445/b20598ea-8c11-482a-9d31-52c8a9b9c491)

### Close to you page
![image](https://github.com/siljamat/event-app/assets/104004445/3667858c-b264-43a3-a07f-e9b32b0921e3)

### User account page
![image](https://github.com/siljamat/event-app/assets/104004445/4d7effbc-f239-48be-9e13-ed96375916c9)

### Search page
![image](https://github.com/siljamat/event-app/assets/104004445/8d4af435-63c6-4517-a3f0-d91311b05feb)

## Installation & Setup

1. Clone both of these repositorys:
   
https://github.com/siljamat/event-app

https://github.com/valttku/event-app-auth-server

### Server Setup for event-app
1. navigate to `./backend`.
2. Create a `.env` file with details:
  
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=MongoDB_URL
JWT_SECRET=
AUTH_URL=http://localhost:3001/api/v1
GEO_KEY=APIKEY
```

3. Install server dependencies:

```bash
cd backend
npm install
```

### Client Setup

1. Event-app: navigate to `./frontend`.
2. Create a `.env` file with details:
  
```bash
VITE_AUTH_URL=http://localhost:3001/api/v1
VITE_MAP_API_KEY = APIKEY
VITE_API_URL=http://localhost:3000/graphql
```

3. Install Client Dependencies

```bash
cd frontend
npm install
```

### Running the Application

To start the server:

```bash
npm run dev
```

To start the client:

```bash
npm run dev
```

### Server Setup for Auth Server

1. Create a `.env` file with details:
  
```bash
NODE_ENV=development
PORT=3001
JWT_SECRET=
DATABASE_URL=MongoDB_URL
```
2. Install server dependencies:

```bash
npm install
```

### Running the Auth Server

```bash
npm run dev
```

Visit `localhost` in your browser to access the Event-app.
