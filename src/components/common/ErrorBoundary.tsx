import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnLocationChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showTechnicalDetails: boolean;
}

/**
 * DriveIQ Enterprise Error Boundary
 *
 * Catches unexpected rendering/component lifecycle errors, prevents the entire
 * application or sub-portal from becoming unusable, and displays a graceful,
 * branded fallback interface with recovery options.
 *
 * Features:
 * - Isolated crash containment for subtrees or whole-application root.
 * - Recovery actions: "Try Again" (resets state), "Reload Application", "Return Home".
 * - Technical details expandable only in development mode to avoid leaking internals.
 * - Safe sanitization: Never exposes database credentials, auth tokens, or stack traces in production.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showTechnicalDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Technical diagnostic logging for debugging
    console.error(
      '[DriveIQ ErrorBoundary] Component tree exception captured:',
      error.message,
      '\nComponent Stack:',
      errorInfo.componentStack
    );

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleTryAgain = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showTechnicalDetails: false,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  toggleTechnicalDetails = (): void => {
    this.setState((prev) => ({ showTechnicalDetails: !prev.showTechnicalDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = Boolean(
        typeof import.meta !== 'undefined' &&
          (import.meta.env?.DEV || import.meta.env?.MODE === 'development')
      );

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-white"
        >
          <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {/* Header / Brand Icon */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Drive<span className="text-cyan-400">IQ</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-medium">
                    Component Anomaly
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Intelligent Vehicle Diagnostics & Service Platform</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-2">
                Something interrupted this view
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                DriveIQ intercepted an unexpected component error to protect your active session.
                Your saved vehicles, diagnostic records, and workspace configurations remain secure.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleTryAgain}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all duration-150"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 text-sm font-medium rounded-xl border border-slate-600 transition-all duration-150"
              >
                Reload App
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 transition-all duration-150"
                title="Return to Landing Page"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>

            {/* Developer Diagnostics (Shown only in development or toggleable) */}
            {isDev && this.state.error && (
              <div className="mt-4 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={this.toggleTechnicalDetails}
                  className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Technical Diagnostics ({this.state.showTechnicalDetails ? 'Collapse' : 'Expand'})
                  </span>
                  {this.state.showTechnicalDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {this.state.showTechnicalDetails && (
                  <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-left font-mono text-xs text-red-300 overflow-x-auto max-h-48 scrollbar-thin">
                    <div className="font-semibold text-red-400 mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-[11px] text-slate-400 whitespace-pre-wrap leading-tight mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
