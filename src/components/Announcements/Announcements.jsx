import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  announcements: {
    width: '65%',
    margin: '0 auto',
    backgroundColor: '#F3F4F6',
  },
});


class Announcements extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.announcements}>
      </div>
    );
  }
}

Announcements.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Announcements));