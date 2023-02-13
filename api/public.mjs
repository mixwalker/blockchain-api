import { Router } from 'express';
import Blockchain from '../src/blockchain.mjs';
import fetch from 'node-fetch';
const blockchain = new Blockchain();

const publicapi = Router();

publicapi.get('/', (req, res) => res.json({ error: false }));

publicapi.get('/get_chain', (req, res) => {
    return res.json({
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });
});

publicapi.get('/get_chain/getby_elecid', async(req, res) => {
    let { elecId } = req.body;
    let blockList = blockchain.chain.filter((block) =>
        block.data.elecId == elecId
    )
    if (blockList.length === 0) {
        return res.status(500).json({
            error: "No Data"
        })
    }
    for (let block of blockList) {
        const { elecId, candiId, studentId } = block.data;
        block.data = {};
        const resStudent = await fetch(`http://localhost:8080/sorrawitj/api/student/${studentId}`);
        const student = await resStudent.json()
        const { prefix, firstName, lastName, studentCode } = student
        const name = `${prefix}${firstName} ${lastName}`;
        block.data.student = { studentId, studentCode, name };

        const resElection = await fetch(`http://localhost:8080/sorrawitj/api/election/${elecId}`);
        const election = await resElection.json()
        const { elecName } = election
        block.data.election = { elecId, elecName };

        const resCandidate = await fetch(`http://localhost:8080/sorrawitj/api/student_candidate/findbycandidate/${candiId}`);
        const candidate = await resCandidate.json()
        let cadistudent = candidate[0].student
        block.data.candidate = {
            candiId,
            name: `${cadistudent.prefix}${cadistudent.firstName} ${cadistudent.lastName}`
        };

    }
    return res.json({
        "chain": blockList,
        "length": blockList.length
    });
});

publicapi.post('/mining', (req, res) => {

    let data = req.body;

    let previous_block = blockchain.get_pervious_block();
    let previous_nonce = previous_block['nonce'];
    let nonce = blockchain.proof_of_work(previous_nonce);
    let previous_hash = previous_block.hash;
    blockchain.create_block(nonce, previous_hash, data);
    return res.json({});
});

publicapi.get('/check_chain', (req, res) => {
    let check = blockchain.is_chain_valid(blockchain.chain);
    return res.json({ message: check ? 'BlockChain Vaild' : 'BlockChain have problem' });
});




export default publicapi;