const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts(){
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }){
            try {
                const post = await Post.findById(postId);

                if(post){
                    return post;
                }
                else {
                    throw new Error('Post not found');
                }
            } catch(err) {
                throw new Error(err);
            }
        },

        async getPostsByUser(_, { username }){
            try {
                const posts = await Post.find({ username: username });
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);

            if (body.trim() === ''){
                throw new Error('Post body cannot be empty.');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });

            const post = await newPost.save();

            return post;
        },

        async deletePost(_, { postId }, context){
            const user = checkAuth(context);
            
            try {
                const post = await Post.findById(postId);
                if(!post){
                    throw new Error('Post not found');
                }
                if(user.username === post.username){
                    await post.delete();
                    return "Post deleted.";
                } else {
                    throw new AuthenticationError('Not owner of post.');
                }
            } catch(err){
                throw new Error(err);
            }
        },

        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find((like) => like.username === username)){
                    // Post was already liked by this user (remove it)
                    post.likes = post.likes.filter((like) => like.username !== username);
                } else {
                    // User has not yet liked post (like it)
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else {
                throw new Error('Post not found')
            }
        }
    }
}