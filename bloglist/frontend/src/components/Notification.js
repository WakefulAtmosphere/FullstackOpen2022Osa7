import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Notification = ({ notification }) => {
  if (notification) {
    return (
      <div>
        {notification}
      </div>
    );
  }
  return false;
};

Notification.propTypes = {
  notification: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  notification: state.notifications,
});

const connectedNotification = connect(mapStateToProps)(Notification);
export default connectedNotification;
