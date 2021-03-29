module.exports = {
    createPost(parent, {author, comment}, context) {
        const newPost = {
            id: (Math.random() * 10000) | 0,
            author,
            comment,
        }; 
        context.pubsub.publish('POST_CREATED', { postCreated: newPost });
        return newPost;
    }
};