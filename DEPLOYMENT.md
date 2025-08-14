# Deployment Guide

## Quick Deploy to Railway (Recommended)

1. **Fork this repository** to your GitHub account

2. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

3. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your forked repository
   - Choose the `transit-management-system` folder as the root

4. **Set Environment Variables**
   - In Railway dashboard, go to your project
   - Click on "Variables" tab
   - Add: `GOOGLE_MAPS_API_KEY` with your API key value
   - Railway will automatically set the `PORT` variable

5. **Get your Google Maps API Key** (if you don't have one)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable "Maps JavaScript API" and "Places API"
   - Create an API Key
   - Restrict the API key to your Railway domain for security

6. **Your app is live!**
   - Railway will give you a URL like `https://your-app-name.railway.app`
   - Update the README.md with your live demo URL

## Alternative: Deploy to Render

1. Fork this repository
2. Go to [render.com](https://render.com)
3. Create new Web Service from GitHub
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variable: `GOOGLE_MAPS_API_KEY`

## Security Checklist

- ✅ API key is stored as environment variable
- ✅ Sensitive files are in .gitignore
- ✅ No secrets in source code
- ✅ Google Maps API key restrictions set up

## After Deployment

1. Test all features on your live site
2. Update README.md with your live demo URL
3. Share your project with others!

## Troubleshooting

- **Map not loading**: Check your Google Maps API key is correctly set
- **App won't start**: Check Railway/Render logs for error messages
- **Features not working**: Ensure all environment variables are set