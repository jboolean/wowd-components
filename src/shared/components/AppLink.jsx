// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';
import AppContext from 'components/AppContext';

type Props = {
  // full absolute path including base app path.
  // Do not include hashes, they will be inserted automatically.
  to: string,
  [any]: any
};

/**
 * This contains multiple routers because it is spread across separate Squarespace pages.
 * This renders either, a router <Link> if it links to the same app, or a regular <a> otherwise.
 */
export default class AppLink extends React.Component<Props, void> {

    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          replace: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired
        }).isRequired
      })
    };

    render() {
      return (
        <AppContext.Consumer>{currentAppRoot => {
          if (this.context.router && this.props.to.startsWith(currentAppRoot)) {
            const appScopedUrl = this.props.to.substr(currentAppRoot.length);
            return <RouterLink {...this.props} to={appScopedUrl} />;
          }
          // to is provided without a hash, insert a hash
          const endOfAppPath = this.props.to.indexOf('/', 1);
          const withHash = this.props.to.substring(0, endOfAppPath) + '#' + this.props.to.substring(endOfAppPath);
          return <a {...this.props} href={withHash} />;
        }}
        </AppContext.Consumer>
      );
    }
}