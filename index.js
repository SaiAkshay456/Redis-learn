import ioredis from 'ioredis';
import axios from 'axios';
// const redisClient = new ioredis();

// //first function in redis
// async function connect() {
//     try {
//         const data = await redisClient.set('name', 'Akki');
//         const value = await redisClient.get('name');
//         console.log('Redis value:', value)
//         const data1 = await redisClient.set('name', 'sai');
//         const value1 = await redisClient.get('name');
//         console.log('Redis value:', value1);
//         await apiCall();
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function apiCall() {
//     console.log('Api call');
//     try {
//         const response = await fetch('https://dummyjson.com/users/1');
//         const data = await response.json();
//         await redisClient.set('product:1', JSON.stringify(data), 'EX', 600);
//         const cachedData = await redisClient.get('weather:NYC');
//         console.log('product:', JSON.parse(cachedData));
//     } catch (err) {
//         console.log(err);
//     }
// }


// async function getSchemeCode() {
//     try {
//         const { d } = await axios.get(`https://www.mfapi.in/nav/SBIBluechipFund/history`)
//         console.log(d);
//         // data.map(async (fundCode) => {
//         //     const { d } = await axios.get(`https://www.mfapi.in/nav/${fundCode.schemaCode}/history`)
//         // })
//     } catch (err) {
//         console.log(err);
//     }
// }

// getSchemeCode();


// async function getMutualFunds() {
//     try {
//         const { data } = await axios.get(`https://api.mfapi.in/mf/`);
//         console.log(data.slice(0, 5)); // first 5 mutual funds
//     } catch (err) {
//         console.error(err.message);
//     }
// }

// getMutualFunds();


// // connect();

async function get_nav(id) {
    try {
        const res = await axios.get("https://www.amfiindia.com/spages/NAVAll.txt");
        const content = res.data;
        const res1 = await axios.get(`https://api.mfapi.in/mf/${id}`);
        console.log("start hereee", res1.data.data.length)
        res1.data.data.forEach(entry => {
            console.log(`Date: ${entry.date}, NAV: ${entry.nav}`);
        });
        console.log("end hereee", res1.data.data.length)
        for (let i = 0; i < 551; i++) {
            console.log(res1.data.data[i].date, res1.data.data[i].nav)
        }
        const re = new RegExp("^" + id + ".*", "gm");
        const match = content.match(re);
        if (!match || match.length === 0) {
            throw new Error("Fund ID not found");
        }
        const line = match[0];
        const fields = line.split(";");
        console.log("line83", fields[fields.length - 2])
        return { nav: fields[fields.length - 2], len: res1.data.data.length };
    } catch (err) {
        console.error("Error fetching NAV:", err.message);
        return null;
    }
}

// async function get_nav(id, startYear = 2020, endYear = 2025) {
//     try {
//         const res1 = await axios.get(`https://api.mfapi.in/mf/${id}`);
//         const allData = res1.data.data;
//         console.log(allData)

//         // Filter for the date range
//         const filteredData = allData.filter(entry => {
//             const [day, month, year] = entry.date.split("-").map(Number);
//             return year >= startYear && year <= endYear;
//         });

//         console.log(`Showing NAV data from ${startYear} to ${endYear}:`);
//         filteredData.forEach(entry => {
//             console.log(`Date: ${entry.date}, NAV: ${entry.nav}`);
//         });

//         return { navData: filteredData, len: filteredData.length };
//     } catch (err) {
//         console.error("Error fetching NAV:", err.message);
//         return null;
//     }
// }


async function getSchemeCodeFromISIN(isin) {
    try {
        const res = await axios.get("https://www.amfiindia.com/spages/NAVAll.txt");
        const content = res.data;
        // Match line containing ISIN
        const regex = new RegExp(`^.*${isin}.*$`, "gm");
        const match = content.match(regex);
        if (!match || match.length === 0) {
            console.log("ISIN not found");
            return null;
        }
        const fields = match[0].split(";");
        const schemeCode = fields[0];
        const schemeName = fields[3];

        console.log(`Found schemeCode: ${schemeCode}, Name: ${schemeName}`);
        return schemeCode;
    } catch (err) {
        console.error("Error fetching scheme code:", err.message);
        return null;
    }
}



(async () => {
    let schemaCode = await getSchemeCodeFromISIN("INF209KB1ZE9");
    const nav = await get_nav(schemaCode);
    console.log(schemaCode)
    console.log("NAV:", nav?.nav, nav?.len);
})();