import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({
  blog, user, addLike, deleteBlog,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const changeDetailDisplay = () => {
    const currentState = showDetails;
    setShowDetails(!currentState);
  };

  const sendLike = async () => {
    await addLike(blog);
  };

  const removeBlog = async () => {
    deleteBlog(blog);
  };

  return (
    <div className="blog">
      {`${blog.title} - ${blog.author}`}
      <button type="button" onClick={changeDetailDisplay}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            {`likes: ${blog.likes}`}
            <button onClick={sendLike} type="button">like</button>
          </div>
          <div>
            {`added by: ${blog.user.username}`}
            {
              blog.user.username === user.username
              && (
                <button onClick={removeBlog} type="button">remove</button>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      id: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
