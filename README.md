#  BioNaut - NASA Space Biology AI Assistant

A cutting-edge web application that combines NASA's space biology research data with advanced AI capabilities powered by Google's Gemini AI. Features beautiful animations, enhanced UI components, intelligent analytics, and a professional 3D Library system.

##  Features

###  **Enhanced Search Experience**

- **Semantic Search**: Advanced search powered by NASA's research database
- **AI-Powered Insights**: Generate intelligent analysis using Gemini AI
- **Animated UI**: Smooth transitions and micro-interactions with Framer Motion
- **Smart Filters**: Filter by source type, year range, and more
- **Real-time Results**: Instant search with loading animations

###  **Advanced Analytics**

- **Enhanced Trend Analysis**: AI-powered insights into research patterns
- **Interactive Charts**: Beautiful data visualizations
- **Research Metrics**: Key statistics and performance indicators
- **Forecast Capabilities**: Predictive analysis (coming soon)

###  **AI-Powered Features**

- **Gemini AI Integration**: Advanced language model for research analysis
- **Intelligent Summaries**: AI-generated research summaries
- **Smart Recommendations**: Personalized research suggestions
- **Research Insights**: Deep analysis of search results and trends

### **Modern UI/UX**

- **Framer Motion Animations**: Smooth, professional animations
- **Responsive Design**: Works perfectly on all devices
- **NASA-Inspired Theme**: Professional space-themed design
- **Enhanced Components**: Beautiful, interactive UI elements
- **Dark/Light Mode Ready**: Flexible theming system

### **3D Library System**

- **Interactive 3D Visualization**: Professional Three.js-powered library
- **Research Categories**: Biology, Space, and Research topics
- **API Integration**: Live data from NASA research database
- **Professional Design**: Clean, educational interface
- **Research Statistics**: Real study counts and metrics

##  Technology Stack

### Frontend

- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Lucide React**: Beautiful, customizable icons
- **Three.js**: 3D graphics library for interactive visualizations

### AI Integration

- **Google Gemini AI**: Advanced language model for research analysis
- **Custom AI Service**: Intelligent research insights and recommendations

### Backend Integration

- **NASA Bionauts API**: Official NASA space biology research database
- **FastAPI**: High-performance Python API
- **CORS Support**: Cross-origin resource sharing enabled

##  Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ (for API server)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Laksh718/BioNaut.git
   cd BioNaut
   ```

2. **Set up the API server**

   ```bash
   # Clone the Bionauts API
   git clone https://github.com/Krishdshah/bionauts.git
   cd bionauts/nasa_spacebio_ai

   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements_api.txt
   pip install faiss-cpu

   # Start the API server
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Set up the frontend**

   ```bash
   # In a new terminal, navigate to frontend
   cd bionauts-frontend

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### API Configuration

The Gemini API key is already configured in the code. For production, move it to environment variables.

## Usage

### Search Interface

1. **Enter your research query** in the search box
2. **Apply filters** to narrow down results
3. **Click Search** to find relevant research
4. **Generate AI Insights** for deeper analysis

### Enhanced Features

- **Toggle Enhanced UI**: Use the checkbox in the header to switch between standard and enhanced components
- **AI Insights Tab**: Dedicated section for AI-powered analysis
- **Enhanced Trends**: Advanced trend analysis with AI insights
- **Smart Recommendations**: Personalized research suggestions
- **3D Library**: Interactive research library with professional design

### Example Queries

- "microgravity effects on bone density"
- "plant growth experiments on ISS"
- "immune system response in astronauts"
- "radiation exposure studies"
- "stem cell research in space"

## UI Components

### Enhanced Components

- **EnhancedSearchResults**: Animated search results with AI insights
- **EnhancedTrendAnalysis**: Advanced analytics with AI integration
- **EnhancedRecommendations**: Smart recommendations with AI
- **AIInsights**: Modal for AI-powered analysis
- **LoadingSpinner**: Beautiful animated loading states
- **Library3D**: Professional 3D library visualization

### Animations

- **Page Transitions**: Smooth tab switching
- **Hover Effects**: Interactive button and card animations
- **Loading States**: Animated spinners and progress indicators
- **Micro-interactions**: Subtle animations for better UX

## 🔬 API Integration

### NASA Bionauts API Endpoints

- `/search`: Semantic search functionality
- `/summarize`: AI-powered summarization
- `/trend/summary`: Research trend analysis
- `/recommendations/query`: Query-based recommendations
- `/recommendations/record`: Record-based recommendations
- `/health`: API health check

### Gemini AI Integration

- **Research Analysis**: Deep insights into search results
- **Trend Analysis**: AI-powered trend interpretation
- **Recommendations**: Personalized research suggestions
- **Enhanced Summaries**: Intelligent research summaries

##  Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### API Deployment

```bash
# Install production dependencies
pip install -r requirements_api.txt

# Run with production server
uvicorn api:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **NASA**: For providing the space biology research database
- **Google**: For the Gemini AI capabilities
- **Bionauts Team**: For the original API implementation
- **Framer Motion**: For the beautiful animation library
- **Tailwind CSS**: For the utility-first CSS framework
- **Three.js**: For the 3D graphics capabilities

## Support

For support, email support@bionaut.com or create an issue in the repository.

---

**Built with ❤️ for space biology research**
