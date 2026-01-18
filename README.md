# B. Arul - Full-Stack Software Engineer Portfolio

A modern, responsive portfolio website showcasing professional experience, projects, and skills.

## 🚀 Live Demo

**[View Live Portfolio](https://arul5780.github.io/portfolio/)** ✨

Deployed on GitHub Pages

## ✨ Features

- 🎨 Stunning dark/light theme with particle animations
- 📱 Fully responsive design
- 🖼️ AI-generated project visualizations
- 📧 Working contact form with EmailJS integration
- ⚡ Smooth scroll animations with Framer Motion
- 🎯 Interactive project cards with hover effects
- 📄 Professional profile photo section
- 🔔 Toast notifications for user feedback
- ⬆️ Scroll-to-top button
- 💾 Theme preference persistence

## 🛠️ Built With

- **React 18** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **EmailJS** - Contact form
- **React Hot Toast** - Notifications
- **TailwindCSS** (via CDN) - Styling

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### GitHub Pages

```bash
# Build and deploy
npm run deploy
```

### Other Platforms

- **Vercel**: `npm run deploy:vercel`
- **Netlify**: `npm run deploy:netlify`

## 📧 EmailJS Configuration

To enable the contact form:

1. Create account at [EmailJS.com](https://emailjs.com)
2. Set up email service
3. Create email template
4. Replace placeholders in `src/App.jsx`:
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY`

## 📝 Customization

### Add Your Resume

Replace `/public/resume.pdf` with your actual resume PDF.

### Update Social Links

Edit links in `src/App.jsx`:

- Email: Line ~1110
- LinkedIn: Line ~1122
- Phone: Line ~1138

### Change Project Images

Replace images in `/public/images/`:

- `profile.png`
- `project-insurance.png`
- `project-task.png`
- `project-hotel.png`
- `project-event.png`

## 📂 Project Structure

```
portfolio/
├── public/
│   ├── images/          # Profile & project images
│   └── resume.pdf       # Your resume
├── src/
│   ├── App.jsx          # Main component
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── App.css          # Component styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## 🎨 Color Scheme

- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#a855f7)
- **Accent**: Pink (#ec4899)
- **Dark Background**: Slate (#0f172a)
- **Light Background**: Gray (#f9fafb)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**B. Arul**

- LinkedIn: [arul-balasundaram](https://www.linkedin.com/in/arul-balasundaram-0052a1246)
- Email: arul5780612@gmail.com
- Location: Coimbatore, Tamil Nadu, India

## 🙏 Acknowledgments

- Project images generated with AI
- Icons from Lucide React
- Animations powered by Framer Motion
- Built with React and Vite

---

⭐ **Star this repo if you find it helpful!**
