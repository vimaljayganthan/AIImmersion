import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Faulty component to simulate runtime render crash
const BrokenComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test Component Explosion: Simulated render failure');
  }
  return <div data-testid="working-content">Application View Rendered Cleanly</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error in tests when expected exceptions occur
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children normally when no component error occurs', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('working-content')).toBeInTheDocument();
    expect(screen.getByText('Application View Rendered Cleanly')).toBeInTheDocument();
  });

  it('catches render errors and displays the branded DriveIQ fallback UI', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Fallback UI should be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something interrupted this view/i)).toBeInTheDocument();
    expect(screen.getByText(/DriveIQ/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload App/i })).toBeInTheDocument();
  });

  it('invokes onError prop when an error is caught', () => {
    const onErrorMock = vi.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock.mock.calls[0][0].message).toContain('Test Component Explosion');
  });

  it('resets error state when "Try Again" is clicked', () => {
    let throwError = true;

    const DynamicComponent = () => {
      if (throwError) {
        throw new Error('Transient error');
      }
      return <div>Recovered Component State</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <DynamicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something interrupted this view/i)).toBeInTheDocument();

    // Fix the underlying condition
    throwError = false;

    // Click "Try Again"
    const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainBtn);

    rerender(
      <ErrorBoundary>
        <DynamicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered Component State')).toBeInTheDocument();
  });

  it('supports rendering a custom fallback node if supplied', () => {
    const customFallback = <div data-testid="custom-error">Custom Diagnostic Failure Screen</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    expect(screen.queryByText(/Something interrupted this view/i)).not.toBeInTheDocument();
  });
});
