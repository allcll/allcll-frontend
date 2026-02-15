import React, { Component, ErrorInfo } from 'react';
import { JolupSteps } from '../../lib/useJolupSteps';

interface Props {
  children: React.ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey: JolupSteps;
}

interface State {
  hasError: boolean;
}

class StepErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default StepErrorBoundary;
