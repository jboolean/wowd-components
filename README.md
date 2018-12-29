# WOWD Components

Custom components for injecting into takomaradio.org.

## Pre-requisites

This project was developed with NPM 6 and Node 8.
Ensure these are installed with `node --version` and `npm --version`.

## Development

When building for the first time or if dependencies have changed, run

```
npm install
```

To develop,

```
npm run watch
``` 

Starts a development server at `localhost:8080`.
There are three pages to mimic the three pages on the real site:

* http://localhost:8080/shows
* http://localhost:8080/schedule
* http://localhost:8080/djs

These pages can be used to approximate the takomaradio.org Squarespace site.

## Build

```
npm run build
```

bundles javascript and css into `/dist`. These files can be uploaded to Squarespace as attachements (use the link to file feature) and injected in custom header and code injection.

A global, `WOWDComponents` is attached to `window` and contains render functions. 
Code blocks on the website can call these render functions to render the components.

For example, this code block renders the Shows page

```html
<div id="archive-container"> </div>
<script>
  var container = document.getElementById('archive-container');
  WOWDComponents.renderArchives(container);
</script>
```

## Release

To release a new version run [`npm version`](https://docs.npmjs.com/cli/version) to bump the version number and create a commit. 
Push this commit.
Then run `npm run publish-please` to build and publish a version to npm.
To include the changes into the takomaradio.org website, follow the instructions in the template's README.

## Directory structure

The files and directories in `src` are strictly organized into four standard directories. The contents of each directory are limited.

- `screens` - Contains only sub-directories named for full pages in the UI. If pages have a hierarchy, those sub-directories can contain another `screens` folder for the pages in the hierarchy.
  ```
  - screens
    - Dj
    - Shows
      - screens
        - Episode
        - Show
  ```
- `components` - Contains only sub-directories named for UI elements that relate to the screen of the parent directory. A component's subdirectory should contain an `index.jsx` file for the component and a `ComponentName.less` file for styles. If the component has a higher-order connecting component to maintain state, that is in the `index.jsx` file, and `ComponentName.jsx` is a pure underlying component. If there is only one file, a directory is not needed.
  ```
  - components
    - Schedule
      - index.jsx // Manages state, loades data from the API
      - Schedule.jsx // A pure React component that renders a Schedule
      - Schedule.less // styles used by Schedule.jsx
  ```

- `utils` - Contains only files that export utility functions, objects, or constants. May contain any subdirectories to organize the utilities. 
- `shared` - A special type of directory, configured in Webpack to make its contents easily importable by decendants in the hierarchy. When importing, webpack will automatically look up the tree in shared folders to find a match, so instead of `import ../../shared/utils/myUtil`, just `import 'utils/myUtil'` will suffice. `shared`  can contain `components`, `screens` or `utils`. `shared` directories can exist on any level to make contents available below that level. 
  - The top-level `src/shared` directory contains code _not_ specific to WOWD, such as a generic calendar layout component with no knowledge of radio show data, a generic track manager, and types to store date and time data.
  Anything at this level could potentially be moved out to another repository and npm package.
  - `src/wowd/shared` contains components and utils used on many screens that _are_ specific to WOWD such as a "show card", a play button, data types for Shows, Djs and Playlists, and an API client.

## Frameworks and patterns

### React / state management
This project is based on React. 
React is often paired with a flux implementation, but that was overkill for this project since there is very litte state and almost no shared state. `eventemitter3` is used in lieu of flux to notify components of changing state. The only place this is used is between the TrackManager and PlayButton for when playing state changes or the active track changes. 
All other data is loaded directly by a higher order component which stores it in React state.

### LESS

LESS CSS ([lesscss.org](http://lesscss.org)) is used for styles with Webpack's [CSS Modules](https://github.com/webpack-contrib/css-loader#modules). The tl;dr of this is: 1) All less files can be imported into javascript as objects and 2) All the class names within a `:local` block in the less file, which should be the entire less file, gets replace with a random string. The exported javascript object is a map from the original class name to the randomized class name. 

MyGreatComponent.less
```css
:local {
  .myGreatClass {
    color: beige;
  }
}
```

MyGreatComponent.jsx
```javascript
import stylesheet from './MyGreatComponent.less'; // { 'myGreatClass' : 'MyGreatComponent-myGreatClass-x1f2'}

export <div className={stylesheet.myGreatClass} />;
```

This keeps styles local to a component, prevents them from being used elsewhere unintentionally, and allows for using common classnames like `.body` or `.title` without fear of duplication.

## Code style
This project follows Squarespace's JavaScript Styles. Rather than write a Style Guide, I refer to the [Squarespace .eslintrc](https://github.com/Squarespace/eslint-config-squarespace/blob/master/vanilla/.eslintrc), which has been imported into this project. 

```
npm run lint
```

will find style errors, and 


```
npm run lint-fix
```

will fix many of them.

lint errors will be automatically fixed when saving changes while running `npm run watch` as well.

## Types
This project uses [Flow](https://flow.org) to add static type checking to Javascript.

**All** files should begin with the comment `//@flow ` to enable type checking unless there is a compelling reason to turn off type checking.

Run

```
npm run flow
```

to check for type errors. It is recommended to install Flow integration into your editor.

### Updating Flow's libdefs
When dependencies are updated, type definities for third-party libraries must also be updated.

```
npm run install-libdefs
```

Sometimes the new libdefs are not backwards compatible, so Flow itself may also need to be upgraded at this time.

