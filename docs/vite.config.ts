import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
	root: resolve(__dirname),
	base: isProduction ? '/basepower/' : '/',
	plugins: [react()],
	server: {
		host: true,
	},
	resolve: {
		alias: {
			'basepower': resolve(__dirname, '../src'),
			'basepower/react': resolve(__dirname, '../src/react'),
		},
	},
});
