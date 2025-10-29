# 🌌 Gigabase - Knowledge Nexus

> Your ultimate knowledge base powered by multiple verified APIs. Search and explore millions of articles with a beautiful, intuitive interface.

![Gigabase](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)

## ✨ Features

- 🔍 **Smart Search** - Search across millions of articles with intelligent autocomplete
- 📚 **Multiple Sources** - Aggregates content from Wikipedia, ArXiv, and more
- 🎨 **Beautiful UI** - Glassmorphism design with animated starfield background
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- ⚡ **Fast & Efficient** - Optimized performance with caching and lazy loading
- 🌙 **Theme Toggle** - Switch between light and dark modes
- 📄 **Quick Summary** - Get instant article summaries
- 🔗 **Related Content** - Discover related articles and topics
- 🖼️ **Rich Media** - High-quality images with optimized display
- 🎯 **Clean Navigation** - Intuitive breadcrumbs and internal linking

## 🚀 Live Demo

Visit the live application: [https://yesh00008.github.io/gigabase.in](https://yesh00008.github.io/gigabase.in)

## 🛠️ Technologies

This project is built with modern web technologies:

- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Icon system
- **React Router** - Client-side routing

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm installed - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

```bash
# Clone the repository
git clone https://github.com/yesh00008/gigabase.in.git

# Navigate to project directory
cd gigabase.in

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
gigabase.in/
├── public/              # Static assets
│   ├── favicon.svg     # Custom Gigabase favicon
│   └── robots.txt      # SEO configuration
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── SearchBar.tsx
│   │   └── StarField.tsx
│   ├── pages/         # Page components
│   │   ├── Home.tsx
│   │   ├── Article.tsx
│   │   ├── SearchResults.tsx
│   │   └── NotFound.tsx
│   ├── services/      # API integrations
│   │   ├── arxiv.ts
│   │   ├── github.ts
│   │   └── stackexchange.ts
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── index.css      # Global styles
└── package.json
```

## 🎨 Design Features

### Glassmorphism UI
- Semi-transparent backgrounds with blur effects
- Subtle borders and shadows
- Layered depth perception

### Animated Starfield
- 100 tiny white particles
- 5 fast-moving shooting stars
- Smooth canvas-based animation
- Twinkling effects

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interfaces
- Adaptive layouts

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Gigabase
VITE_API_CACHE_DURATION=300000
```

## 📚 API Integrations

- **Wikipedia API** - Article content and images
- **ArXiv API** - Related research papers
- **GitHub API** - Code repositories (optional)
- **Stack Exchange API** - Q&A content (optional)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Yaswanth Thotakura**
- GitHub: [@yesh00008](https://github.com/yesh00008)
- Email: thotakurayaswanth104@gmail.com

## 🙏 Acknowledgments

- Wikipedia for providing free knowledge to the world
- ArXiv for open access to research papers
- shadcn/ui for the beautiful component library
- The open-source community

## 📞 Support

For support, email thotakurayaswanth104@gmail.com or open an issue on GitHub.

---

Made with ❤️ by Yaswanth Thotakura
