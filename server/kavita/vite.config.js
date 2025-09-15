import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  console.log('Loading Vite Config...')
  return {
    plugins: [react()],
  }
});
