// Exposes render functions on the global context so that they can be used in Squarespace code blocks
import 'babel-polyfill';
import 'modernizr'; // runs modernizr
import 'expose-loader?WOWDComponents!./WOWDComponents';