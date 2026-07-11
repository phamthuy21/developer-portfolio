export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string | null;
  images: string[];
  technologies: string[]; // keep for backwards compatibility if needed, or remove? I will remove technologies and use skills.
  skills: { id: string; name: string }[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
