import { APIResponse, GenericErrors } from ".";
import { User } from "./users";

type GetPostsSortOption = "recent";

export type GetPostsParams = {
  sort: GetPostsSortOption;
};

export type Vote = {
  id: number;
  postId: number;
  voteType: "Upvote" | "Downvote";
};

export type Comment = object;

export type Post = {
  id: number;
  memberId: number;
  memberPostedBy: {
    user: User;
  };
  votes: Vote[];
  comments: Comment[];
  postType: string;
  title: string;
  content: string;
  dateCreated: string;
};

export type GetPostsErrors = GenericErrors;
export type GetPostsResponse = APIResponse<Post[], GetPostsErrors>;

export type PostsResponse = GetPostsResponse;
