import { defineConfig } from 'vite';
import { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
	root: resolve(__dirname),
	base: isProduction ? '/basepower/' : '/',
	server: {
		host: true,
	},
	resolve: {
		alias: {
			'basepower': resolve(__dirname, '../src'),
		},
	},
});
