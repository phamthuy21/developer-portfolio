"use client";

import React from 'react';
import { Section } from '@/components/public/Section';
import { SectionTitle } from '@/components/public/SectionTitle';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { SkillCategoryGroup } from '../../skills/api/get-public-skills';
import { EmptyState } from '@/components/public/EmptyState';
import Image from 'next/image';
import { Code2 } from 'lucide-react';

interface SkillsSectionProps {
  skillsGroups: SkillCategoryGroup[];
}

export function SkillsSection({ skillsGroups }: SkillsSectionProps) {
  const allSkills = React.useMemo(() => {
    return Array.isArray(skillsGroups) ? skillsGroups.flatMap((group) => group.skills) : [];
  }, [skillsGroups]);

  if (!Array.isArray(skillsGroups)) {
    console.error('[SkillsSection] Invalid skillsGroups — expected array, received:', skillsGroups);
    return (
      <Section>
        <SectionTitle title="My Skills" subtitle="Technologies I work with" />
        <EmptyState title="No skills found" description="Skills data is currently unavailable." />
      </Section>
    );
  }

  if (skillsGroups.length === 0) {
    return (
      <Section>
        <SectionTitle title="My Skills" subtitle="Technologies I work with" />
        <EmptyState title="No skills found" description="Skills data is currently unavailable." />
      </Section>
    );
  }

  return (
    <Section className="bg-muted/10">
      <SectionTitle title="My Skills" subtitle="Technologies and tools I use to build digital products" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSkills.map((skill, index) => (
          <AnimatedReveal key={skill.id} delay={index * 0.05}>
            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                {skill.iconUrl ? (
                  <Image 
                    src={skill.iconUrl} 
                    alt={skill.name}
                    fill
                    sizes="48px"
                    className="object-contain p-2"
                  />
                ) : (
                  <Code2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-base font-medium leading-none">
                {skill.name}
              </h3>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </Section>
  );
}

