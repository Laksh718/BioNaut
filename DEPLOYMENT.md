# Deployment Guide for BioNaut Frontend

This guide provides instructions for deploying the BioNaut frontend application to various hosting platforms.

## Prerequisites

1. **Backend API Deployed**: Ensure your backend API is deployed and accessible
2. **Environment Variables**: Prepare your environment variables
3. **Build Assets**: The application needs to be built before deployment

## Environment Variables

You need to set the following environment variables for deployment:

```env
VITE_API_URL=https://your-backend-api-url.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUMMARIZER_API_URL=https://summarizer-model.onrender.com
```

**Important Notes:**

- `VITE_API_URL`: Must point to your deployed backend API (NOT localhost)
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI features
- `VITE_SUMMARIZER_API_URL`: External summarizer service URL (already configured)

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure environment variables in Settings → Environment Variables
   - Deploy

3. **Deploy via CLI**:

   ```bash
   vercel
   ```

4. **Configure Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all required environment variables
   - Redeploy the project

**vercel.json** (already configured in this repo):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

1. **Install Netlify CLI** (optional):

   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via Netlify Dashboard**:

   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Configure environment variables in Site settings → Environment variables
   - Deploy

3. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```

**netlify.toml** (already configured in this repo):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Update vite.config.js**:
   Add base path:

   ```javascript
   export default defineConfig({
     base: "/your-repo-name/",
     // ... rest of config
   });
   ```

2. **Deploy**:

   ```bash
   npm run build
   npm run deploy
   ```

3. **Add deploy script** to package.json:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

### Option 4: AWS Amplify

1. **Connect via AWS Console**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Add environment variables
   - Deploy

### Option 5: Render

1. **Create a new Static Site**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in Environment section
   - Deploy

## Fallback Mode

The application includes a **fallback mode** that activates when the backend API is unavailable:

- ✅ Shows sample recommendations
- ✅ Provides demo data for testing
- ✅ Displays a notice indicating demo mode
- ✅ Maintains UI functionality

This ensures the application remains functional even if:

- Backend API is down
- Network connectivity issues
- CORS problems
- API endpoint changes

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads successfully
- [ ] API connection works (no "Demo Mode" notice)
- [ ] Environment variables are correctly set
- [ ] All pages are accessible
- [ ] Search functionality works
- [ ] Recommendations load properly
- [ ] AI features are working (with valid Gemini API key)
- [ ] No console errors in browser developer tools

## Troubleshooting

### Recommendations Not Working

**Symptoms:**

- "Demo Mode Active" notice appears
- Showing sample data instead of real recommendations

**Solutions:**

1. **Check API URL**:

   ```bash
   # Verify your environment variable is set correctly
   echo $VITE_API_URL
   ```

   Make sure it points to your deployed backend, not localhost

2. **Verify Backend API**:

   - Test your API endpoint: `https://your-api-url.com/health`
   - Check CORS settings on backend
   - Ensure API is running and accessible

3. **Check Environment Variables**:

   - In Vercel: Settings → Environment Variables
   - In Netlify: Site settings → Environment variables
   - In Render: Environment section
   - Make sure to **redeploy** after changing variables

4. **Test API Connection**:
   Open browser console (F12) and check for:
   ```
   API Base URL: https://your-api-url.com
   ```
   If it shows `localhost:8000`, environment variables aren't loaded

### Build Failures

1. **Clear cache and rebuild**:

   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **Check Node version**:

   ```bash
   node --version  # Should be 16+
   ```

3. **Check for TypeScript errors**:
   ```bash
   npm run lint
   ```

### CORS Errors

If you see CORS errors in the console:

1. **Backend must allow your frontend domain**:

   ```python
   # In your FastAPI backend
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend-domain.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Use environment variables** for dynamic origins:
   ```python
   FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
   allow_origins=[FRONTEND_URL]
   ```

### Environment Variables Not Loading

1. **Prefix must be VITE\_**:

   ```env
   VITE_API_URL=...  # ✅ Correct
   API_URL=...       # ❌ Wrong - won't be loaded
   ```

2. **Rebuild after changing .env**:

   ```bash
   npm run build
   ```

3. **Deployment platforms**: Add variables in platform settings, not .env file

## Backend API Deployment

For the backend API, you can use:

1. **Render** (recommended for Python/FastAPI)
2. **Railway**
3. **Heroku**
4. **AWS EC2**
5. **Google Cloud Run**

Make sure to:

- Set up Python environment
- Install dependencies from `requirements_api.txt`
- Configure CORS for your frontend domain
- Set up environment variables
- Use production ASGI server (uvicorn, gunicorn)

## Performance Optimization

1. **Enable compression** on your hosting platform
2. **Use CDN** for static assets
3. **Configure caching** headers
4. **Minimize bundle size**:
   ```bash
   npm run build -- --mode production
   ```

## Security Considerations

1. **Never commit .env files** with real API keys
2. **Use environment variables** for all secrets
3. **Enable HTTPS** on deployment
4. **Set up security headers** (CSP, HSTS, etc.)
5. **Regularly update dependencies**:
   ```bash
   npm audit fix
   ```

## Monitoring

Set up monitoring for:

- Application uptime
- API response times
- Error rates
- User analytics (optional)

Recommended tools:

- Vercel Analytics (built-in for Vercel)
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

## Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Review deployment logs on your platform
3. Test API endpoints directly
4. Open an issue on GitHub with error details

---

**Built with ❤️ for space biology research**
