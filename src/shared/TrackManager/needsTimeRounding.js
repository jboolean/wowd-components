/**
 * One browser is, uh, special and can't seek to fractional time while playing.
 * Rounding can lead to jumpiness when seeking, so we'll only do it in Safari.
 */
const ua = navigator.userAgent.toLowerCase();
// Just Safari. Note that Chrome's UA contains "safari".
const needsTimeRounding = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;

export default needsTimeRounding;