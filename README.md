# ColorSplash Travel Blog

Fun, colorful static travel blog built with vanilla HTML, CSS, and JS. Ready to deploy on GitHub Pages.

## Local preview

You can open `index.html` directly in your browser. For best results with modern browsers, serve it via a tiny local server:

### Python

```bash
cd /Users/elinanguyen/coding/introtocodingenguyen
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Node (optional)

```bash
npx serve -l 8080 .
```

## Deploy to GitHub Pages

1. Commit and push the site to the `main` branch.
2. In your repository on GitHub, go to Settings → Pages.
3. Set Source to `Deploy from a branch`, Branch: `main`, Folder: `/ (root)`.
4. Save. Your site will be available at the URL GitHub shows (usually `https://<username>.github.io/<repo>`).

Changes to `main` will auto-deploy.

## Project structure

```
index.html   # main page
styles.css   # colorful theme and responsive layout
script.js    # interactions: nav, theme toggle, filters, smooth scroll
404.html     # friendly not-found page for GitHub Pages
```

## Credits

Header and gallery photos use Unsplash placeholder images.