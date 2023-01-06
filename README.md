# How To Deploy on local Server

**NOTE: First run the backend server.**<br>

If **yarn** is not installed, install it by running `npm install --global yarn` in the terminal.
Install the dependencies using- `yarn`<br>

## Setup the environment variables

Make a new file with name - `.env`<br> Copy the contents of the .env.exmaple file and paste it in `.env` and the fill the following details: <br>

`NEXT_PUBLIC_TOKEN_DEPLOYER_PUBLIC_ADDRESS, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_PINATA_API_KEY, NEXT_PUBLIC_PINATA_API_SECRET`<br>

**NEXT_PUBLIC_TOKEN_DEPLOYER_PUBLIC_ADDRESS**- This is the public address of the account that has been be used to deploy the token contract.<br>
**NEXT_PUBLIC_BASE_URL**- This is the base url of the backend server. Eg: http://localhost:PORT<br>
**NEXT_PUBLIC_PINATA_API_KEY**- This is the API key of the pinata account. You can get this by signing up on `https://www.pinata.cloud` and creating a new app.<br>
**NEXT_PUBLIC_PINATA_API_SECRET**- This is the API secret of the pinata account. <br>

## Start the frontend server

Now to start the backend server run the command- `yarn dev`. <br>Your backend will now run on the PORT 3000.<br>
