import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	root: resolve(__dirname),
	server: {
		host: true,
	},
	resolve: {
		alias: {
			'basepower': resolve(__dirname, '../src'),
		},
	},
});
