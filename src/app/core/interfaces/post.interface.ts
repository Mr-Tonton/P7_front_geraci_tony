export interface Post {
  userId: string;
  postContent: string;
  imageUrl?: string;
  likes: number;
  usersLiked: [string];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
