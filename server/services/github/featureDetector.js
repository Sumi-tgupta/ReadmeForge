/**
 * Feature Detector: Infers codebase capabilities using deterministic rules
 */

/**
 * Detects repository features based on file structures, folders, and dependencies
 * 
 * @param {object} treeScannerOutput - Output of treeScanner containing folders, files, and importantFiles
 * @param {Array<string>} dependencies - Extracted dependencies list
 * @returns {Array<string>} List of identified features
 */
export function detectFeatures(treeScannerOutput, dependencies = []) {
  const features = new Set();
  const depSet = new Set(dependencies.map(d => d.toLowerCase()));
  const { folders = [], files = [], importantFiles = {} } = treeScannerOutput;

  // 1. Docker support
  if (importantFiles['dockerfile'] || importantFiles['docker-compose.yml'] || importantFiles['docker-compose.yaml']) {
    features.add('Docker Configuration');
  }

  // 2. CI/CD
  const hasGitHubActions = files.some(f => f.startsWith('.github/workflows/'));
  if (hasGitHubActions) {
    features.add('CI/CD (GitHub Actions)');
  }

  // 3. Database migrations
  const migrationKeywords = ['migrations', 'prisma/migrations', 'db/migrate'];
  const hasMigrations = folders.some(f => migrationKeywords.some(kw => f.toLowerCase().includes(kw)));
  if (hasMigrations || depSet.has('prisma') || depSet.has('alembic') || depSet.has('db-migrate') || depSet.has('knex')) {
    features.add('Database Migrations');
  }

  // 4. Testing
  const testPackages = ['jest', 'mocha', 'cypress', 'vitest', 'pytest', 'playwright', 'rspec', 'jest-runner', 'supertest', 'chai'];
  const testFilesKeywords = ['test', 'spec', '__tests__'];
  const hasTestFiles = files.some(f => testFilesKeywords.some(kw => f.toLowerCase().includes(kw)));
  const hasTestPackages = testPackages.some(pkg => depSet.has(pkg));
  if (hasTestFiles || hasTestPackages) {
    features.add('Unit/Integration Testing');
  }

  // 5. Authentication
  const authPackages = ['jsonwebtoken', 'passport', 'next-auth', '@auth/core', 'clerk', 'firebase-auth', 'bcrypt', 'argon2'];
  const hasAuth = authPackages.some(pkg => depSet.has(pkg));
  if (hasAuth) {
    features.add('Authentication & Session Management');
  }

  // 6. Payments
  if (depSet.has('stripe') || depSet.has('paypal-rest-sdk') || depSet.has('razorpay') || depSet.has('braintree')) {
    features.add('Payment Gateways (Stripe/PayPal)');
  }

  // 7. REST / GraphQL APIs
  if (depSet.has('graphql') || depSet.has('apollo-server') || depSet.has('@apollo/client')) {
    features.add('GraphQL API Support');
  } else if (depSet.has('express') || depSet.has('fastify') || depSet.has('@nestjs/core') || depSet.has('fastapi')) {
    features.add('REST API Endpoints');
  }

  // 8. AI / Machine Learning
  const aiPackages = ['openai', '@google/generative-ai', 'langchain', '@langchain/core', 'transformers', 'tensorflow', 'pytorch'];
  const hasAi = aiPackages.some(pkg => depSet.has(pkg));
  if (hasAi) {
    features.add('Artificial Intelligence / Gemini Integration');
  }

  // 9. WebSockets
  if (depSet.has('socket.io') || depSet.has('ws') || depSet.has('express-ws') || depSet.has('socket.io-client')) {
    features.add('Real-time Communication (WebSockets)');
  }

  // 10. Background jobs
  const backgroundPackages = ['bull', 'bullmq', 'agenda', 'celery', 'redis-queue', 'sidekiq'];
  const hasBackgroundJobs = backgroundPackages.some(pkg => depSet.has(pkg));
  if (hasBackgroundJobs) {
    features.add('Asynchronous Background Processing');
  }

  // 11. Environment settings
  if (importantFiles['.env.example'] || files.some(f => f.includes('.env'))) {
    features.add('Environment Config (.env)');
  }

  // 12. Formatting / Linting
  if (files.some(f => f.includes('.eslintrc') || f.includes('.prettierrc') || f.includes('eslint.config.js') || f.includes('prettier.config.js'))) {
    features.add('Linting & Code Formatting (ESLint/Prettier)');
  }

  return Array.from(features);
}
