This project is for FM US NFT.

# Install

```shell
> yarn install
```

# Compile

```shell
> yarn build
```

# Upload and Pin files on IPFS
Use IPFS services(Pinanta and Infura etc.)
1. Pinata (https://www.pinata.cloud/)
2. Infura (https://infura.io/product/ipfs)


# Upload and Pin files on IPFS
After upload files(images and jsons), change uris
```text
GOLD_URI_[...]= <strong>change here</strong>
SILVER_URI_[...]= <strong>change here</strong>
PURPLE_URI_[...]= <strong>change here</strong>
```


# Deployment
## Environment 
Copy .env.sample to .env
```shell
> cp .env.example .env
```

## Change private key for signing in env
PRIVATE_KEY_[...]= <strong>change here</strong>

## Deploy
Ensure you have enough BOA for the Deploy.
```shell
# for local
> yarn standalone:deploy
# for BizTestNet
> yarn biztestnet:deploy
# for BizNet
> yarn biznet:deploy
```

## Change NFT Contract address in env
NFT_CONTRACT_[...]= <strong>change here</strong>


# Mint NFT
Ensure you have enough BOA for the Mint.
## List participants
https://docs.google.com/spreadsheets/d/1b6XEREBy4sUPjgzHrRZECKb13EUUjJ9Gz61jvsgsy4k/edit#gid=0

## Change csv to json
https://www.convertcsv.com/csv-to-json.htm

## Modify participants file
```text
# for local
participants > standalone.json
# for BizTestNet
participants > biztestnet.json
# for BizNet
participants > biznet.json
```

## Minting
```shell
# for local
> yarn standalone:mint
# for BizTestNet
> yarn biztestnet:mint
# for BizNet
> yarn biznet:mint
```

## Get Minted NFT information
```shell
# for local
> yarn standalone:info
# for BizTestNet
> yarn biztestnet:info
# for BizNet
> yarn biznet:info
```