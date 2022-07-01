const dummy = (/* blogs */) => (
  1
);

const totalLikes = (blogs) => (
  blogs.reduce((a, b) => a + b.likes, 0)
);

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.map((a) => a.likes);
  return blogs.find((a) => a.likes === Math.max(...blogLikes));
};

const mostBlogs = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (Object.keys(authors).includes(blog.author)) {
      authors[blog.author] += 1;
    } else {
      authors[blog.author] = 1;
    }
  });
  const authorWithMostBlogs = Object.keys(authors)
    .find((a) => authors[a] === Math.max(...Object.values(authors)));
  if (!authorWithMostBlogs) {
    return undefined;
  }
  return {
    author: authorWithMostBlogs,
    blogs: authors[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (Object.keys(authors).includes(blog.author)) {
      authors[blog.author] += blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });
  const authorWithMostLikes = Object.keys(authors)
    .find((a) => authors[a] === Math.max(...Object.values(authors)));
  if (!authorWithMostLikes) {
    return undefined;
  }
  return {
    author: authorWithMostLikes,
    likes: authors[authorWithMostLikes],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
