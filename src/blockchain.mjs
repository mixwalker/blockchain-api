import crypto from 'crypto';

class Blockchain {

    constructor() {
        this.chain = [];
        this.create_block(1, '0', '');
    }

    create_block(nonce, previous_hash, data) {
        let block = {
            index: this.chain.length + 1,
            timestemp: new Date(),
            nonce: nonce,
            data: data,
            previous_hash: previous_hash
        }
        block['hash'] = this.hash(block);
        this.chain.push(block);
        return block;
    }

    get_pervious_block() {
        return this.chain.at(-1);
    }

    hash(block) {
        let encode_block = JSON.stringify(block, Object.keys(block).sort());
        return crypto.createHash('sha256').update(encode_block).digest('hex');
    }

    proof_of_work(previous_nonce) {
        let new_nonce = 1;
        while (1) {
            let hashoperation = crypto.createHash('sha256').update((new_nonce ** 2 - previous_nonce ** 2).toString()).digest('hex');
            if (hashoperation.slice(0, 4) === '0000') return new_nonce;
            new_nonce += 1;
        }
    }

    is_chain_valid(chain) {
        let previous_block = chain[0];
        let block_index = 1;

        while (block_index < chain.length) {
            let block = chain[block_index];
            if (block.previous_hash != previous_block.hash) return false;
            let previous_nonce = previous_block.nonce;
            let nonce = block.nonce;
            let hashoperation = crypto.createHash('sha256').update((nonce ** 2 - previous_nonce ** 2).toString()).digest('hex');
            if (hashoperation.slice(0, 4) !== '0000') return false;
            previous_block = block;
            block_index += 1;
        }
        return true;
    }
}

export default Blockchain