import {
  Globe, MessageCircle, Monitor, Code2, Hash,
  BookOpen, Terminal, PenTool, Mail, Coffee,
  Heart, DollarSign,
} from 'lucide-react';

/**
 * Social platform definitions for the social links section.
 * Each has an id (used as form key), display name, and icon component.
 */
export const SOCIAL_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Globe },
  { id: 'twitter', name: 'Twitter / X', icon: MessageCircle },
  { id: 'instagram', name: 'Instagram', icon: Monitor },
  { id: 'youtube', name: 'YouTube', icon: Monitor },
  { id: 'discord', name: 'Discord', icon: MessageCircle },
  { id: 'devto', name: 'Dev.to', icon: Code2 },
  { id: 'hashnode', name: 'Hashnode', icon: Hash },
  { id: 'medium', name: 'Medium', icon: BookOpen },
  { id: 'leetcode', name: 'LeetCode', icon: Code2 },
  { id: 'hackerrank', name: 'HackerRank', icon: Terminal },
  { id: 'codepen', name: 'CodePen', icon: Code2 },
  { id: 'dribbble', name: 'Dribbble', icon: PenTool },
  { id: 'behance', name: 'Behance', icon: PenTool },
  { id: 'portfolio', name: 'Portfolio', icon: Globe },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'buymeacoffee', name: 'Buy Me a Coffee', icon: Coffee },
  { id: 'kofi', name: 'Ko-fi', icon: Heart },
  { id: 'patreon', name: 'Patreon', icon: DollarSign },
];
