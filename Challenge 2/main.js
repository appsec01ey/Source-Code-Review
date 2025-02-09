//Challenge 2 
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/profile', (req, res) => {
    console.log('Received request for /profile');

    // Simulated profile data
    const profileData = {
        name: 'John Doe',
        role: 'Developer'
    };
    
    res.json(profileData);
    console.log('Sent profile data response');
});

app.get('/fetch-data', async (req, res) => {
    const url = req.query.url;
    console.log(`Received request for /fetch-data with URL: ${url}`);
    
    try {
        const response = await axios.get(url);
        res.send(response.data);
        console.log(`Data fetched and sent for URL: ${url}`);
    } catch (error) {
        console.error(`Error fetching data from URL: ${url}`, error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

/* Solution 
1. Here we can see that in line 21 the application takes url from the ?url param in the query , queries the url (no validation / whitelisting etc) and then sends the response data leading to potential SSRF 
2. Example : http://127.0.0.1:3000/fetch-data/?url=http://127.0.0.1:3000/profile 
3. Here implement follow checks:
    1. isValidUrl : checks if url is valid or not
    2. create a list of allowed domains and only allow those urls 
    3. if whole url is not required to be dynamic then use regex to validate the remaining part
    4. A sample solution is provided in solution.js file

*/

