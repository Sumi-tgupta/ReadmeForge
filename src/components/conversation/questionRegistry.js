import { validateGithubUsername, validateUrl, validateEmail } from './validators';
import { TONE_OPTIONS, AVATAR_STYLES } from '../../constants/options';

// Profile Builder Questions Flow
export const PROFILE_QUESTIONS = [
  // SECTION: Basic Information
  {
    id: 'name',
    section: 'Basic Information',
    label: 'Full Name',
    description: 'What is your full name?',
    placeholder: 'e.g. John Doe',
    component: 'Text',
    required: true,
    validator: (v) => v && v.trim().length > 0 ? true : 'Full name is required',
    next: 'username'
  },
  {
    id: 'username',
    section: 'Basic Information',
    label: 'GitHub Username',
    description: 'What is your GitHub username?',
    placeholder: 'e.g. johndoe',
    component: 'GitHub Username',
    required: true,
    validator: validateGithubUsername,
    next: 'tagline'
  },
  {
    id: 'tagline',
    section: 'Basic Information',
    label: 'Tagline / Role',
    description: 'Provide a brief tagline or professional title.',
    placeholder: 'e.g. Full Stack Developer | Open Source Enthusiast',
    component: 'Text',
    next: 'location'
  },
  {
    id: 'location',
    section: 'Basic Information',
    label: 'Location',
    description: 'Where are you based?',
    placeholder: 'e.g. San Francisco, CA',
    component: 'Text',
    next: 'email'
  },
  {
    id: 'email',
    section: 'Basic Information',
    label: 'Email',
    description: 'What is your contact email?',
    placeholder: 'e.g. john@example.com',
    component: 'Text',
    validator: validateEmail,
    next: 'website'
  },
  {
    id: 'website',
    section: 'Basic Information',
    label: 'Website / Portfolio',
    description: 'Do you have a personal website or portfolio URL?',
    placeholder: 'e.g. https://johndoe.dev',
    component: 'URL',
    validator: validateUrl,
    next: 'tone'
  },
  {
    id: 'tone',
    section: 'Basic Information',
    label: 'Profile Tone',
    description: 'Choose a communication tone for your README.',
    component: 'Dropdown',
    options: TONE_OPTIONS,
    next: 'avatarStyle'
  },
  {
    id: 'avatarStyle',
    section: 'Basic Information',
    label: 'Header Style',
    description: 'How would you like your header avatar styled?',
    component: 'Dropdown',
    options: AVATAR_STYLES.map(s => ({ value: s.id, label: s.name })),
    next: 'social_links'
  },

  // SECTION: Social Links
  {
    id: 'social_links',
    section: 'Social Links',
    label: 'Social Profiles',
    description: 'Add your social and contact profile links (optional).',
    component: 'Social Links',
    next: 'bio'
  },

  // SECTION: About Me
  {
    id: 'bio',
    section: 'About',
    label: 'Short Bio',
    description: 'Tell us a bit about yourself in a short biography.',
    placeholder: 'Write a few sentences about your passion and expertise...',
    component: 'Textarea',
    next: 'pronouns'
  },
  {
    id: 'pronouns',
    section: 'About',
    label: 'Pronouns',
    description: 'What are your pronouns? (optional)',
    placeholder: 'e.g. he/him, she/her, they/them',
    component: 'Text',
    next: 'currentFocus'
  },
  {
    id: 'currentFocus',
    section: 'About',
    label: 'Current Focus',
    description: "What are you currently focusing on or working on?",
    placeholder: "e.g. building a SaaS platform, learning Rust, contributing to React...",
    component: 'Text',
    next: 'funFact'
  },
  {
    id: 'funFact',
    section: 'About',
    label: 'Fun Fact',
    description: 'What is a fun fact about you?',
    placeholder: 'e.g. I have 3 cats, I brew my own coffee, I speak 4 languages...',
    component: 'Text',
    next: 'openToWork'
  },
  {
    id: 'openToWork',
    section: 'About',
    label: 'Open to Work',
    description: 'Are you currently looking for new opportunities?',
    component: 'Toggle',
    next: 'badgeStyle'
  },

  // SECTION: Skills
  {
    id: 'badgeStyle',
    section: 'Skills',
    label: 'Skills Badge Style',
    description: 'How should your tech stack badges be styled?',
    component: 'Dropdown',
    options: [
      { value: 'shields', label: 'Shields.io (pill-shaped)' },
      { value: 'skillicons', label: 'Skill Icons (clean grid)' }
    ],
    next: 'selectedTechs'
  },
  {
    id: 'selectedTechs',
    section: 'Skills',
    label: 'Tech Stack',
    description: 'Pick the technologies, languages, and tools you use.',
    component: 'Tech Picker',
    next: 'projects'
  },

  // SECTION: Projects
  {
    id: 'projects',
    section: 'Projects',
    label: 'Projects Showcase',
    description: 'Highlight your best projects with links and descriptions.',
    component: 'Project List',
    next: 'experiences'
  },

  // SECTION: Experience
  {
    id: 'experiences',
    section: 'Experience',
    label: 'Work Experience',
    description: 'Share your work history and positions.',
    component: 'Experience List',
    next: 'educationEntries'
  },

  // SECTION: Education
  {
    id: 'educationEntries',
    section: 'Education',
    label: 'Education & Certifications',
    description: 'Enter your academic credentials or certifications.',
    component: 'Education List',
    next: 'learningTechs'
  },

  // SECTION: Learning
  {
    id: 'learningTechs',
    section: 'Learning',
    label: 'Currently Learning Techs',
    description: 'What technologies are you currently exploring?',
    component: 'Tech Picker',
    next: 'learningGoal'
  },
  {
    id: 'learningGoal',
    section: 'Learning',
    label: 'Learning Objective',
    description: 'Do you have a learning goal or target for these technologies?',
    placeholder: 'e.g. Building an API in Rust, mastering Kubernetes...',
    component: 'Text',
    next: 'statsTheme'
  },

  // SECTION: Statistics
  {
    id: 'statsTheme',
    section: 'Statistics',
    label: 'GitHub Stats Theme',
    description: 'Choose a color theme for your GitHub stats card.',
    component: 'Dropdown',
    options: [
      { value: 'default', label: 'Default / Indigo' },
      { value: 'dark', label: 'Dark Mode' },
      { value: 'radical', label: 'Radical (bright)' },
      { value: 'merko', label: 'Merko (green)' },
      { value: 'gruvbox', label: 'Gruvbox' },
      { value: 'tokyonight', label: 'Tokyo Night' }
    ],
    next: 'showStatsCard'
  },
  {
    id: 'showStatsCard',
    section: 'Statistics',
    label: 'Show Stats Card',
    description: 'Do you want to show your GitHub stats card?',
    component: 'Toggle',
    next: 'showContribGraph'
  },
  {
    id: 'showContribGraph',
    section: 'Statistics',
    label: 'Show Contribution Graph',
    description: 'Do you want to render the contribution graph card?',
    component: 'Toggle',
    next: 'customTitle'
  },

  // SECTION: Customization & Support
  {
    id: 'customTitle',
    section: 'Customization',
    label: 'Custom Section Title',
    description: 'Do you want to add a custom section? Enter its title here.',
    placeholder: 'e.g. My Open Source Philosophy, Latest Blog Posts...',
    component: 'Text',
    next: (formData) => formData.customTitle ? 'customContent' : 'visitorStyle'
  },
  {
    id: 'customContent',
    section: 'Customization',
    label: 'Custom Section Content',
    description: 'Enter your custom section markdown content.',
    placeholder: 'Write markdown or text...',
    component: 'Textarea',
    next: 'visitorStyle'
  },
  {
    id: 'visitorStyle',
    section: 'Customization',
    label: 'Visitor Counter Style',
    description: 'Choose a visitor badge style (optional).',
    component: 'Dropdown',
    options: [
      { value: 'badge', label: 'Shields.io Badge' },
      { value: 'none', label: 'No Visitor Counter' }
    ],
    next: 'review'
  },
  {
    id: 'review',
    section: 'Preview',
    label: 'Review Configuration',
    description: 'Review your responses before generating the final README.',
    component: 'Review Screen',
    next: 'done'
  }
];

// Project Builder Questions Flow
export const PROJECT_QUESTIONS = [
  {
    id: 'repoUrl',
    section: 'Repository Input',
    label: 'GitHub Repository URL',
    description: 'What is the URL of the public GitHub repository you want to scan?',
    placeholder: 'e.g. https://github.com/facebook/react',
    component: 'URL',
    required: true,
    validator: (v) => {
      if (!v) return 'Repository URL is required';
      if (!v.startsWith('https://github.com/')) {
        return 'Must be a valid GitHub repository URL (starts with https://github.com/)';
      }
      return true;
    },
    next: 'scanner'
  },
  {
    id: 'scanner',
    section: 'Analysis Pipeline',
    label: 'Analyzing Repository',
    description: 'Hold tight while our Repository Intelligence scans your stack...',
    component: 'Scanner Progress',
    next: 'review'
  },
  {
    id: 'review',
    section: 'Generate & Preview',
    label: 'Review README',
    description: 'Your project README is ready! Customize it below.',
    component: 'Review Screen',
    next: 'done'
  }
];
