# Drifted — Travel Guides & Journal

A minimalist, image-forward travel blog showcasing curated European adventures across France, Italy, and Switzerland. Built with vanilla HTML, CSS, and JavaScript for fast loading and clean aesthetics.

## 💭 Motivation

This project was created for my coding class at Pomfret School. I wanted to build something that combined my interests in coding, travel, and photography.

**Travel Memories**: I wanted a place to document and revisit my travel experiences instead of just having photos scattered across my phone.

**Photography Portfolio**: I enjoy photography but didn't have a good platform to showcase my work. This website lets me share my travel photos in a way that feels more personal than social media.

The result is a simple travel blog that serves as both a digital journal and a photography portfolio.

## 🌍 Live Site

**https://enguyen26.github.io/20project**

## ✨ Features

- **Interactive Destination Filtering** - Filter by trip duration, type, country, and experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Image-First Layout** - Clean, modern design inspired by Find Us Lost
- **Smooth Animations** - Subtle transitions and hover effects
- **Fast Loading** - Vanilla JavaScript with no heavy frameworks
- **SEO Optimized** - Proper meta tags and semantic HTML

## 🗺️ Destinations

### France
- Paris, Aix-en-Provence, Nice, Monaco, Marseille, Èze Village, Antibes, Port de Cassis, Moustiers Sainte Marie

### Italy  
- Positano, Capri

### Switzerland
- Zurich, Grindelwald, Iseltwald, Jungfraujoch, Lauterbrunnen, Bürglen

## 🚀 Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/enguyen26/20project.git
cd 20project

# Serve locally (Python)
python3 -m http.server 8080
# Visit http://localhost:8080
```

### Alternative (Node.js)
```bash
npx serve -l 8080 .
```

## 📁 Project Structure

```
├── index.html          # Main homepage with hero and filtering
├── content.json        # Dynamic content data (destinations, posts, site info)
├── script.js          # Interactive features and content rendering
├── styles.css         # Modern CSS with responsive grid system
├── 404.html           # Custom 404 page for GitHub Pages
├── [destination].html # Individual destination pages
└── images/            # High-quality travel photography
    ├── paris.jpg
    ├── positano.jpg
    ├── capri.jpg
    └── ... (100+ travel photos)
```

## 🎨 Design Philosophy

- **Minimalist Aesthetic** - Clean typography with Playfair Display and Inter fonts
- **Image-Driven** - High-quality photography takes center stage
- **User Experience** - Intuitive navigation and filtering system
- **Performance** - Fast loading with optimized images and vanilla JS
- **Accessibility** - Semantic HTML and proper ARIA labels

## 🛠️ Technical Stack

- **HTML5** - Semantic markup with proper meta tags
- **CSS3** - Modern features including Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No dependencies, fast and lightweight
- **GitHub Pages** - Free hosting with automatic deployments

## 📝 Content Management

All site content is managed through `content.json`:
- Site branding and metadata
- Hero section content
- Destination cards with images and descriptions
- Journal posts and excerpts
- About section text

## 🚀 Deployment

### GitHub Pages Setup
1. **Enable Pages**: Go to repository Settings → Pages
2. **Configure Source**: Deploy from branch `main`, folder `/ (root)`
3. **Deploy**: Site automatically deploys on every push to main

### Custom Domain (Optional)
Add a `CNAME` file with your domain name to use a custom URL.

## 🔧 Customization

### Adding New Destinations
1. Add destination data to `content.json` under `destinations` array
2. Create corresponding HTML page (e.g., `new-destination.html`)
3. Add destination images to `images/` folder
4. Commit and push - automatic deployment!

### Styling Changes
- Modify `styles.css` for design updates
- CSS custom properties make color theming easy
- Responsive breakpoints: mobile (320px), tablet (768px), desktop (1024px+)

## 📸 Image Guidelines

- **Format**: JPG for photos, PNG for graphics
- **Dimensions**: 1200px+ width recommended
- **Optimization**: Compress images for web performance
- **Naming**: Use descriptive filenames (e.g., `paris-eiffel-tower.jpg`)

## 🤝 Contributing

This is a personal travel blog, but suggestions and improvements are welcome!

## 📄 License

Personal project - all travel photography and content © Elina Nguyen

---

**Built with ❤️ for sharing beautiful travel experiences**