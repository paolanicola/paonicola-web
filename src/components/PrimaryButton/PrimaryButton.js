import React from 'react';

export default function PrimaryButton({ actionText, onClick }) {
  return (
    <button className="primary-button" onClick={onClick}>
      {actionText}
    </button>
  );
}
