import React, { Component } from 'react';
import { ApiError } from '@/shared/lib/errors.ts';
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

    // 렌더 중 터진 오류는 로그인과 무관하니 다시 로그인시키지 않습니다.
    setStep(error instanceof ApiError ? stepForError(error) : JolupSteps.FILE_UPLOAD);
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
