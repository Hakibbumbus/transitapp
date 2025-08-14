# Calgary Transit Management System

A real-time transit management system built with Node.js, Express, Socket.IO, and Google Maps API. Track vehicles, manage routes, and monitor transit operations in real-time.

## Live Demo

[View live application](https://your-deployed-app-url.com)

## Screenshot

![Application Screenshot](https://private-user-images.githubusercontent.com/72481142/477795359-6cbd8fda-fe35-42df-aabc-79b7e8aea9fe.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTUxMzMwODQsIm5iZiI6MTc1NTEzMjc4NCwicGF0aCI6Ii83MjQ4MTE0Mi80Nzc3OTUzNTktNmNiZDhmZGEtZmUzNS00MmRmLWFhYmMtNzliN2U4YWVhOWZlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODE0VDAwNTMwNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThiMWY2ZmEzNGJiN2Y1NmE4OWQ4ZTFhODNkZjNkZWQxYjYzOTNmNzQyMjNmM2E2N2EyMDU1YWM4OWZlZTdmNTcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.3S5sqjdm0_1oyPfUOw7SuTamMFDqSSSnrgN7M0uZv2g)

## Features

- Real-time vehicle tracking on interactive map
- WebSocket-powered live updates across all clients
- Vehicle management (add, update, delete, status changes)
- Automatic route calculation between addresses
- Calgary-focused mapping with location restrictions
- Responsive design for desktop and mobile

## Technologies

- Backend: Node.js, Express.js, Socket.IO
- Frontend: Vanilla JavaScript, HTML5, CSS3
- Maps: Google Maps JavaScript API
- Real-time: WebSockets
- Storage: JSON file-based

## Prerequisites

- Node.js (v14+)
- Google Maps API Key

## Local Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Hakibbumbus/transitapp.git
   cd transitapp/transit-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google Maps API key:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Run the application
   ```bash
   npm start
   ```

5. Open browser to `http://localhost:5000`

## Deployment

### Railway (Recommended)
1. Fork this repository
2. Sign up at [Railway](https://railway.app)
3. Deploy from GitHub
4. Set environment variable: `GOOGLE_MAPS_API_KEY`

### Alternative Platforms
- **Render**: Deploy as Web Service, set build/start commands
- **Heroku**: Use Heroku CLI with environment variables

## Project Structure

```
transit-management-system/
├── public/          # Client-side files
├── data/           # Data storage (gitignored)
├── server.js       # Main server
├── package.json    # Dependencies
└── .env.example    # Environment template
```

## Usage

- Add vehicles using the sidebar form
- View real-time tracking on the map
- Manage vehicle status and properties
- All changes sync across connected clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
