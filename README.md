# DriftDiaries 🌍✈️

## My Journey Through Full-Stack Development

Hi! I'm Aryan, and this is DriftDiaries - a project that combines my passion for travel with my journey in learning React and modern web development. This application allows users to track their travel adventures by creating personalized travel logs with photos and stories for each city they visit.

### What DriftDiaries Does 🗺️

DriftDiaries is more than just a travel diary - it's an interactive platform where you can:
- Mark cities you've visited on an interactive map
- Create photo stories for each location
- View your travel statistics by cities and countries
- Share your travel experiences with a rich, visual interface

### Tech Stack 🛠️

Building DriftDiaries has been an exciting learning experience. Here's what I used:

**Frontend:**
- React 19 (RC) with the latest features
- React Router v7 for seamless navigation
- Leaflet.js for interactive maps
- CSS Modules for styled components
- React Context for state management

**Backend & Authentication:**
- Supabase for backend services
- Google OAuth integration
- Custom email/password authentication
- Secure user sessions and profile management

**Deployment & Infrastructure:**
- Vite for development and building
- Vercel for hosting and deployment
- Environment variable management
- Image optimization and caching

### Learning Highlights 📚

Throughout this project, I learned:
1. Setting up a modern React application from scratch
2. Implementing secure authentication flows
3. Working with map integrations
4. Managing complex state with Context API
5. Handling image uploads and optimization
6. Deploying and maintaining a full-stack application

### Local Development 💻

Want to run DriftDiaries locally? Here's how:

```bash
# Clone the repository
git clone https://github.com/yourusername/drift-diaries.git

# Install dependencies
cd drift-diaries
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables 🔐

You'll need these environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Project Structure 📁

```
drift-diaries/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and API clients
│   ├── pages/         # Route components
│   └── styles/        # Global styles and CSS modules
└── ...
```

### Future Improvements 🚀

I'm continuously working on improving DriftDiaries. Here's what's next:
- Social features for connecting travelers
- Enhanced photo gallery capabilities
- Travel statistics and insights
- Mobile app development
- Performance optimizations

### Challenges & Solutions 💡

Building DriftDiaries came with its share of challenges. Here are some key problems I solved:

1. **Photo Management:**
   - Implemented client-side image optimization
   - Set up secure cloud storage with Supabase
   - Created a smooth upload experience

2. **Authentication:**
   - Built a secure auth flow with multiple providers
   - Managed user sessions effectively
   - Protected routes and data

3. **Map Integration:**
   - Optimized map performance
   - Handled location data accurately
   - Created an intuitive user interface

### Live Demo 🌐

Try DriftDiaries here: [https://drift-diaries.vercel.app](https://drift-diaries.vercel.app)

### Contributing 🤝

While this is primarily a learning project, I welcome suggestions and feedback! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Share your thoughts and ideas

### Contact 📫

Got questions or want to connect? Reach out!
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: kalluri.aryan16@gmail.com

### License 📄

This project is MIT licensed. See the LICENSE file for details.

---

Built with ❤️ by Aryan while learning React and modern web development.
