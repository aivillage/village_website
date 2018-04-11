import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import withRoot from '../../withRoot';
import logoPath from '../../../public/img/site-logo.png';

const styles = theme => ({
  flex: {
    flex: 1,
    paddingLeft: 48,
  },
  logo: {
    height: '48px',
  },
  navButton: {
    marginLeft: -12,
    marginRight: 20,
    color: grey[500],
    textTransform: 'none',
    fontSize: '1em',
  },
});


class Navbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            <img className={classes.logo} src={logoPath} />
          </Typography>
          <Button className={classes.navButton}>
            Announcements
          </Button>
          <Button className={classes.navButton}>
            Blog
          </Button>
          <Button className={classes.navButton}>
            Patron
          </Button>
          <Button className={classes.navButton}>
            Join Us
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Navbar));