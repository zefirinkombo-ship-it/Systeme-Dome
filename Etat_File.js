const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Etat.json');

function LireEtat() {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
}

function EcrireEtat(etat) {
    fs.writeFileSync(file, JSON.stringify(etat, null, 2), 'utf-8');
}
module.exports = {
    LireEtat,
    EcrireEtat
};
