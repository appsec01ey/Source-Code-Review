const express = require('express');
const axios   = require('axios');
const dns     = require('dns');
const { promisify } = require('util');

const app = express();
const lookup = promisify(dns.lookup);

const postData = { 
	'name' : 'John Doe' ,
	'role' : 'Developer'
} 

app.get('/', (req,res) => {
	res.send('Hello World!') ;
});

app.get('/profile' , (req,res) => {
	res.json(postData);
});

app.get('/fetch-data',async (req,res) => {

	const url = req.query.url;
	console.log(`Received request for /fetch-data with URL : ${url}`);

	try {
		if (!(await isValidUrl(url))){
			console.log('Invalid Url');
			return res.status(400).send('Invalid Url');
		}
		const response = await axios.get(url);
		res.send(response.data); 
	}
	catch(error){
		console.log('Error')
		res.status(500).send('Error fetching Data');
	}

});

// This is a great solution if developers can just hardcode allowed urls and then use some validation for the rest of the query params but lets say if url must be dynamic then we have ssrf protection function below that

/*function isValidUrl(inputurl) {
	try {
		const parsed_url = new URL(inputurl);
		const allowedHosts = ['example.com' , 'test.com'];
		return allowedHosts.includes(parsed_url.hostname);
		}
	catch(err){
		return false;	
	}

}
*/

async function isValidUrl(inputurl){
	try {
		const parsed_url = new URL(inputurl);
		const blacklisted_domains = ['localhost','127.0.0.1'] ;

		if (blacklisted_domains.includes(parsed_url.hostname)){
			return false;
		}
		
		
		return await CheckIP(parsed_url.hostname);
	}
	catch(err){
		return false;
	}
}

async function CheckIP(hostname){

	try{
		const result = await lookup(hostname,family=4);
		console.log(`Resolved address ${result.address}`);	
	    return isPrivateIp(result.address);
	}
	catch(err){
		return false;	
	}
	
}

function isPrivateIP(ip){
	
	if ( typeof ip !== 'string' || !ip.includes('.')) return false ; 	
	
	if (ip === "::1" || ip === "0:0:0:0:0:0:0:1" || ip === "[::]" || ip === "[::1]") return true;


	const parts = ip.split('.');
	const firstOctet = parseInt(parts[0]);
	const secondOctet = parseInt(parts[1]);

	if ( ip.startsWith("192.168") || ip.startsWith("127.") || ip.startsWith("10.") || (firstOctet == 172 && secondOctet <= 31) || ip.startsWith("169.")) return true;

	// Additionally checks must be implemented to prevet against SSRF via DNS Rebinding
 }

app.listen(3000,() => {
	console.log('Server is running on http://localhost:3000');
});


