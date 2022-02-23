const express = require('express')
const speech = require('@google-cloud/speech')
const speechClient = new speech.SpeechClient();
const _ = require('lodash');

const fs = require('fs')
const app = express()

app.post('/', function(req, res, next) {
    let body;
    req.on('data', function (data) {
        body = data;
    });
    req.on('end', async function () {
        fs.writeFileSync('audio.webm', Buffer.from(new Uint8Array(body)));

        // The path to the audio file to transcribe
        const filePath = 'audio.webm';

        // Reads a local audio file and converts it to base64
        const file = fs.readFileSync(filePath);
        const audioBytes = file.toString('base64');
        const audio = {
            content: audioBytes,
        };

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const config = {
            // encoding: 'LINEAR16',
            // sampleRateHertz: 24000,
            languageCode: 'en-US',
        };

        const request = {
            audio,
            config,
        };

        // Detects speech in the audio file
        speechClient
            .recognize(request)
            .then((data) => {
                const results = _.get(data[0], 'results', []);
                const transcription = results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                console.log(`Transcription: ${transcription}`);
                res.send(transcription);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    });
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})
