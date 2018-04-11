import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from 'material-ui/BottomNavigation';
import grey from 'material-ui/colors/grey';
import { Slack, Twitter } from 'mdi-material-ui'
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  footer: {
    backgroundColor: '#F3F4F6',
  },
  footerIcon: {
    paddingRight: '3%',
    color: grey[600],
    cursor: 'pointer',
  }
});


class Footer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <BottomNavigation className={classes.footer}>
        <Slack className={classes.footerIcon}
          onClick={() =>
            window.open('https://aivillage.slack.com/join/shared_invite/enQtMzIyNzcwNDE2MjQzLWIwYmM5N2UzYjYyMWM3YzRmZjNlYjU2MWY5ODM0ZWIxNTJlMzViZDAyNTAzOThiNjQ2ZjY4NzZmN2NlNmEyZDE', '_blank')
          }/>
        <Twitter className={classes.footerIcon}
          onClick={() =>
            window.open('https://twitter.com/aivillage_dc', '_blank')
        }/>
      </BottomNavigation>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Footer));