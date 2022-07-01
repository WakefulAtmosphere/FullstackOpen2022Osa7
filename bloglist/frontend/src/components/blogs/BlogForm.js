import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ submitBlog }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    submitBlog(blogObject);
    setBlogAuthor('');
    setBlogTitle('');
    setBlogUrl('');
  };

  return (
    <div>
      <h2>Submit new blog</h2>
      <form onSubmit={handleBlogSubmit}>
        <div>
          title:
          <input
            type="text"
            value={blogTitle}
            name="Title"
            id="title-input"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            id="author-input"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={blogUrl}
            name="Url"
            id="url-input"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit" id="blog-submit">submit</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  submitBlog: PropTypes.func.isRequired,
};

export default BlogForm;
