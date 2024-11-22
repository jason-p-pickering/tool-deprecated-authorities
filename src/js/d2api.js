const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
const isDev = "baseUrl" in dhisDevConfig ? true : false;
const baseUrl = isDev ? dhisDevConfig.baseUrl : "../../..";

//GET from API async
export const d2Get = async (endpoint) => {
    const url = baseUrl + endpoint;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...isDev && { "Authorization": "Basic " + btoa(dhisDevConfig.username + ":" + dhisDevConfig.password) }
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("ERROR in GET:");
        console.log(err);
        throw err;
    }
};

//POST to API async
export const d2PostJson = async (endpoint, body) => {
    const url = baseUrl + endpoint;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...isDev && { "Authorization": "Basic " + btoa(dhisDevConfig.username + ":" + dhisDevConfig.password) }
        },
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("ERROR in POST:");
        console.log(err);
        throw err;
    }
};