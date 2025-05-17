import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	]
});
