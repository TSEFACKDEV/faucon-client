'use client';

import Hero from './Hero';
import LandingHeader from './LandingHeader';
import DeveloperSection from './DeveloperSection';
import {
  AmbitionSection,
  ChallengeSection,
  ContactSection,
  InnovationSection,
  LandingFooter,
  OpportunitySection,
  ProblemSection,
  SolutionSection,
} from './LandingSections';

import { useLanguage } from '@/i18n/LanguageProvider';

export default function LandingExperience() {
  const { tr } = useLanguage();
  return (
    <div className="bg-neutral-0">
      <a
        href="#solution"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-700"
      >
        {tr('Aller au contenu', 'Skip to content')}
      </a>
      <LandingHeader />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <OpportunitySection />
        <InnovationSection />
        <DeveloperSection />
        <ChallengeSection />
        <AmbitionSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
