const express = require('express');
const db = require('../../mygrimorio.json');

const {generateJWT, verifyJWT, getIdByToken} = require('../../utils/helpers');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        success: true,
        title: 'MyGrimoireAPI',
        version: '1.0.0'
    });
});


// ****** ROTAS ******  
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }

    if (
        db.users.find(user => user.email === email && user.password === password)
    ) {
        const user = db.users.filter(user => user.email === email);
        const userId = user[0].id;
        const token = generateJWT(userId);
        return res.status(200).json({ auth: true, token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // eslint-disable-next-line no-unreachable
    return res.status(500).json({ message: 'Login inválido!' });
});

router.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
});

router.get('/my-persons', verifyJWT, (req, res, next) => {
    let userId = getIdByToken(req);
    
    if(!userId) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    let persons = db.persons.filter(person => person.id === userId);

    const total = persons[0].my_persons.length;

    return res.json({
        persons: persons[0].my_persons,
        total,
    });
});

router.get('/person', verifyJWT, (req, res, next) => {
    const userId = getIdByToken(req);
    
    if(!userId) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    let persons = db.persons.find(person => person.id === userId);
    let myPerson = persons.my_persons.find(
        person => person.id === req.body.personId,
    );
    if (!myPerson) {
        return res.status(404).json({ message: 'Person not found!' });
    }

    return res.json(myPerson);
});

router.get('/magics-person', verifyJWT, (req, res, next) => {
    const userId = getIdByToken(req);
    
    if(!userId) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    let persons = db.persons.find(person => person.id === userId);
    let myPerson = persons.my_persons.find(
        person => person.id === req.body.personId,
    );
    if (!myPerson) {
        return res.status(404).json({ message: 'Person not found!' });
    }

    const total = myPerson.myMagics.length;

    return res.json({
        myMagic: myPerson.myMagics,
        total,
    });
});

router.get('/specific-magic-person', verifyJWT, (req, res, next) => {
    const userId = getIdByToken(req);

    if(!userId) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    let persons = db.persons.find(person => person.id === userId);
    let myPerson = persons.my_persons.find(
        person => person.id === req.body.personId,
    );
    if (!myPerson) {
        return res.status(404).json({ message: 'Person not found!' });
    }

    let myMagic = myPerson.myMagics.filter(magic =>
        magic.name.toLowerCase().includes(req.body.magicName.toLowerCase()),
    );

    if (!myMagic) {
        return res.status(404).json({ message: 'Magic not found!' });
    }

    const total = myMagic.length;

    return res.json({
        myMagic,
        total,
    });
});

// ****** FIM ROTAS ******

module.exports = router;
