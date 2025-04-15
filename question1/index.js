const express = require("express") ; 
const app = express() ;
const cors = require("cors") ; 
const axios = require("axios") ;  

app.use(cors()) ; 
app.use(express.urlencoded({extended:false})) ; 
app.use(express.json()) ; 

// SLINDING WINDOW VARIABLES : 
const WINDOW_SIZE = 10;
let slidingWindow = [];


// MAP FOR URL
const numberIdToUrl = {
    'p': 'http://20.244.56.144/evaluation-service/primes',
    'f': 'http://20.244.56.144/evaluation-service/fibo',
    'e': 'http://20.244.56.144/evaluation-service/even',
    'r': 'http://20.244.56.144/evaluation-service/rand'
};
  
  
// FETCH DATA WITH TIMEOUT OF 500ms
  const fetchNumbers = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500, headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAwODYzLCJpYXQiOjE3NDQ3MDA1NjMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.jj80gEgOKZF3b9S2zEmi0YVpqBtlvr2BNPcK20bmnvM` }});
      return response.data.numbers || [];
    } catch (error) {
      console.error(`Error fetching numbers from ${url}:`, error.message);
      return [];
    }
  };
  
  
// Route handler
app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    if (!numberIdToUrl[numberId]) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const url = numberIdToUrl[numberId];
    const windowPrevState = [...slidingWindow];

    const fetchedNumbers = await fetchNumbers(url);
    console.log("Fetched Number : ",fetchedNumbers) ; 

    // Add unique numbers to the sliding window
    for (const num of fetchedNumbers) {
        if (!slidingWindow.includes(num)) {
        slidingWindow.push(num);
        if (slidingWindow.length > WINDOW_SIZE) {
            slidingWindow.shift(); // Remove the oldest number
        }
        }
    }

    const windowCurrState = [...slidingWindow];

    // Calculate average
    let sum = 0;
    for (let i = 0; i < slidingWindow.length; i++) {
        sum += slidingWindow[i];
    }
    
    let avg = 0;
    if (slidingWindow.length > 0) {
        avg = Math.round((sum / slidingWindow.length) * 100) / 100;
    }

    // returning the response !
    res.json({
        windowPrevState,
        windowCurrState,
        numbers: fetchedNumbers,
        avg
    });
});


const PORT = 9876 ; 
app.listen(PORT,(err)=>{
    if(err) console.log(err) ; 
    else {
        console.log(`Server running on Port : ${PORT}`) ; 
    }
});




// {
//     "email": "joel465.be22@chitkara.edu.in",
//     "name": "joel matthew",
//     "rollNo": "2210990465",
//     "accessCode": "PwzufG",
//     "clientID": "93b023b9-73a1-41ee-bc84-262929842e29",
//     "clientSecret": "rZSerphFWkVdRpaa"
// }



// {
//     "token_type": "Bearer",
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0Njk5NTc3LCJpYXQiOjE3NDQ2OTkyNzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.M4PxObYaTFiOBEGJv4LHdTue97VahvmDqTMuJEVQ6MQ",
//     "expires_in": 1744699577
// }

// {
//     "token_type": "Bearer",
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAwMzQ0LCJpYXQiOjE3NDQ3MDAwNDQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.nFX1P-P1k3IDV6ODAQ5ifiEOJKhcZ5oV6PhD47YF-iU",
//     "expires_in": 1744700344
// }