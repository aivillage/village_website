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
import { Timeline } from 'react-twitter-widgets'
import Footer from '../components/Footer/Footer';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F3F4F6',
  },
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% - 56px - 64px)', // 56px is footer height
    overflowY: 'scroll',
  },
  twitterTimeline: {
    marginBottom: '2%',
    height: '30%',
    overflow: 'hidden',
  }
});

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Navbar/>
        <div className={classes.body}>
          <Header/>
          <Grid container spacing={0}>
            <Grid item xs={3}/>
            <Grid item xs={6} className={classes.twitterTimeline}>
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'aivillage_dc'
                }}
                options={{
                  chrome: 'noborders noheader nofooter transparent',
                  height: '500'
                }}
                onLoad={() => console.log('Timeline is loaded!')}
              />
            </Grid>
            <Grid item xs={3}/>
          </Grid>

          <MailingListSignup/>
        </div>
        <Footer/>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
