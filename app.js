const mobilenet = require('@tensorflow-models/mobilenet');
const tf = require('@tensorflow/tfjs-node')
const axios = require('axios')
const express = require('express')

const app = express()
const port = 8087

// check url is valid
function checkIsUrl (value){
    let pattern = new RegExp('^(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})');
    return pattern.test(value);
}

app.get('/', (req, res) => {
    res.send("<h1>Image Classify App</h1>")
});


app.get('/image', (req, res) => {

    async function imageClassify(url) {
        const pic = await axios.get(url, {
            responseType: 'arraybuffer',
        })

        // Load the model.
        const model = await mobilenet.load();
        const image = tf.node.decodeImage(pic.data, 3)
        // Classify the image.
        const predictions = await model.classify(image);
        let classify = [];
        for(i=0;i<predictions.length;i++) {
            if (predictions[i]) {
                hasToxic = true;
                message = 'Your sentence contains toxic words';
                classify.push({'words':predictions[i].className,'pecentage':predictions[i].probability.toFixed(4)*100+"%"})
            }
        }
        res.status(200).json({
            error:false,
            message:'Probability classification',
            data: classify
        })
     }

    //validate url
    if(checkIsUrl(req.query.url)){
        //load function
        imageClassify(req.query.url);
    }
    else{
        res.status(400).json({
            error:true,
            message:'Invalid parameter',
            data: []
        })
    }
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})