
export class PostRepository {
    constructor() {
        this.posts = [];
    }

    guardarPost(post) {
        if(this.posts.length > 0) {
            const idsPosts = this.posts.map((post) => post.id);
            post.id = Math.max(...idsPosts) + 1;
        } else {
            post.id = 1;
        }

        this.posts.push(post);
    }

    obtenerPosts() {
        return this.posts;
    }
}