const parser = require('ua-parser-js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient;
const client = new WebServiceClient(process.env.GEO_LOCATE_ACCOUNT_ID, process.env.GEO_LOCATE_LICENSE_KEY, {host: 'geolite.info'});

const geoCityPromise = (IP) => {
    return new Promise((resolve, reject) => {
        client.city(IP).then(response => {
            resolve(response); // 'CA'
        }).catch(err => {
            reject(err)
        });
    })
}

const getUserAgentDetails = ua => {
    if (ua.device.type) {
        return [ua.device.type, ua.browser.name];
    }
    else if (ua.browser.name) {
        return ["Desktop", ua.browser.name];
    }
    else {
        return ["Bot", "Unknown"];
    }
}

const getGeoDetails = async (IP) => {
    try {
        const res = await geoCityPromise(IP);
        return [res.registeredCountry?.names?.en, res.subdivisions ? res.subdivisions[0]?.names?.en : null];
    } catch (error) {
        console.log(error);
    }
}



fs.readFile(process.argv[2], 'utf8', async (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    const fileData = data.split(/"([^"]*)"/);
    let resultingOutput = "";

    for (let i = 0; i < fileData.length-6; i+=6) {

        const userAgent = parser(fileData[i+5]);
        const uaDetails = getUserAgentDetails(userAgent);
        const IP = fileData[i].split(' - - ')[0].trim();
        const location = await getGeoDetails(IP);
        const originalString = `${fileData[i]} ${fileData[i+1]} ${fileData[i+2]} ${fileData[i+3]} ${fileData[i+4]} ${fileData[i+5]}`.trim();

       resultingOutput += `${location[0]}, ${location[1]}, ${uaDetails[0]}, ${uaDetails[1]}, ${originalString}\n`
    }

    fs.writeFile('output.csv', resultingOutput, 'utf8', function (err) {
        if (err) {
            console.log('an error occured');
        } else {
            console.log('saved!');
        }
    })
})




