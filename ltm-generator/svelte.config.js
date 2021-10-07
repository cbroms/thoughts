/** @type {import('@sveltejs/kit').Config} */

import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		hydrate: false,
		router: false,
		target: '#svelte',
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		prerender: {
			crawl: true,
			pages: ['/pages']
		}
	}
};

export default config;
