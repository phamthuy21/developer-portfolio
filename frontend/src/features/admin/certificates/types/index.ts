export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  credentialId: string | null;
  thumbnail: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
