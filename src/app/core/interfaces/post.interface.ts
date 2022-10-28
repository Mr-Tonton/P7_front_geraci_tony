export interface Post {
  userId: string;
  postContent: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
