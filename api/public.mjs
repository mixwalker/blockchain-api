import { Router } from 'express';
import Blockchain from '../src/blockchain.mjs';
import ElectionSchema from '../src/Datamodel.mjs';

let blockchain = new Blockchain();
let electionSchema = new ElectionSchema();

const publicapi = Router();

// api/
publicapi.get('/', (req, res) => res.json({ error: false }));

// api/get_chain
publicapi.post('/get_chain', async (req, res) => {

    const { elecId } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });

    electionSchema.elecId = elecId.toString();

    blockchain.chain = await electionSchema.model().find();

    return res.json({
        "elecId": elecId,
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });

});

// api/get_chain_sort
publicapi.post('/get_chain_sort', async (req, res) => {

    const { elecId } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });

    electionSchema.elecId = elecId.toString();

    blockchain.chain = await electionSchema.model().find().sort({ 'data.candidate.candiId': 1 });

    return res.json({
        "elecId": elecId,
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });

});

// api/mining
publicapi.post('/mining', async (req, res) => {

    const { elecId, ...data } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });

    electionSchema.elecId = elecId.toString();

    blockchain.chain = await electionSchema.model().find();
    if (!blockchain.chain || (blockchain.chain).length === 0) {
        const genesit_hash = blockchain.proof_of_work(0)
        const create = blockchain.create_block(1, '0', null,genesit_hash.hash)
        await electionSchema.model().create(create);
        blockchain.chain = [create];
    }

    let previous_block = blockchain.get_pervious_block();
    let previous_nonce = previous_block['nonce'];
    let proof_of_work = blockchain.proof_of_work(previous_nonce);
    let nonce = proof_of_work.new_nonce;
    let hash = proof_of_work.hash;
    let previous_hash = previous_block.hash;
    await electionSchema.model().create(blockchain.create_block(nonce, previous_hash, data, hash));
    return res.json({ error: false });
});

// api/check_chain
publicapi.post('/check_chain', async (req, res) => {

    const { elecId } = req.body;
    if (!elecId) return res.status(500).json({ error: true, msg: 'not found event' });

    electionSchema.elecId = elecId.toString();

    blockchain.chain = await electionSchema.model().find();
    if (!blockchain.chain || (blockchain.chain).length === 0) {
        return res.json({ message: 'BlockChain have problem' });
    }

    let check = blockchain.is_chain_valid(blockchain.chain);
    return res.json({ message: check ? 'BlockChain Vaild' : 'BlockChain have problem' });
});

export default publicapi;