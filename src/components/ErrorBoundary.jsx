import { Component } from "react";

/**
 * @param {{ fallback?: import('react').ReactNode; children: import('react').ReactNode }} props
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg bg-red-950/40 text-red-100 p-4">
          <p>Something went wrong loading this section.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
