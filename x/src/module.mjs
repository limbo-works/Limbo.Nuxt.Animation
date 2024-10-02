import fs from 'fs';

import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

export default defineNuxtModule({
	meta: {
		name: 'nuxt-animation',
		configKey: 'animation',
		compatibility: { nuxt: '^3.0.0' },
	},

	schema: {
		placeholder: String,
	},

	defaults: {
		version: '2024-01',
	},

	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		const plugins = fs.readdirSync(resolve('./plugins'));

		console.log(plugins);

		// const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
		// const { resolve } = createResolver(import.meta.url);
		// addImports({
		// 	name: 'useShopify',
		// 	from: resolve(runtimeDir, 'use-shopify.mjs'),
		// });
		// addServerHandler({
		// 	method: 'post',
		// 	route: '/api/shopify',
		// 	handler: resolve(runtimeDir, 'server/api/shopify.post.mjs'),
		// });
	},
});
