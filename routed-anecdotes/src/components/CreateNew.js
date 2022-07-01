import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks';

function CreateNew({ addNew, createNotification }) {
  const content = useField();
  const author = useField();
  const info = useField();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate('/');
    createNotification(`anecdote ${content.value} added succesfully`, 5);
  };

  const reset = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...{ ...content, reset: undefined }} />
        </div>
        <div>
          author
          <input {...{ ...author, reset: undefined }} />
        </div>
        <div>
          url for more info
          <input {...{ ...info, reset: undefined }} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={reset}>reset</button>
      </form>
    </div>
  );
}

export default CreateNew;
