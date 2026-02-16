import React, { Component, ErrorInfo } from 'react';
import { JolupSteps, useJolupStore } from '../../model/useJolupStore';

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

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const { setStep } = useJolupStore.getState();
    const message = error.message;

    if (message.includes('401') || message.includes('Unauthorized')) {
      setStep(JolupSteps.LOGIN);
    } else if (message.includes('학과') || message.includes('Major') || message.includes('기본 정보')) {
      setStep(JolupSteps.DEPARTMENT_INFO);
    } else {
      setStep(JolupSteps.FILE_UPLOAD);
    }
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
