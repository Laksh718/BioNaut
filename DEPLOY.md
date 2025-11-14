# 🚀 Deploying BioNaut

BioNaut is designed to work out-of-the-box on deployment platforms like Vercel, Netlify, or any static hosting service.

## Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Laksh718/BioNaut)

1. Click the button above or go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the Vite configuration
4. Click "Deploy"
5. Done! Your app is live 🎉

## Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Laksh718/BioNaut)

1. Click the button above or go to [Netlify](https://netlify.com)
2. Import your GitHub repository
3. Netlify will use the `netlify.toml` configuration
4. Click "Deploy"
5. Done! Your app is live 🎉

## Environment Variables (Optional)

BioNaut works in intelligent fallback mode without any configuration. However, you can optionally connect to backend services:

### For Full Features (Optional):

Set these environment variables in your deployment platform:

```env
VITE_API_URL=https://your-backend-api.com
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### How to Set Environment Variables:

**Vercel:**

1. Go to Project Settings → Environment Variables
2. Add variables
3. Redeploy

**Netlify:**

1. Go to Site Settings → Environment Variables
2. Add variables
3. Trigger a redeploy

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build the app
npm run build

# The dist folder contains your production build
# Upload it to any static hosting service
```

## How It Works

BioNaut is intelligent and flexible:

✅ **No API?** - Works in demo mode with sample data
✅ **API Connected?** - Uses real-time NASA research data
✅ **Always Available** - Never breaks, always functional

The app automatically detects available services and adapts accordingly!

## Features by Mode

### Demo Mode (No API)

- ✅ Full UI functionality
- ✅ Sample recommendations
- ✅ Interactive visualizations
- ✅ All features accessible

### Connected Mode (With API)

- ✅ Everything from Demo Mode
- ✅ Real NASA research data
- ✅ Live search results
- ✅ Real-time recommendations

## Need Help?

The app works perfectly without any configuration. Deploy it and start exploring space biology research!

---

**That's it! BioNaut is designed to just work. Deploy and enjoy! 🚀**
