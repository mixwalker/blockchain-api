import { Router } from 'express';
import Blockchain from '../src/blockchain.mjs';
import fetch from 'node-fetch';

let blockchain = null;
let blockchainEvent = {};

function selectEvent(event) {
    if (!blockchainEvent[event]) blockchainEvent[event] = new Blockchain();
    return blockchain = blockchainEvent[event];
}

const publicapi = Router();

// api/
publicapi.get('/', (req, res) => res.json({ error: false }));

// api/get_chain
publicapi.post('/get_chain', (req, res) => {

    const { elecId } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(elecId);

    return res.json({
        "elecId": elecId,
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });

});

// api/mining
publicapi.post('/mining', async(req, res) => {

    const { elecId, ...data } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(elecId);

    // const [studentRes, candidateRes] = await Promise.all([
    //     fetch(`http://localhost:8080/sorrawitj/api/student/${data.studentId}`),
    //     fetch(`http://localhost:8080/sorrawitj/api/student_candidate/findbycandidate/${data.candiId}`)
    // ]);

    // const student = await studentRes.json();
    // const candidate = await candidateRes.json();

    // const { prefix, firstName, lastName, studentCode, studentId } = student;
    // const name = `${prefix}${firstName} ${lastName}`;
    // data.student = { studentId, studentCode, name };

    // let cadistudent = candidate[0].student;
    // data.candidate = {
    //     candiId: data.candiId,
    //     name: `${cadistudent.prefix}${cadistudent.firstName} ${cadistudent.lastName}`
    // };

    // delete data.candiId;
    // delete data.studentId;

    let previous_block = blockchain.get_pervious_block();
    let previous_nonce = previous_block['nonce'];
    let nonce = blockchain.proof_of_work(previous_nonce);
    let previous_hash = previous_block.hash;
    blockchain.create_block(nonce, previous_hash, data);
    return res.json({ error: false });
});

// api/check_chain
publicapi.get('/check_chain', (req, res) => {

    const { elecId } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(elecId);

    let check = blockchain.is_chain_valid(blockchain.chain);
    return res.json({ message: check ? 'BlockChain Vaild' : 'BlockChain have problem' });
});

export default publicapi;