import React from 'react';
import {
  useParams,
} from 'react-router-dom';

function Anecdote({ anecdotes }) {
  const { id } = useParams();
  const anecdote = anecdotes.find((n) => n.id === Number(id));
  return (
    <div>
      <h1>{`${anecdote.content} by ${anecdote.author}`}</h1>
      <p>{`has ${anecdote.votes} votes`}</p>
      <p>
        for more information, see
        {' '}
        <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  );
}

export default Anecdote;
