const mobilenet = require('@tensorflow-models/mobilenet');
const tf = require('@tensorflow/tfjs-node')
const axios = require('axios')
const express = require('express')
const nsfw = require('nsfwjs')

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

//Image
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

//Image Nudity
app.get('/imagenudity', (req, res) => {

    async function imageNudity(url) {
        const pic = await axios.get(url, {
            responseType: 'arraybuffer',
        })

        const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
        // Image must be in tf.tensor3d format
        // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
        const image = tf.node.decodeImage(pic.data,3)
        //image.dispose() // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
        let predictions = await model.classify(image)
        let classify = [];
        for(let i=0;i<predictions.length;i++) {
            if (predictions[i]) {
                classify.push({'classification':predictions[i].className,'percentage':predictions[i].probability.toFixed(4)*100+"%"})
            }
        }
        res.status(200).json({
            error:false,
            message:'Image score',
            data:classify
        })
    }

    //validate url
    if(checkIsUrl(req.query.url)){
        //load function
        imageNudity(req.query.url);
    }
    else{
        res.status(400).json({
            error:true,
            message:'Invalid parameter',
            data: []
        })
    }
})

//Image GIF Nudity
app.get('/imagenuditygif', (req, res) => {

    // function classify image only GIF
    async function nudityImageGIF(url) {
        const pic = await axios.get(url, {
            responseType: 'arraybuffer',
        })
        const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
        res.status(200).json({
            error:false,
            message:'Image score',
            data: await model.classifyGif(pic.data)
        })
    }

    //validate url
    if(checkIsUrl(req.query.url)){
        //load function
        nudityImageGIF(req.query.url);
    }
    else{
        res.status(200).json({
            error:true,
            message:'Invalid parameter',
            data: []
        })
    }
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})