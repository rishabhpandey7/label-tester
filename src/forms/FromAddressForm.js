import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});


class FromAddressForm extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            multiline: 'Controlled',
            currency: 'EUR',
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <form className={classes.container} noValidate autoComplete="off">
                <TextField variant="outlined"
                    id="from-name"
                    label="Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                />
                <TextField variant="outlined"
                    id="from-street1"
                    label="Street Line 1"
                    className={classes.textField}
                    value={this.state.street1}
                    onChange={this.handleChange('street1')}
                    margin="normal"
                /><break></break>
                <TextField variant="outlined"
                    id="from-street2"
                    label="Street Line 2"
                    className={classes.textField}
                    value={this.state.street2}
                    onChange={this.handleChange('street2')}
                    margin="normal"
                />
                <TextField variant="outlined"
                    id="from-city"
                    label="City"
                    className={classes.textField}
                    value={this.state.city}
                    onChange={this.handleChange('city')}
                    margin="normal"
                />
                <TextField variant="outlined"
                    id="from-state"
                    label="State"
                    className={classes.textField}
                    value={this.state.state}
                    onChange={this.handleChange('state')}
                    margin="normal"
                />
                <TextField variant="outlined"
                    id="from-country"
                    label="Country"
                    className={classes.textField}
                    // value={this.state.country}
                    value="US" // currently only US is supported pending possible addition of international shipping
                    onChange={this.handleChange('country')}
                    margin="normal"
                />
                <TextField variant="outlined"
                    required
                    id="from-zip"
                    label="Zip Code"
                    value={this.state.zip}
                    className={classes.textField}
                    onChange={this.handleChange('zip')}
                    margin="normal"
                />

            </form>
        );
    }
}

FromAddressForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FromAddressForm);