/**
 * Deterministic Stack Detector for identifying core components (Database, ORM, UI libraries, etc.)
 */

// Package mapping registry
const STACK_MAP = {
  database: [
    { name: 'PostgreSQL', packages: ['pg', 'postgres', 'libpq', 'postgresql'] },
    { name: 'MySQL', packages: ['mysql', 'mysql2'] },
    { name: 'MongoDB', packages: ['mongodb', 'mongoose', 'pymongo'] },
    { name: 'SQLite', packages: ['sqlite', 'sqlite3', 'better-sqlite3', 'sqlite-jdbc'] },
    { name: 'Redis', packages: ['redis', 'ioredis', 'redis-py'] },
    { name: 'Firebase', packages: ['firebase', 'firebase-admin', 'firebase-client'] },
    { name: 'Supabase', packages: ['@supabase/supabase-js', 'supabase'] },
    { name: 'Cassandra', packages: ['cassandra-driver'] },
    { name: 'Elasticsearch', packages: ['@elastic/elasticsearch', 'elasticsearch'] },
    { name: 'DynamoDB', packages: ['@aws-sdk/client-dynamodb', 'dynamodb'] }
  ],
  orm: [
    { name: 'Prisma', packages: ['@prisma/client', 'prisma'] },
    { name: 'Mongoose', packages: ['mongoose'] },
    { name: 'Sequelize', packages: ['sequelize'] },
    { name: 'TypeORM', packages: ['typeorm'] },
    { name: 'Drizzle ORM', packages: ['drizzle-orm', 'drizzle-kit'] },
    { name: 'SQLAlchemy', packages: ['sqlalchemy'] },
    { name: 'Django ORM', packages: ['django'] },
    { name: 'Hibernate', packages: ['hibernate-core', 'hibernate'] },
    { name: 'Entity Framework Core', packages: ['microsoft.entityframeworkcore'] }
  ],
  ui: [
    { name: 'Tailwind CSS', packages: ['tailwindcss', 'postcss-tailwindcss'] },
    { name: 'Material UI', packages: ['@mui/material', '@material-ui/core'] },
    { name: 'Bootstrap', packages: ['bootstrap', 'react-bootstrap'] },
    { name: 'Ant Design', packages: ['antd'] },
    { name: 'Chakra UI', packages: ['@chakra-ui/react'] },
    { name: 'Shadcn UI', packages: ['shadcn-ui', 'shadcn'] },
    { name: 'Styled Components', packages: ['styled-components'] },
    { name: 'Sass', packages: ['sass', 'node-sass'] }
  ],
  state: [
    { name: 'Redux', packages: ['redux', '@reduxjs/toolkit', 'react-redux'] },
    { name: 'Zustand', packages: ['zustand'] },
    { name: 'MobX', packages: ['mobx', 'mobx-react'] },
    { name: 'Pinia', packages: ['pinia'] },
    { name: 'Vuex', packages: ['vuex'] },
    { name: 'Recoil', packages: ['recoil'] }
  ],
  auth: [
    { name: 'Auth.js (NextAuth)', packages: ['next-auth', '@auth/core'] },
    { name: 'Clerk', packages: ['@clerk/nextjs', '@clerk/clerk-react', '@clerk/backend'] },
    { name: 'Passport.js', packages: ['passport', 'passport-local'] },
    { name: 'Firebase Auth', packages: ['firebase-auth'] },
    { name: 'JSON Web Tokens (JWT)', packages: ['jsonwebtoken', 'jose', 'jwt-decode', 'pyjwt'] },
    { name: 'Auth0', packages: ['@auth0/nextjs-auth0', 'auth0'] }
  ],
  ai: [
    { name: 'Gemini API', packages: ['@google/generative-ai', 'google-generativeai'] },
    { name: 'OpenAI API', packages: ['openai'] },
    { name: 'LangChain', packages: ['langchain', '@langchain/core'] },
    { name: 'Hugging Face', packages: ['@huggingface/inference'] }
  ]
};

/**
 * Detects stack details based on dependencies and frameworks
 * 
 * @param {Array<string>} dependencies - Loaded dependencies list
 * @param {Array<string>} frameworks - Detected frameworks list
 * @returns {object} Identified stack map
 */
export function detectStack(dependencies = [], frameworks = []) {
  const depSet = new Set(dependencies.map(d => d.toLowerCase()));
  const stack = {
    frontend: null,
    backend: null,
    database: null,
    orm: null,
    ui: null,
    state: null,
    auth: null,
    ai: null
  };

  // Determine frontend / backend using framework detection
  // Standard matching defaults:
  const frontends = ['React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'Astro'];
  const backends = ['Express', 'NestJS', 'Fastify', 'Flask', 'Django', 'FastAPI', 'Spring Boot', 'Laravel', 'ASP.NET', 'Go Fiber', 'Gin', 'Rocket', 'Actix', 'Phoenix', 'Ruby on Rails'];

  const matchedFront = frameworks.find(fw => frontends.includes(fw));
  if (matchedFront) {
    stack.frontend = matchedFront;
  }

  const matchedBack = frameworks.find(fw => backends.includes(fw));
  if (matchedBack) {
    stack.backend = matchedBack;
  }

  // Iterate over other stack categories
  for (const [category, registry] of Object.entries(STACK_MAP)) {
    for (const item of registry) {
      const match = item.packages.some(pkg => depSet.has(pkg.toLowerCase()));
      if (match) {
        stack[category] = item.name;
        break; // matched this category, stop searching it
      }
    }
  }

  return stack;
}
