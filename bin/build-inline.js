/**
 * Build a self-contained inline script for Webflow custom code.
 *
 * - GSAP and ScrollTrigger come from Webflow's native GSAP integration (window.gsap / window.ScrollTrigger).
 * - Swiper comes from the public jsDelivr npm CDN (window.Swiper), loaded on the Projecten page only.
 * - Swiper CSS is loaded via a <link> on the Projecten page, so CSS imports are dropped here.
 * - The whole bundle runs inside Webflow.push, so all globals exist by the time the code evaluates.
 *
 * Output: dist-inline/footer-code.html (paste into Site settings > Custom code > Footer code).
 */
import * as esbuild from 'esbuild';
import { mkdirSync, writeFileSync } from 'fs';

// ESM shims (package is "type": "module", so esbuild uses Node-style interop and ignores __esModule on CJS shims).
const GLOBALS = {
  gsap: 'const g = window.gsap; export { g as gsap }; export default g;',
  'gsap/ScrollTrigger': 'const s = window.ScrollTrigger; export { s as ScrollTrigger }; export default s;',
  swiper: 'const s = window.Swiper; export { s as Swiper }; export default s;',
};

const webflowGlobals = {
  name: 'webflow-globals',
  setup(build) {
    build.onResolve({ filter: /^(gsap|gsap\/ScrollTrigger|swiper)$/ }, (args) => ({
      path: args.path,
      namespace: 'webflow-global',
    }));
    build.onLoad({ filter: /.*/, namespace: 'webflow-global' }, (args) => ({
      contents: GLOBALS[args.path],
      loader: 'js',
    }));
    build.onResolve({ filter: /\.css$|^swiper\/css$/ }, (args) => ({ path: args.path, namespace: 'empty-css' }));
    build.onLoad({ filter: /.*/, namespace: 'empty-css' }, () => ({ contents: '', loader: 'js' }));
  },
};

const result = await esbuild.build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  write: false,
  minify: true,
  format: 'iife',
  target: 'es2020',
  legalComments: 'none',
  plugins: [webflowGlobals],
  define: { SERVE_ORIGIN: '""' },
  // Run after Webflow is ready, and wait (max ~5s) until Webflow's GSAP + ScrollTrigger globals exist.
  banner: { js: 'window.Webflow=window.Webflow||[];window.Webflow.push(function(){var run=function(){' },
  footer: {
    js: "};var t=0;(function w(){if(window.gsap&&window.ScrollTrigger)return run();if(++t>100)return console.warn('[verant] GSAP/ScrollTrigger niet gevonden: zet GSAP + ScrollTrigger aan in Site settings.');setTimeout(w,50);})();});",
  },
});

const js = result.outputFiles[0].text.trim();
if (js.includes('</script')) throw new Error('Bundle contains a closing script tag');

const html = `<!-- Verant site scripts (build ${new Date().toISOString().slice(0, 10)}). Requires Webflow GSAP + ScrollTrigger enabled. -->\n<script>${js}</script>\n`;

mkdirSync('dist-inline', { recursive: true });
writeFileSync('dist-inline/footer-code.html', html);
console.log(`dist-inline/footer-code.html: ${html.length} characters (Webflow limit 50000)`);
