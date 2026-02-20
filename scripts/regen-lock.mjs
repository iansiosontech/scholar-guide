import { execSync } from 'child_process';

console.log('Regenerating pnpm-lock.yaml...');
try {
  execSync('cd /vercel/share/v0-project && pnpm install --lockfile-only', { stdio: 'inherit' });
  console.log('Lockfile regenerated successfully.');
} catch (e) {
  console.error('Failed to regenerate lockfile:', e.message);
}
