import React from 'react';
import { cn } from '@/lib/utils';
import { Globe, Link as LinkIcon, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  iconSize?: number;
}

export function SocialLinks({ 
  github, 
  linkedin, 
  twitter, 
  email, 
  iconSize = 20,
  className,
  ...props 
}: SocialLinksProps) {
  const iconClass = "text-muted-foreground hover:text-foreground transition-colors";
  
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {github && (
        <a href={github} target="_blank" rel="noreferrer" className={cn("text-muted-foreground hover:text-foreground transition-colors", iconClass)}>
          <Globe size={iconSize} />
          <span className="sr-only">GitHub</span>
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noreferrer" className={cn("text-muted-foreground hover:text-foreground transition-colors", iconClass)}>
          <LinkIcon size={iconSize} />
          <span className="sr-only">LinkedIn</span>
        </a>
      )}
      {twitter && (
        <a href={twitter} target="_blank" rel="noreferrer" className={cn("text-muted-foreground hover:text-foreground transition-colors", iconClass)}>
          <MessageSquare size={iconSize} />
          <span className="sr-only">Twitter</span>
        </a>
      )}
      {email && (
        <Link href={`mailto:${email}`} aria-label="Email">
          <Mail size={iconSize} className={iconClass} />
        </Link>
      )}
    </div>
  );
}
