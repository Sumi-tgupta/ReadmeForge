import {
  User, Code2, GraduationCap, Rocket, Briefcase,
  GitBranch, BarChart3, Trophy, Flame, PieChart,
  Share2, Award, Gamepad2, Heart, Eye, FileText,
} from 'lucide-react';

/**
 * Section definitions for the README builder wizard.
 * Each section has a key (used in form state), display name, icon,
 * description, and optional `required` flag.
 */
export const SECTION_DEFS = [
  { key: 'about', name: 'About Me', icon: User, desc: 'A brief introduction about yourself', required: true },
  { key: 'tech', name: 'Tech Stack & Tools', icon: Code2, desc: 'Showcase your technical skills with badges' },
  { key: 'learning', name: 'Currently Learning', icon: GraduationCap, desc: "Technologies you're currently exploring" },
  { key: 'projects', name: 'Projects Showcase', icon: Rocket, desc: 'Highlight your best projects with descriptions' },
  { key: 'experience', name: 'Work Experience', icon: Briefcase, desc: 'Your professional journey and roles' },
  { key: 'opensource', name: 'Open Source Contributions', icon: GitBranch, desc: 'Your contributions to open source' },
  { key: 'stats', name: 'GitHub Stats & Activity', icon: BarChart3, desc: 'Dynamic GitHub statistics cards' },
  { key: 'trophies', name: 'GitHub Trophies', icon: Trophy, desc: 'Display your GitHub achievement trophies' },
  { key: 'streak', name: 'Streak Stats', icon: Flame, desc: 'Show your contribution streak' },
  { key: 'languages', name: 'Top Languages Card', icon: PieChart, desc: 'Visualize your most-used languages' },
  { key: 'social', name: 'Social Links & Contact', icon: Share2, desc: 'Connect with visitors via social platforms' },
  { key: 'education', name: 'Certifications & Education', icon: Award, desc: 'Your academic and certification credentials' },
  { key: 'hobbies', name: 'Hobbies & Fun Facts', icon: Gamepad2, desc: 'Share your interests and fun facts' },
  { key: 'support', name: 'Support / Sponsor Me', icon: Heart, desc: 'Let people support your work' },
  { key: 'visitor', name: 'Visitor Counter', icon: Eye, desc: 'Track profile visits with a counter badge' },
  { key: 'custom', name: 'Custom Section', icon: FileText, desc: 'Add any custom markdown content' },
];
