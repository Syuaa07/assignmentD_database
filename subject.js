
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const subject = require ('./subject.js')

app.use(express.json())

app.post('/subject', verifyToken, async (req, res) => {
    const subject = {
        matrix: req.body.matrix,
        subject: req.body.subject,
        Program: req.body.Program,
        lecturer: req.body.lecturer,

    };

    
        const db = client.db("BENR2423");
        const subjectCollection = db.collection('subject');

        subjectCollection.insertOne(subject, (err, result) => {
            if (err) {
                console.error('Error inserting subject:', err);
                res.status(500).send('Error inserting subject');
                return;
            }

            res.status(201).send('Subject created successfully');
        });

        client.close();
    });

   

    module.exports = {
        subject,
    }