import React from 'react';

function Notification({ content }) {
  if (content) {
    return (
      <div>
        {content}
      </div>
    );
  }
}

export default Notification;
