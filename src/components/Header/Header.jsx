import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  header: {
    width: '65%',
    margin: '0 auto',
    padding: '32px 0px',
  },
  mission: {
    textAlign: 'center',
    color: '#38404F',
    fontSize: '3.25rem',
  },
  emphasis: {
    color: '#DE3F1C',
  }
});


class Header extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <Typography variant="title" color="inherit" className={classes.mission}>
          Educating security professionals about the <a className={classes.emphasis}>use and abuse of AI</a> <wbr />in security and privacy
        </Typography>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Header));