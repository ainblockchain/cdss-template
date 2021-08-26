# Simple CDSS platform template

## How to run
* Add `.env.local` file includes:
```
BLOCKCHAIN_NODE=
HE_SERVER_URL=
```
* Run commands:
```bash
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What does this page do?
* Input age and height, and click push 'Submit' button
* Both values are encrypted using a homomorphic encryption technique
* Send encrypted values to HE server
* HE server adds both values in encrypted form, and return result to page
* Decrypt returned result, and show decrypted value!
