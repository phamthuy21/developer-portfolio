export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
