import React from 'react';
import PropTypes from 'prop-types';
import Typed from 'react-typed';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  header: {
    width: '65%',
    margin: '0 auto',
    padding: '5% 0px',
    backgroundColor: '#F3F4F6',
  },
  mission: {
    textAlign: 'center',
    color: '#38404F',
    fontSize: '3.25vw',
    fontWeight: 400,
    fontFamily: 'source serif pro',
  },
  emphasis: {
    color: '#DE3F1C',
    fontWeight: 700,
  }
});


class Header extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <div className={classes.mission}>
          Educating&nbsp;
          <Typed 
            strings={[
              'the world',
              'DEF CON',
              'ourselves',
              'you',
              'politicians',
              'security professionals',
              'the public',
              'decision makers',
              'children',
              'hackers',
            ]}
            typeSpeed={100}
            backSpeed={100}
            backDelay={1000}
            shuffle={true}
            smartBackspace={true}
            loop={true} />
          on the<br/><a className={classes.emphasis}>use and abuse of AI</a> in security and privacy.
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Header));