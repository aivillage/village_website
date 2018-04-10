import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Navbar/>
        <Header/>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
