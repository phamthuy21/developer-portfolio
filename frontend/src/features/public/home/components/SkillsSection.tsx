"use client";

import React from 'react';
import { Section } from '@/components/public/Section';
import { SectionTitle } from '@/components/public/SectionTitle';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { TechnologyBadge } from '@/components/public/TechnologyBadge';
import { SkillCategoryGroup } from '../../skills/api/get-public-skills';
import { EmptyState } from '@/components/public/EmptyState';

interface SkillsSectionProps {
  skillsGroups: SkillCategoryGroup[];
}

export function SkillsSection({ skillsGroups }: SkillsSectionProps) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsGroups.map((group, index) => (
          <AnimatedReveal key={group.category} delay={index * 0.1}>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <TechnologyBadge 
                    key={skill.id} 
                    name={skill.name} 
                    variant="outline" 
                    className="text-sm py-1"
                  />
                ))}
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </Section>
  );
}

