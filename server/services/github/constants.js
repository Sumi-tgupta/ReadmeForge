/**
 * Constants for the Repository Intelligence Engine
 */

export const IGNORED_PATHS = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.github/cache',
  '.next',
  'out',
  'vendor',
  'target',
  'bin',
  'obj',
  '.idea',
  '.vscode',
  'assets',
  'images',
  'videos',
  'fonts',
  '.yarn',
  '.pnpm-store'
];

export const IGNORED_EXTENSIONS = [
  // Binary files
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg', '.pdf', '.zip', '.tar', '.gz', '.rar',
  '.mp4', '.mov', '.avi', '.mp3', '.wav', '.ogg', '.dmg', '.exe', '.bin', '.iso', '.woff', '.woff2',
  '.eot', '.ttf', '.db', '.sqlite', '.dll', '.so', '.dylib',
  // Lock files
  'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'cargo.lock', 'go.sum', 'composer.lock', 'poetry.lock'
];

export const IMPORTANT_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'requirements.txt',
  'pyproject.toml',
  'Pipfile',
  'go.mod',
  'Cargo.toml',
  'composer.json',
  'pom.xml',
  'build.gradle',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'README.md',
  'LICENSE',
  'tsconfig.json',
  'vite.config.js',
  'vite.config.ts',
  'next.config.js',
  'next.config.mjs',
  'tailwind.config.js',
  'tailwind.config.ts',
  'nuxt.config.js',
  'nuxt.config.ts',
  'astro.config.mjs',
  'astro.config.js',
  'angular.json',
  '.env.example',
  'schema.prisma'
];

export const FRAMEWORKS = {
  react: { name: 'React', files: ['vite.config.js', 'vite.config.ts'], dependencies: ['react'] },
  nextjs: { name: 'Next.js', files: ['next.config.js', 'next.config.mjs'], dependencies: ['next'] },
  vue: { name: 'Vue', dependencies: ['vue'] },
  nuxt: { name: 'Nuxt', files: ['nuxt.config.js', 'nuxt.config.ts'], dependencies: ['nuxt'] },
  angular: { name: 'Angular', files: ['angular.json'], dependencies: ['@angular/core'] },
  svelte: { name: 'Svelte', dependencies: ['svelte'] },
  astro: { name: 'Astro', files: ['astro.config.mjs', 'astro.config.js'], dependencies: ['astro'] },
  express: { name: 'Express', dependencies: ['express'] },
  nestjs: { name: 'NestJS', dependencies: ['@nestjs/core'] },
  fastify: { name: 'Fastify', dependencies: ['fastify'] },
  flask: { name: 'Flask', files: ['Pipfile', 'requirements.txt'], patterns: [/flask/i] },
  django: { name: 'Django', files: ['manage.py', 'requirements.txt'], patterns: [/django/i] },
  fastapi: { name: 'FastAPI', files: ['main.py', 'requirements.txt'], patterns: [/fastapi/i] },
  springboot: { name: 'Spring Boot', files: ['pom.xml', 'build.gradle'], patterns: [/spring-boot/i] },
  laravel: { name: 'Laravel', files: ['artisan', 'composer.json'], dependencies: ['laravel/framework'] },
  aspnet: { name: 'ASP.NET', files: ['*.csproj', '*.sln'], patterns: [/Microsoft\.NET\.Sdk/i] },
  gofiber: { name: 'Go Fiber', files: ['go.mod'], patterns: [/github\.com\/gofiber\/fiber/i] },
  gin: { name: 'Gin', files: ['go.mod'], patterns: [/github\.com\/gin-gonic\/gin/i] },
  rocket: { name: 'Rocket', files: ['Cargo.toml'], patterns: [/rocket/i] },
  actix: { name: 'Actix', files: ['Cargo.toml'], patterns: [/actix-web/i] },
  phoenix: { name: 'Phoenix', files: ['mix.exs'], patterns: [/phoenix/i] },
  rails: { name: 'Ruby on Rails', files: ['Gemfile'], patterns: [/rails/i] }
};

export const LANGUAGES = {
  js: { name: 'JavaScript', ext: ['.js', '.jsx', '.mjs'] },
  ts: { name: 'TypeScript', ext: ['.ts', '.tsx'] },
  py: { name: 'Python', ext: ['.py'] },
  java: { name: 'Java', ext: ['.java'] },
  cs: { name: 'C#', ext: ['.cs'] },
  go: { name: 'Go', ext: ['.go'] },
  rust: { name: 'Rust', ext: ['.rs'] },
  php: { name: 'PHP', ext: ['.php'] },
  rb: { name: 'Ruby', ext: ['.rb'] },
  cpp: { name: 'C++', ext: ['.cpp', '.cc', '.cxx', '.h', '.hpp'] },
  kt: { name: 'Kotlin', ext: ['.kt', '.kts'] },
  swift: { name: 'Swift', ext: ['.swift'] }
};

export const MAX_FILE_LIMIT = 5000;
export const MAX_SIZE_LIMIT_MB = 100;
