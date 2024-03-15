# Event-app
Event-app is an application that allows users to easily find events in the Helsinki area. 
Events can be searched for based on the user's location or given location, the user can manually search for events by date, keyword, or category.

By logging in the user can also like events and sign up to participate with a simple button press.
The application is designed for individuals who want to easily discover various events in the Helsinki area and see if there are any interesting events nearby. Event-app is also suitable for users who want to create their own events for others to discover.

## Try it out here:
https://blue-hill-0d73d0b03.4.azurestaticapps.net/

## Pictures and functionalities of event-app
### Homepage featuring Liked Events and Planned Attendances
See featured events, events you are attending and your liked events at the front page. 
![image](https://github.com/siljamat/event-app/assets/104358542/45371276-3793-44cb-ba11-3dd6dc9e2db9)

### Homepage for users that are not logged in
![image](https://github.com/siljamat/event-app/assets/104358542/e05cac1c-c1b8-48ae-bed2-cb19834562f5)

### Event page
See the details of an event and like/attend it.
![image](https://github.com/siljamat/event-app/assets/104004445/b20598ea-8c11-482a-9d31-52c8a9b9c491)

### Close to you page
See list of events that are close to you or anywhere by zooming in on the map
![image](https://github.com/siljamat/event-app/assets/104004445/3667858c-b264-43a3-a07f-e9b32b0921e3)

### User account page
Update your user info at my Account page. You can also see your own events and liked events. See events you plan on attending here as well.
![image](https://github.com/siljamat/event-app/assets/104004445/4d7effbc-f239-48be-9e13-ed96375916c9)


### Search page
Search for events by category, keyword or date.
![image](https://github.com/siljamat/event-app/assets/104004445/8d4af435-63c6-4517-a3f0-d91311b05feb)

### Create event
You can also create your own event by filling up the form with all neccessary info.

### Edit your events
Edit your own events at your userEvents page by clicking the edit event button.

### Delete your own events
Delete your events at your userEvents page by clickin the delete button.
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
