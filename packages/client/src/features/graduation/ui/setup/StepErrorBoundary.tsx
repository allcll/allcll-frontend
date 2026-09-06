import React, { Component } from 'react';
import { JolupSteps, useJolupStore } from '../../model/useJolupStore';
import { stepForError } from '../../lib/stepForError.ts';

interface Props {
  children: React.ReactNode;
  resetKey?: JolupSteps;
}

interface State {
  hasError: boolean;
}

class StepErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const { setStep } = useJolupStore.getState();

    setStep(stepForError(error));
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
