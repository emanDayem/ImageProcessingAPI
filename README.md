### Welcome to Image Processing API ###

### Description ###

Image Processing API is a backend service to resize images by width or height or both.

You can add your images with original size to './assets/full' directory.

Open "http://127.0.0.1:3000/" url with the filename, width, height queries to get the resized image.

You will find the resized images cached in './assets/thumbs' directory.

Note: To know how to write your request query, jump to ### API Reference ### section.

### Technologies ###

1. Node.js
2. Typescript
3. Express
4. Jasmine
5. ESlint
6. Prettier
7. Sharp
8. Joi


### Getting Started ###

To run this project follow these steps:
1. Run ```npm run start``` 
2. open the address "http://127.0.0.1:3000/" in your browser

### API Reference ###

1. GET /
    - `curl http://127.0.0.1:3000/` 
    - Opens the home page with the REAMDME instructions

2. GET /images
    - `curl http://127.0.0.1:3000/images` 
    - Returns 400 Bad request error with message "filename is required"

    - `curl http://127.0.0.1:3000/images?filename={fileName}` 
    - Returns the original image file if the image valid (exists in './assets/full' directory)
    - Returns 404 Not Found error with message "The image not found" if the image invalid and not exists.

    - `curl http://127.0.0.1:3000/images?filename={fileName}&width={width}` 
    - Returns the resized image file by the provided width and the height equal to the width.
    - Returns 400 Bad request error with message "width must be a number" if the width is not number.

    - `curl http://127.0.0.1:3000/images?filename={fileName}&height={height}` 
    - Returns the resized image file by the provided height and the width equal to the height.
    - Returns 400 Bad request error with message "height must be a number" if the height is not number.

    - `curl http://127.0.0.1:3000/images?filename={fileName}&width={width}&height={height}` 
    - Returns the resized image file by the provided width and height (w x h).
    - Returns 400 Bad request error with message "height must be a number" if the height is not number.

### Testing ###

The project is tested via Jasmine
Run the test specs with ```npm run test``` command

### Contribution ###

Install node: "https://nodejs.org/en/download/"
Install Dependencies: run ```npm install```

### Authoer ###
Eman Abdallah