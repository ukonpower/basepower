import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		dts({ rollupTypes: true }),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'basepower',
			formats: ['es', 'cjs'],
			fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs',
		},
	},
});
