const PATH = "./data.json";
const fs = require("fs");

class Post {
  get() {
    return this.readData();
  }

  getIndividualBlog(postId) {
    const posts = this.readData();
    const foundPost = posts.find((post) => post.id == postId);
    return foundPost;
  }

  add(newPost) {
    const currentPost = this.readData();
    currentPost.unshift(newPost);
    this.storeData(currentPost);
  }

  readData() {
    let rawdata = fs.readFileSync(PATH);
    let posts = JSON.parse(rawdata);
    return posts;
  }

  storeData(rawData) {
    let data = JSON.stringify(rawData);
    fs.writeFileSync(PATH, data);
  }

  // deleteData(postId) {
  //   let rawdata = fs.readFileSync(PATH);
  //   let posts = JSON.parse(rawdata);

  //   let index = posts.forEach{
  //     posts.findIndex((post) => post.id === post.postId);
  //   }
  //   let newData = JSON.stringify(
  //     posts.filter((posts) => posts[index].id !== posts[index].postId)
  //   );

  //   fs.writeFileSync(PATH, newData);
  // }
}

module.exports = Post;
