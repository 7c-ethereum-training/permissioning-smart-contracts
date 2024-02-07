
Use this repository to deploy the node permissioning smart contracts in the ethereum training environment.

## Prerequisites

nvm

## Installation

```bash
nvm install 12.22.12
nvm use 12.22.12
npm install -g yarn
yarn install
```

## Environment Configuration

Create a .env file in the root of the project with the following content:

```
NODE_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000009999
ACCOUNT_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000009999
BESU_NODE_PERM_ACCOUNT=627306090abaB3A6e1400e9345bC60c78a8BEf57
BESU_NODE_PERM_KEY=c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
BESU_NODE_PERM_ENDPOINT=http://127.0.0.1:8545
CHAIN_ID=381660001
INITIAL_ALLOWLISTED_NODES=enode://4dfc25f248de7f5992505e1cf79b00a8591f7c6c687fdfdd9830b3eb2b60f5931ca4a8c4f2d89ebc6d8f03ccadddaee0f5e153350f8f53c16d9ad6cd7ee9f80e@192.168.0.154:30303,enode://0ea9c0553c7f95215c7d937e1a89cef8d4d80e638c034bcc2ff82eccd4994451cc65127bd66f5d7988b529304b3062dd038701ed1c7294c2bdcea37487041379@192.168.0.154:30313,enode://f6ce8ae7811a49d62165d45a265f8f3379e44a753f83165e6134cedf0021595daced25b129f10619245b3fc65b141a4d9a1de406138d3f56a6dcd7e6aa914ae5@192.168.0.154:30323,enode://76502ee7b99a6180be3c2409ddfb7756d336cba8c626b8b03c89a587d245d5daf3fa816b6790519ed3e5b6d1467fd393b53401b33c5c1c6e88be74415076a99d@192.168.0.154:30333
```

This configuratin is for the ethereum training environment:

The `NODE_INGRESS_CONTRACT_ADDRESS` and `ACCOUNT_INGRESS_CONTRACT_ADDRESS` are the addresses of the node and account ingress contracts, in DREX the account ingress contract is not used, so we configure it with the same address as the node ingress contract.

The `BESU_NODE_PERM_ACCOUNT` and `BESU_NODE_PERM_KEY` are the account and private key of the account that will be used to deploy the contracts.

The `BESU_NODE_PERM_ENDPOINT` is the endpoint of the besu node.

The `CHAIN_ID` is the chain id of the ethereum training environment.

The `INITIAL_ALLOWLISTED_NODES` is the list of nodes acting as validators in the ethereum training environment.

## Install the contracts

```bash
yarn truffle migrate --reset --network besu
```

This command will run the migration scripts:
`0_initial_validation.js`
`1_initial_migration.js`
`2_deploy_admin_contract.js`
`3_deploynode_ingress_rules_contract.js`

Notes:
- BACEN/DREX configuration has no account ingress contract, so we removed the migration script `4_deploy_account_ingress_rules_contract.js`.
- We are using the pre allocated account `627306090abaB3A6e1400e9345bC60c78a8BEf57` to deploy the contracts, this account will be the administator of the nodes.

## Include new nodes

To include new nodes in the network, use the script `add_node.js`:

```bash
yarn truffle exec scripts/add_node.js --network besu --enod enode://<enodId>@<ip>:<port>
```

New nodes can also be included using the web interface of the permissioning dapp. It'll be available at `http://validator-7c-0.eastus.cloudapp.azure.com:8080`, metamask must be connected to the training network with the node admin account.
