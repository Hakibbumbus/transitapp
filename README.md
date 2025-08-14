# Calgary Transit Management System

A real-time transit management system built with Node.js, Express, Socket.IO, and Google Maps API. Track vehicles, manage routes, and monitor transit operations in real-time.

## Live Demo

[View live application](https://your-deployed-app-url.com)

## Screenshot

<!-- Add your screenshot here: ![Application Screenshot](path/to/your/screenshot.png) -->

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
