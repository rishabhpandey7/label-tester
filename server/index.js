require('dotenv').config();
const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');

const EasyPost = require('@easypost/api');

const apiKey = 'EZTK82f840c6893449c2be1bde8802a042324akXme85r5W5FsCfheIATA'; 


const api = new EasyPost(apiKey);
let carriers = [];

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.post("/postage_label", (req, res) => {
    let ship = req.body.shipment;
    ship = ship.shipment;
    carriers = [];
    if (ship.USPS) {
        carriers.push('ca_a88d8433196e42a3a2e649c69f369835')
    };

    console.log(ship.length, ship.width, ship.height, ship.weight, ship.predefinedPackage);

    const parcel = new api.Parcel({
        length: ship.length,
        width: ship.width,
        height: ship.height,
        predefined_package: ship.predefinedPackage,
        weight: ship.weight,
    })

    const toAddress = new api.Address({
        name: ship.toName,
        street1: ship.toStreet1,
        street2: ship.toStreet2,
        city: ship.toCity,
        state: ship.toState,
        country: ship.toCountry,
        zip: ship.toZip,
        
    });

    const fromAddress = new api.Address({
        name: ship.fromName,
        street1: ship.fromStreet1,
        street2: ship.fromStreet2,
        city: ship.fromCity,
        state: ship.fromState,
        country: ship.fromCountry,
        zip: ship.fromZip,
        
    });

    const label = async(id) => {
        const sl = await api.retrieve(id);
        const saved = await sl.convertLabelFormat('ZPL');
        return saved;
    }
    // console.log(ship); // for troubleshooting purposes
    const shipment = new api.Shipment({
        to_address: toAddress,
        from_address: fromAddress,
        parcel: parcel,
        options:{
            label_Format: "PNG",
        },

        // customs_info: customsInfo, // for international shipments, not on current MVP
        // is_return: true, // for creating return labels, not on current MVP
    })

 //   shipment.save().then(() => {
 // shipment.buy(shipment.lowestRate(['USPS'], ['First'])).then(res => {
   // console.log(res.postage_label.label_url);
    //console.log(res.tracker.public_url);
    //OpenURL.open(res.postage_label.label_url);
    //OpenURL.open(res.tracker.public_url);
//  });
    const result = shipment.save().then((result) => { res.send(result) }).catch(console.log);

});


app.listen(port, () => console.log(`listening on port ${port}!`))
