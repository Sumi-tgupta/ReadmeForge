import React, { lazy, Suspense } from 'react';
import { useGenerator } from '../../hooks/useGenerator';

// Lazy-load all step components for code splitting
const BasicInfoStep = lazy(() => import('../../features/generator/steps/BasicInfoStep'));
const SectionSelectorStep = lazy(() => import('../../features/generator/steps/SectionSelectorStep'));
const AboutMeStep = lazy(() => import('../../features/generator/steps/AboutMeStep'));
const TechStackStep = lazy(() => import('../../features/generator/steps/TechStackStep'));
const LearningStep = lazy(() => import('../../features/generator/steps/LearningStep'));
const ProjectsStep = lazy(() => import('../../features/generator/steps/ProjectsStep'));
const ExperienceStep = lazy(() => import('../../features/generator/steps/ExperienceStep'));
const OpenSourceStep = lazy(() => import('../../features/generator/steps/OpenSourceStep'));
const StatsStep = lazy(() => import('../../features/generator/steps/StatsStep'));
const TrophiesStep = lazy(() => import('../../features/generator/steps/TrophiesStep'));
const StreakStep = lazy(() => import('../../features/generator/steps/StreakStep'));
const LanguagesStep = lazy(() => import('../../features/generator/steps/LanguagesStep'));
const SocialStep = lazy(() => import('../../features/generator/steps/SocialStep'));
const EducationStep = lazy(() => import('../../features/generator/steps/EducationStep'));
const HobbiesStep = lazy(() => import('../../features/generator/steps/HobbiesStep'));
const SupportStep = lazy(() => import('../../features/generator/steps/SupportStep'));
const VisitorStep = lazy(() => import('../../features/generator/steps/VisitorStep'));
const CustomStep = lazy(() => import('../../features/generator/steps/CustomStep'));
const GeneratePreview = lazy(() => import('../../features/generator/GeneratePreview'));

const STEP_MAP = {
  'basic-info': BasicInfoStep,
  'section-selector': SectionSelectorStep,
  about: AboutMeStep,
  tech: TechStackStep,
  learning: LearningStep,
  projects: ProjectsStep,
  experience: ExperienceStep,
  opensource: OpenSourceStep,
  stats: StatsStep,
  trophies: TrophiesStep,
  streak: StreakStep,
  languages: LanguagesStep,
  social: SocialStep,
  education: EducationStep,
  hobbies: HobbiesStep,
  support: SupportStep,
  visitor: VisitorStep,
  custom: CustomStep,
  generate: GeneratePreview,
};

/**
 * Routes the current wizard step to the correct component.
 * All step components are lazy-loaded for code splitting.
 */
export default function StepContainer() {
  const { currentStep } = useGenerator();
  const StepComponent = STEP_MAP[currentStep];

  if (!StepComponent) {
    return <p>Unknown step: {currentStep}</p>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StepComponent />
    </Suspense>
  );
}
