import { Database } from "../../shared/database";

export class PostsService {
  constructor(private readonly db: Database) {}
  public async getAllPosts() {
    const posts = await this.db.posts.findAllPosts();
    return posts;
  }
}
