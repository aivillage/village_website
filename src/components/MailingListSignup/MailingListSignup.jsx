import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import grey from 'material-ui/colors/grey';

import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  section: {
    width: '55%',
    margin: '0 auto',
    paddingBottom: '5%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  message: {
    textAlign: 'center',
    flex: '0 1 100%',
    color: grey[600],
    fontSize: '1.5rem',
    fontWeight: 400,
    fontFamily: 'source sans pro',
    paddingBottom: '3%',
  },
  subscribeInput: {
    width: '20%',
    flex: '1 0 50%',
  },
  emailInput: {
    float: 'right',
    width: '60%',
  },
  subscribeSubmit: {
    flex: '1 0 30%',
  },
  button: {
    margin: '0 auto',
    backgroundColor: '#65D777',
    color: 'white',
    height: '100%',
    marginLeft: '5%',
  }
});


class MailingListSignup extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <div className={classes.message}>
          Follow us on our journey, subscribe to our mailing list
        </div>
        <div className={classes.subscribeInput}>
          <TextField
            className={classes.emailInput}
            id="input-with-icon-textfield"
            label="E-mail"
            // fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>mail_outline</Icon>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.subscribeSubmit}>
          <Button variant="raised" className={classes.button}>
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}

MailingListSignup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(MailingListSignup));