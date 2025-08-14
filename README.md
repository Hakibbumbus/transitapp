# Calgary Transit Management System

A real-time transit management system built with Node.js, Express, Socket.IO, and Google Maps API. This web application allows you to track vehicles, manage routes, and monitor transit operations in real-time.

## 🚀 Live Demo

[Try the live demo here](https://your-deployed-app-url.com) *(will be updated after deployment)*

## ✨ Features

- **Real-time Vehicle Tracking**: Add, update, and track vehicles on an interactive map
- **Live Updates**: WebSocket-powered real-time updates across all connected clients
- **Interactive Map**: Google Maps integration with Calgary-focused mapping
- **Vehicle Management**: 
  - Add new vehicles with customizable properties
  - Update vehicle status, speed, and location
  - Delete vehicles from the system
- **Route Planning**: Automatic route calculation between start and end addresses
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Maps**: Google Maps JavaScript API
- **Real-time Communication**: WebSockets via Socket.IO
- **Data Storage**: JSON file-based storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key

## 🔧 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/transitapp.git
   cd transitapp/transit-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Maps API key:
   ```
   PORT=5000
   GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
   ```

4. **Get a Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Maps JavaScript API and Places API
   - Create credentials (API Key)
   - Add your domain to the API key restrictions for security

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 🚀 Deployment Options

### Option 1: Railway (Recommended)

1. Fork this repository to your GitHub account
2. Create account at [Railway](https://railway.app)
3. Connect your GitHub account
4. Deploy from GitHub repository
5. Add environment variables in Railway dashboard:
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `PORT`: Will be automatically set by Railway

### Option 2: Render

1. Create account at [Render](https://render.com)
2. Create new Web Service from GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variable: `GOOGLE_MAPS_API_KEY`

### Option 3: Heroku

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set GOOGLE_MAPS_API_KEY=your_key`
4. Deploy: `git push heroku main`

## 📁 Project Structure

```
transit-management-system/
├── public/                 # Client-side files
│   ├── index.html         # Main HTML file
│   ├── app.js             # Client-side JavaScript
│   ├── styles.css         # Styling
│   └── favicon.ico        # Site icon
├── data/                  # Data storage (ignored in git)
│   └── vehicles.json      # Vehicle data storage
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔒 Security Features

- API keys are stored as environment variables
- Google Maps API key is server-side injected (not exposed to client)
- Sensitive files are excluded from version control
- CORS protection enabled

## 🎯 Usage

1. **Adding Vehicles**: Use the sidebar form to add new vehicles with type, capacity, and route information
2. **Viewing on Map**: All vehicles appear as markers on the Calgary-focused map
3. **Real-time Updates**: Changes are instantly reflected across all connected browsers
4. **Vehicle Details**: Click on vehicles in the list or map markers for detailed information
5. **Status Management**: Update vehicle status (Active, Maintenance, Out of Service)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the existing issues for similar problems
- Ensure your Google Maps API key is properly configured

---

**Built with ❤️ for learning web development**
