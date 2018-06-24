// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

type Props = {
  to: string,
  [any]: any
};

const APP_ROOT = '/shows';

/**
 * If this is used in a router, it's the same as the Router <Link>,
 * but if used outside a router, it's a normal link unto the routed app.
 */
export default class AppLink extends React.Component<Props, void> {

    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          replace: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    };

    render() {
      if (this.context.router) {
        return <RouterLink {...this.props} />;
      }
      return <a {...this.props} href={`${APP_ROOT}/#${this.props.to}`} />;
    }
}