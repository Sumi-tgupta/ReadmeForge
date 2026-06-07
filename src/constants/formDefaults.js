/**
 * Default form data for the README generator wizard.
 * Used for initial state and for resetting the form.
 */
export const INITIAL_FORM_DATA = {
  // Basic info
  name: '',
  username: '',
  tagline: '',
  location: '',
  email: '',
  website: '',
  tone: 'Professional',
  avatarStyle: 'github-avatar',

  // About me
  bio: '',
  pronouns: '',
  currentFocus: '',
  funFact: '',
  openToWork: false,

  // Tech stack
  badgeStyle: 'skillicons',
  selectedTechs: [],
  learningTechs: [],
  learningGoal: '',

  // Projects & experience
  projects: [],
  experiences: [],
  ossDescription: '',
  ossLinks: [],

  // GitHub stats
  statsTheme: 'default',
  showStatsCard: true,
  showContribGraph: true,
  hideStars: false,
  hideCommits: false,
  hidePRs: false,
  hideIssues: false,
  hideContribs: false,

  // Trophies
  trophyTheme: 'flat',
  trophyRank: 'All',

  // Streak
  streakTheme: 'default',
  streakDateFormat: 'M j, Y',

  // Languages card
  langLayout: 'compact',
  langTheme: 'default',
  langExcludeRepos: '',
  langHideLanguages: '',

  // Social links
  social: {
    linkedin: '', twitter: '', instagram: '', youtube: '',
    discord: '', devto: '', hashnode: '', medium: '',
    leetcode: '', hackerrank: '', codepen: '', dribbble: '',
    behance: '', portfolio: '', email: '', buymeacoffee: '',
    kofi: '', patreon: '',
  },

  // Education & certifications
  educationEntries: [],
  certifications: [],

  // Hobbies
  funFacts: '',
  hobbies: [],

  // Support
  bmcUsername: '',
  kofiUsername: '',
  ghSponsors: '',
  patreonUrl: '',

  // Visitor counter
  visitorStyle: 'badge',
  visitorLabel: 'Profile Views',

  // Custom section
  customTitle: '',
  customContent: '',
};
