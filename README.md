# WOWD Components

Custom components for injecting into takomaradio.org.

## Development

```
npm run watch:hot
``` 

Starts a development server at `localhost:8080` which renders the index.html page.
This page can be used to approximate the takomaradio.org Squarespace site.

## Build

```
npm run build
```

bundles javascript and css. These files can be uploaded to Squarespace as attachements (use the link to file feature) and injected in custom header and code injection. 

A global, `WOWDComponents` is attached to `window` and contains render functions. 
Code blocks on the website can call these render functions to render the components.