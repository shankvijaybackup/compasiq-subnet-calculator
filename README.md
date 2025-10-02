# CompasIQ Subnet Calculator

Professional IPv4 subnet calculator with visual subnetting capabilities. Built with React, Vite, and Tailwind CSS.

## Features

- 🧮 **Complete IPv4 Calculations**: Network address, broadcast, netmask, wildcard, host ranges
- 🎨 **Visual Subnetting**: Subdivide networks and visualize child subnets
- 🔒 **100% Client-Side**: All calculations in browser, no data sent to servers
- ⚡ **Real-Time**: Instant validation and calculation as you type
- 📋 **Copy to Clipboard**: Quick copy buttons for all values
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ♿ **Accessible**: Semantic HTML and ARIA labels
- 🎯 **SEO Optimized**: Schema.org markup and meta tags

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage**: 60+ test cases covering all subnet prefixes (/0-/32), edge cases, and real-world scenarios. See [TESTING.md](TESTING.md) and [TEST_SUMMARY.md](TEST_SUMMARY.md) for details.

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **react-helmet-async** - SEO and meta tag management
- **Vitest** - Unit testing framework

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Site header with CompasIQ branding
│   ├── Footer.jsx          # Footer with contact info
│   └── SubnetCalculator.jsx # Main calculator component
├── utils/
│   └── subnetUtils.js      # Pure calculation functions (testable)
├── test/
│   ├── subnetUtils.test.js # 60+ test cases
│   ├── setup.js            # Test configuration
│   └── testCases.json      # Reference test data
├── App.jsx                 # Root component with SEO
├── main.jsx                # React entry point
└── index.css               # Tailwind imports
```

## Features Detail

### CIDR Calculator
- Validates IPv4 addresses and CIDR notation
- Calculates network and broadcast addresses
- Computes subnet mask and wildcard mask
- Shows classful network type (A, B, C, D, E)
- Displays total and usable host counts
- Provides first and last usable host addresses

### Visual Subnetter
- Subdivide parent networks into smaller subnets
- Choose any prefix length ≥ parent prefix
- View up to 1024 child subnets (displays first 128 for UI performance)
- Each subnet shows network, broadcast, and host range
- Quick copy buttons for each subnet CIDR

### Edge Cases Handled
- /31 networks (point-to-point, no usable hosts)
- /32 networks (single host)
- Invalid IP addresses
- Out-of-range CIDR prefixes
- Large subnet splits (safety limits)

## Browser Support

Works on all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## License

© 2025 INOVAWE TECHNOLOGY PTY LTD. All rights reserved.

## Contact

**CompasIQ**  
📧 ryan@compasiq.com  
📞 +61 421 226 660  
🌐 www.compasiq.com  
📍 South Wentworthville, NSW 2145, Australia

---

Built with ❤️ by the CompasIQ team
