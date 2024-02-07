const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const NodeIngress = artifacts.require("./NodeIngress.sol");
const Rules = artifacts.require("./NodeRules.sol");

const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;

async function logCurrentAllowlist(instance) {
    let s = await instance.getSize();
    console.log("\n<<< current NODE allowlist >>>");
    for (i = 0; i < s; i++) {
        let x = await instance.getByIndex(i);
        console.log("enode://" + x[0] + "@" + x[1] + ":" + x[2]);
    }
    console.log("<<< end of current NODE list >>>");
}

module.exports = async (callback) => {
    // inlcude try/catch
    try {
        const enodeIdx = process.argv.indexOf("-nodefile");
        if (enodeIdx === -1 || enodeIdx === process.argv.length - 1) {
            callback("Please inform the nodes file using the -nodefile flag");
            return;
        }
        const nodesFile = process.argv[enodeIdx + 1]
        // Read the bootnodes file
        const fs = require('fs');
        const nodes = fs.readFileSync(nodesFile, 'utf8').split('\n');

        console.log(`Get node ingress instance at address ${nodeIngress} ...`)
        const nodeIngressInstance = await NodeIngress.at(nodeIngress);
        console.log(`Get rules contract address with name ${rulesContractName} ...`)
        const rulesContractAddress = await nodeIngressInstance.getContractAddress(rulesContractName)
        console.log(`Get rules contract instance at address ${rulesContractAddress} ...`)
        const nodeRulesContract = await Rules.at(rulesContractAddress);

        for (const enodeURL of nodes) {
            if (enodeURL === "") {
                continue;
            }
            const { enodeId, host, port } = AllowlistUtils.enodeToParams(enodeURL.slice(1, -1));
            if (!enodeId || !host || !port) {
                callback("Invalid enode address");
                return;
            }
            let result = await nodeRulesContract.addEnode(
                enodeId,
                host,
                Web3Utils.toBN(port)
            );
            console.log("eNode added: " + enodeURL);
        }
        await logCurrentAllowlist(nodeRulesContract);
        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
