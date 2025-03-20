import React from 'react';

export default function ErrorPage({ error, retryFunction }) {
  return (
    <div className="error-container">
      <div className="error-box">
        {/* <Lottie animationData={errorAnimation} className="error-animation" /> */}
        <h1 className="error-title">Oops! Something Went Wrong</h1>
        <p className="error-message">
          {error || 'An unexpected error occurred.'}
        </p>

        <div className="error-buttons">
          <button
            className="error-btn back-btn"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>

          {retryFunction && (
            <button className="error-btn retry-btn" onClick={retryFunction}>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
