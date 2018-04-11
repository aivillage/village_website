import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';
import Announcements from '../components/Announcements/Announcements';
import MailingListSignup from '../components/MailingListSignup/MailingListSignup';
import TwitterTimeline from 'react-twitter-embedded-timeline';
import Footer from '../components/Footer/Footer';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
  },
  twitterTimeline: {
    paddingBottom: '2%',
  }
});

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Navbar/>
        <Header/>

        <Grid container spacing={0}>
          <Grid item xs={4}/>
          <Grid item xs={4} className={classes.twitterTimeline}>
            <TwitterTimeline
              widgetId="983956800847294464"
              chrome="noborders noheader transparent"
              height={300}
              width={1000}
            />
          </Grid>
          <Grid item xs={4}/>
        </Grid>

        <MailingListSignup/>
        <Footer/>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
