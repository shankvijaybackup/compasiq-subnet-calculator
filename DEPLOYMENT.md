# Deployment Guide

## Quick Deploy to Production

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel:
   ```bash
   npm i -g vercel
   vercel
   ```
3. Follow prompts (framework: Vite, build: `npm run build`, output: `dist`)
4. Set custom domain: `compasiq.com/subnet-calculator` or subdomain

### Option 2: Netlify

1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

### Option 3: Static Hosting (AWS S3, Cloudflare Pages, etc.)

```bash
npm run build
# Upload contents of `dist/` folder to hosting
```

## SEO Checklist

- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags (Facebook, LinkedIn)
- [x] Twitter Card tags
- [x] Schema.org JSON-LD markup
- [x] Semantic HTML5
- [x] Canonical URL
- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Add to Google Search Console
- [ ] Submit to Bing Webmaster Tools

## Performance Optimizations

### Already Implemented
- Code splitting with React lazy loading
- Tailwind CSS purging in production
- Vite optimization and bundling
- Minimal dependencies

### Additional Recommendations
1. **CDN**: Deploy to global CDN for fast worldwide access
2. **Compression**: Enable gzip/brotli on server
3. **Caching**: Set appropriate cache headers for static assets
4. **Analytics**: Add Google Analytics or Plausible
5. **Monitoring**: Set up uptime monitoring

## robots.txt Example

```
User-agent: *
Allow: /

Sitemap: https://compasiq.com/sitemap.xml
```

## sitemap.xml Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://compasiq.com/subnet-calculator</loc>
    <lastmod>2025-10-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Environment Variables

No environment variables needed for basic deployment.

For analytics (optional):
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## Post-Deployment

1. Test on mobile devices
2. Run Lighthouse audit (aim for 90+ scores)
3. Verify Open Graph preview: https://www.opengraph.xyz/
4. Check structured data: https://validator.schema.org/
5. Test accessibility: https://wave.webaim.org/
6. Monitor Core Web Vitals

## Future Enhancements

- [ ] IPv6 support
- [ ] CSV/JSON export of subnets
- [ ] Dark mode toggle
- [ ] Supernetting / route summarization
- [ ] Keyboard shortcuts
- [ ] Print-friendly view
- [ ] Share link with pre-filled CIDR
- [ ] Recently used CIDRs (localStorage)
- [ ] PWA for offline use
