import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Toggles from './Toggles.js';
import ToAddressForm from './forms/ToAddressForm';
import FromAddressForm from './forms/FromAddressForm';
import LabelSize from './forms/LabelSize';
import LabelFormat from './forms/LabelFormat';
import Button from '@material-ui/core/Button';
import Package from './forms/Package';
import axios from "axios";
import CircularIndeterminate from './components/CircularIndeterminate';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Swal from 'sweetalert2';
import routes from "./routes";
import { Link } from 'react-router-dom';

require('dotenv').config();

let carriers = [];

// const styles = {
//   card: {
//     maxWidth: 345,
//   },
//   media: {
//     height: 140,
//   },
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      rates: "",
      isLoading: false,
      data: [],
      post: {},
      messages: []
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.getRates = this.getRates.bind(this);
    this.dotGet = this.dotGet.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  handleClick(e) {
    this.setState({ anchorEl: e.currentTarget });
  }

  handleTouchTap(e) {
    this.setState({ anchorEl: null });
  }

  getRates() {
    let setLength = 1;
    let setWidth = 1;
    let setHeight = 1;
    let setWeight = 1;
    let setPDP = 'null';
    this.setState({ isLoading: true })
    if (document.getElementById("length")) {
      setLength = document.getElementById("length").value
    }
    if (document.getElementById("width")) {
      setWidth = document.getElementById("width").value
    }
    if (document.getElementById("height")) {
      setHeight = document.getElementById("height").value
    }
    if (document.getElementById("weight")) {
      setWeight = document.getElementById("weight").value
    }
    if (document.getElementById("PDP")) {
      setPDP = document.getElementById("PDP").value
    }
    let shipment = {
      fromName: document.getElementById("from-name").value,
      fromStreet1: document.getElementById("from-street1").value,
      fromStreet2: document.getElementById("from-street2").value,
      fromCity: document.getElementById("from-city").value,
      fromState: document.getElementById("from-state").value,
      fromCountry: document.getElementById("from-country").value,
      fromZip: document.getElementById("from-zip").value,
      toName: document.getElementById("to-name").value,
      toStreet1: document.getElementById("to-street1").value,
      toStreet2: document.getElementById("to-street2").value,
      toCity: document.getElementById("to-city").value,
      toState: document.getElementById("to-state").value,
      toCountry: document.getElementById("to-country").value,
      toZip: document.getElementById("to-zip").value,
      length: parseInt(setLength),
      width: parseInt(setWidth),
      height: parseInt(setHeight),
      weight: parseInt(setWeight),
      predefinedPackage: setPDP,
    }
    setTimeout(this.dotGet({ shipment }), 1000);
    this.setState({ rates: true })
  }

  dotGet(shipment) {
    let that = this; // this is a way to access this.state within the scope of the below nested function
    axios.post(`http://localhost:3001/postage_label`, { shipment }).then(function (response) {
      let temp = response.data.messages;
      that.setState({ data: response.data.rates });
      that.setState({ post: response.data.postage_label }); 
      that.setState({ messages: temp });
      console.log(that.state.messages);
      that.stopLoading();
    })
  }

  stopLoading() {
    this.setState({ isLoading: false })
  }

  showDetails(e) {
    e.preventDefault(); //preventing some default logic that normally happens with an onclick event.
    //Below we are going to display some shipment/rate identifying numbers when the user clicks on 'details'. 
    // EasyPost persists these ID's in their system so you can refer to them again. We are displaying them with Sweet Alerts
    let that = this;
    Swal.fire({
    	title: 'Here you go!',
    	text: 'This is a standard test label. Customized postage label is available only after buying.',
    	imageUrl: 'https://raw.githubusercontent.com/ccheung0926/Print-a-USPS-Shipping-Label/master/server/label.png',
    	imageWidth: 454,
    	imageHeight: 678,
    	imageAlt: 'Custom image',
    	backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
  `
      //html: `<h3>Rate Details</h3><table className="detailsTable"><tr><td><b>Shipment ID:</b> ${d.shipment_id}</td></tr>` +
        //`<tr><td><b>Rate ID:</b> ${d.id}</td></tr>` +
        //`<tr><td><b>Carrier:</b> ${d.carrier}</td></tr>` +
        //`</table>`
    })
  }


  render() {
    const { anchorEl } = this.state;
    let results = this.state.data.map((d, i) => { // Mapping through results and rendering cards only as many as are needed
      return (<Card id="cardy">
        <CardActionArea className="mediaCard">
          <CardMedia
            // className={classes.media}
            image="http://allvectorlogo.com/img/2016/06/united-states-postal-service-usps-logo.png"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h1">
              ${d.rate}
            </Typography>
            <Typography component="p">
              USPS {d.service}
            </Typography>
            <Typography component="span">
              {d.created_at}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* <Button size="small" color="primary">
              Purchase
  </Button> */}
          <Button size="small" color="default" onClick={e => this.showDetails(e)}>
            Show Test Label
  </Button>
        </CardActions>
      </Card>
      )
    })
    // let errors = this.state.messages.map((d, i) => {  // was thinking about how to handle rate error messages should they occur, future plans.
    //   return (
    //     <div className='errors'>
    //       {d}
    //     </div>

    //   )
    // })
    return (
      <div className="App" >
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <AppBar
            title="Print USPS Shipping Label"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            href="#"
            onClick={this.handleClick}
            className="AppBar"
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <Divider />
            <Link to={{ pathname: '/' }}><MenuItem onClick={this.handleTouchTap}>Go to Home</MenuItem></Link>
            <Divider />
          </Menu>
          {!this.state.rates && window.location.hash === '#/' && <div className="bodyWrap">
            <div>
              <h3>From Address</h3>
              <FromAddressForm />
            </div>
            <div>
              <h3>Destination Address</h3>
              <ToAddressForm />
            </div>
            <div>
              <h3>Package</h3>
              <Package />
            </div>
          </div>}<break></break>
          {!this.state.rates && window.location.hash === '#/' && <Button color="primary" variant="outlined" onClick={this.getRates}>
            Submit
            </Button>}
          <break></break>
          <ul className="line">
            <Divider />
          </ul><break></break>
          {this.state.isLoading && <CircularIndeterminate />}
          <break></break>
          {this.state.rates && <h3>Labels</h3>}
          {this.state.rates && !this.state.isLoading &&
            <div className='cardWrap'>
              {this.state.data && this.state.rates && !this.state.isLoading &&
                <div className="resultsWrapper">
                  {results}
                  <break></break>
                  {/* {errors} */}
                </div>
              }
            </div>
          }
        </MuiThemeProvider>
        {routes}
      </div >


    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (App);
