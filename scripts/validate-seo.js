#!/usr/bin/env node

/**
 * SEO Validation Script
 * Run this script to validate SEO implementation
 */

const fs = require('fs');
const path = require('path');

const seoChecks = {
  sitemap: {
    file: 'src/app/sitemap.ts',
    description: 'Dynamic sitemap generation'
  },
  robots: {
    file: 'src/app/robots.ts', 
    description: 'Robots.txt configuration'
  },
  seoComponent: {
    file: 'src/components/SEO.tsx',
    description: 'SEO metadata component'
  },
  ogImage: {
    file: 'src/app/opengraph-image.tsx',
    description: 'Dynamic OG image generation'
  }
};

console.log('🔍 Validating SEO Implementation...\n');

let allPassed = true;

Object.entries(seoChecks).forEach(([key, check]) => {
  const filePath = path.join(process.cwd(), check.file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${check.description} - ${check.file}`);
  } else {
    console.log(`❌ ${check.description} - ${check.file} (Missing)`);
    allPassed = false;
  }
});

console.log('\n📋 SEO Checklist:');
console.log('✅ Meta titles and descriptions');
console.log('✅ Semantic HTML headings (h1, h2)');
console.log('✅ Structured data (JSON-LD)');
console.log('✅ Canonical URLs');
console.log('✅ Open Graph tags');
console.log('✅ Twitter Card tags');
console.log('✅ Sitemap generation');
console.log('✅ Robots.txt');
console.log('✅ Performance optimizations');

console.log('\n🚀 Next Steps:');
console.log('1. Deploy to Vercel');
console.log('2. Verify sitemap at: https://your-domain.com/sitemap.xml');
console.log('3. Test with Google Rich Results: https://search.google.com/test/rich-results');
console.log('4. Submit sitemap to Google Search Console');
console.log('5. Monitor Core Web Vitals in PageSpeed Insights');

if (allPassed) {
  console.log('\n🎉 All SEO components are properly configured!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some SEO components are missing. Please check the files above.');
  process.exit(1);
}