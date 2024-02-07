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
    for (i = 0; i < s; i ++) {
        let x = await instance.getByIndex(i);
        console.log("enode://" + x[0] + "@" + x[1] + ":" + x[2]);
    }
    console.log("<<< end of current NODE list >>>");
}

module.exports = async (callback) => {
    const enodeIdx = process.argv.indexOf("-enode");
    if (enodeIdx === -1 || enodeIdx === process.argv.length - 1) {
        callback("Please inform the enode address using the -enode flag");
        return;
    }
    const enode = process.argv[enodeIdx + 1]
    const { enodeId, host, port } = AllowlistUtils.enodeToParams(enode);
    if (!enodeId || !host || !port) {
        callback("Invalid enode address");
        return;
    }    
    console.log(`Get node ingress instance at address ${nodeIngress} ...`)
    const nodeIngressInstance = await NodeIngress.at(nodeIngress);
    console.log(`Get rules contract address with name ${rulesContractName} ...`)
    const rulesContractAddress = await nodeIngressInstance.getContractAddress(rulesContractName)
    console.log(`Get rules contract instance at address ${rulesContractAddress} ...`)
    const nodeRulesContract = await Rules.at(rulesContractAddress);
    let result = await nodeRulesContract.addEnode(
        enodeId,
        host,    
        Web3Utils.toBN(port)
    );
    console.log("eNode added: " + enode );

    await logCurrentAllowlist(nodeRulesContract);
    callback();
};
