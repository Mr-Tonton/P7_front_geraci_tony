export interface Comment {
  _id: string;
  userId: string;
  commentContent: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}
