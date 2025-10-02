import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import SubnetCalculator from './components/SubnetCalculator';

function App() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CompasIQ Subnet Calculator",
    "description": "Free online IPv4 subnet calculator with visual subnetting. Calculate network addresses, broadcast, netmask, wildcard mask, and CIDR.",
    "url": "https://compasiq.com/subnet-calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "CompasIQ",
      "url": "https://compasiq.com"
    },
    "featureList": [
      "IPv4 CIDR calculation",
      "Network address calculation",
      "Broadcast address calculation",
      "Subnet mask and wildcard mask",
      "Visual subnet splitting",
      "Host range calculation",
      "Usable hosts calculation",
      "Client-side processing"
    ]
  };

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(schemaMarkup)}
          </script>
        </Helmet>
        
        <Header />
        
        <main className="flex-grow">
          <SubnetCalculator />
        </main>
        
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
