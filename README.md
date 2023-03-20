# images-ia
Service in Node JS to classify images
## Usage
Build image, run container, show logs
```
docker-compose build && docker-compose up -d && docker-compose logs -f
```
## Endpoints
```
http://[HOST]:[PORT]/image/?url=[IMAGE_URL]
http://[HOST]:[PORT]/imagenudity/?url=[IMAGE_URL]
http://[HOST]:[PORT]/imagenuditygif/?url=[IMAGE_URL]
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
a
## License
[MIT](https://choosealicense.com/licenses/mit/)
