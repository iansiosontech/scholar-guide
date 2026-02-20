import { execSync } from 'child_process';

try {
  console.log('Regenerating pnpm-lock.yaml...');
  execSync('pnpm install --lockfile-only', { 
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit' 
  });
  console.log('Lockfile regenerated successfully');
} catch (e) {
  console.error('Error:', e.message);
}
