
# flux-jigsaw (flux-jigsaw)

This is a single page app that generates a wire frame Jigsaw puzzle
SVG image, implemented using React.js and Flux.

Via slider and input controls, it allows you to adjust various
parameters affecting the shapes of the puzzle pieces.

## Why does this exist?

It's a tool in support of a future 'fun' app involving manipulation of images, such as
facebook backgrounds and profile pictures.

It's also a vehicle for getting my feet wet with React.js, and to compare
experience of using React against mvc frameworks such as Backbone.

## Current Status

This is a work in progress. Here is a partial todo list:

### Make it look nice

Current css styles are a placeholder

### Clean up implementation

The implementation is not as clean as I would like, particularly in
the Flux Store. Considering updating the implementation to use
Fluxxor.

### Features

* An action to export the SVG document.
* Actions to export to other image formats
* Actions to jigsawify imported images, although this might be made into a separate app.

## Running the project

To build, launch, and rebuild the app whenever you change application code, run:

```bash
$ npm start
```

If you prefer to just build without the auto-rebuild functionality, run:

```bash
$ npm run build
```

