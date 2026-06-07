/**
 * Technology definitions for the tech picker.
 * Each tech has an id (used for icon lookup), display name, and category.
 */
export const TECHS = [
  { id:'js', name:'JavaScript', cat:'Languages' },
  { id:'ts', name:'TypeScript', cat:'Languages' },
  { id:'py', name:'Python', cat:'Languages' },
  { id:'java', name:'Java', cat:'Languages' },
  { id:'cpp', name:'C++', cat:'Languages' },
  { id:'c', name:'C', cat:'Languages' },
  { id:'cs', name:'C#', cat:'Languages' },
  { id:'go', name:'Go', cat:'Languages' },
  { id:'rust', name:'Rust', cat:'Languages' },
  { id:'php', name:'PHP', cat:'Languages' },
  { id:'ruby', name:'Ruby', cat:'Languages' },
  { id:'swift', name:'Swift', cat:'Languages' },
  { id:'kotlin', name:'Kotlin', cat:'Languages' },
  { id:'scala', name:'Scala', cat:'Languages' },
  { id:'r', name:'R', cat:'Languages' },
  { id:'matlab', name:'MATLAB', cat:'Languages' },
  { id:'bash', name:'Bash', cat:'Languages' },
  { id:'powershell', name:'PowerShell', cat:'Languages' },
  { id:'lua', name:'Lua', cat:'Languages' },
  { id:'dart', name:'Dart', cat:'Languages' },
  { id:'react', name:'React', cat:'Frontend' },
  { id:'nextjs', name:'Next.js', cat:'Frontend' },
  { id:'vue', name:'Vue', cat:'Frontend' },
  { id:'nuxtjs', name:'Nuxt.js', cat:'Frontend' },
  { id:'angular', name:'Angular', cat:'Frontend' },
  { id:'svelte', name:'Svelte', cat:'Frontend' },
  { id:'html', name:'HTML', cat:'Frontend' },
  { id:'css', name:'CSS', cat:'Frontend' },
  { id:'tailwind', name:'Tailwind CSS', cat:'Frontend' },
  { id:'bootstrap', name:'Bootstrap', cat:'Frontend' },
  { id:'sass', name:'Sass', cat:'Frontend' },
  { id:'redux', name:'Redux', cat:'Frontend' },
  { id:'graphql', name:'GraphQL', cat:'Frontend' },
  { id:'threejs', name:'Three.js', cat:'Frontend' },
  { id:'gatsby', name:'Gatsby', cat:'Frontend' },
  { id:'nodejs', name:'Node.js', cat:'Backend' },
  { id:'express', name:'Express', cat:'Backend' },
  { id:'fastapi', name:'FastAPI', cat:'Backend' },
  { id:'django', name:'Django', cat:'Backend' },
  { id:'flask', name:'Flask', cat:'Backend' },
  { id:'spring', name:'Spring', cat:'Backend' },
  { id:'laravel', name:'Laravel', cat:'Backend' },
  { id:'rails', name:'Rails', cat:'Backend' },
  { id:'nestjs', name:'NestJS', cat:'Backend' },
  { id:'deno', name:'Deno', cat:'Backend' },
  { id:'bun', name:'Bun', cat:'Backend' },
  { id:'dotnet', name:'.NET', cat:'Backend' },
  { id:'mysql', name:'MySQL', cat:'Database' },
  { id:'postgres', name:'PostgreSQL', cat:'Database' },
  { id:'mongodb', name:'MongoDB', cat:'Database' },
  { id:'redis', name:'Redis', cat:'Database' },
  { id:'sqlite', name:'SQLite', cat:'Database' },
  { id:'firebase', name:'Firebase', cat:'Database' },
  { id:'supabase', name:'Supabase', cat:'Database' },
  { id:'prisma', name:'Prisma', cat:'Database' },
  { id:'elasticsearch', name:'Elasticsearch', cat:'Database' },
  { id:'cassandra', name:'Cassandra', cat:'Database' },
  { id:'docker', name:'Docker', cat:'DevOps' },
  { id:'kubernetes', name:'Kubernetes', cat:'DevOps' },
  { id:'aws', name:'AWS', cat:'DevOps' },
  { id:'gcp', name:'GCP', cat:'DevOps' },
  { id:'azure', name:'Azure', cat:'DevOps' },
  { id:'github', name:'GitHub', cat:'DevOps' },
  { id:'gitlab', name:'GitLab', cat:'DevOps' },
  { id:'githubactions', name:'GitHub Actions', cat:'DevOps' },
  { id:'jenkins', name:'Jenkins', cat:'DevOps' },
  { id:'terraform', name:'Terraform', cat:'DevOps' },
  { id:'nginx', name:'Nginx', cat:'DevOps' },
  { id:'linux', name:'Linux', cat:'DevOps' },
  { id:'flutter', name:'Flutter', cat:'Mobile' },
  { id:'androidstudio', name:'Android', cat:'Mobile' },
  { id:'apple', name:'iOS', cat:'Mobile' },
  { id:'react', name:'React Native', cat:'Mobile', iconId:'react' },
  { id:'tensorflow', name:'TensorFlow', cat:'AI/ML' },
  { id:'pytorch', name:'PyTorch', cat:'AI/ML' },
  { id:'sklearn', name:'Scikit-learn', cat:'AI/ML' },
  { id:'opencv', name:'OpenCV', cat:'AI/ML' },
  { id:'git', name:'Git', cat:'Tools' },
  { id:'vscode', name:'VS Code', cat:'Tools' },
  { id:'figma', name:'Figma', cat:'Tools' },
  { id:'postman', name:'Postman', cat:'Tools' },
  { id:'notion', name:'Notion', cat:'Tools' },
  { id:'vim', name:'Vim', cat:'Tools' },
  { id:'neovim', name:'Neovim', cat:'Tools' },
  { id:'obsidian', name:'Obsidian', cat:'Tools' },
  { id:'blender', name:'Blender', cat:'Tools' },
];

/**
 * Deduplicated techs with unique keys.
 * Handles the case where 'react' appears in both Frontend and Mobile categories.
 */
export const UNIQUE_TECHS = (() => {
  const seen = new Set();
  return TECHS.map(t => {
    const key = t.cat === 'Mobile' && seen.has(t.id) ? `${t.id}_mobile` : t.id;
    seen.add(t.id);
    return { ...t, uniqueKey: key };
  });
})();

export const TECH_CATEGORIES = [
  'All', 'Languages', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Tools',
];
