// @flow
import React from 'react';

/**
 * This context should be used to provide the root page path on which the current app is rendered.
 * It is consumed by AppLink to determine if the link is to the current app or not.
 *
 * Example value: /shows
 *
 */
export default React.createContext('/');