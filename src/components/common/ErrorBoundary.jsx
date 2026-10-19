import { Component } from 'react';
import { ErrorState } from '@/components/ui';

/** Catches render errors in a page. Resets when `resetKey` changes (e.g. on navigation). */
export class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  render() {
    if (this.state.error) {
      return <ErrorState onRetry={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}
