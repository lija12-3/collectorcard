import { build } from 'esbuild';
import { mkdirSync } from 'fs';

mkdirSync('dist/lambdas', { recursive: true });

const entries = [
  ['preAuthentication', 'apps/lambdas/src/pre-authentication.ts'],
  ['preTokenGeneration', 'apps/lambdas/src/pre-token-generation.ts'],
  ['defineAuthChallenge', 'apps/lambdas/src/define-auth-challenge.ts'],
  ['createAuthChallenge', 'apps/lambdas/src/create-auth-challenge.ts'],
  ['verifyAuthChallenge', 'apps/lambdas/src/verify-auth-challenge.ts'],
];

await Promise.all(
  entries.map(([name, entry]) =>
    build({
      entryPoints: [entry],
      outfile: `dist/lambdas/${name}.js`,
      bundle: true,
      platform: 'node',
      target: 'node20',
      external: [], // all sdk v3 gets bundled
      sourcemap: false,
      format: 'cjs',
      minify: true,
    }),
  ),
);

console.log('Lambdas built to dist/lambdas/*.js');
