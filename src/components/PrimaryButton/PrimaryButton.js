import React from 'react';
import { Link } from 'react-router-dom';

export default function PrimaryButton({ actionText, href, onClick }) {
  return (
    <Link to={href}>
      <button className='primary-button' onClick={onClick}>
        {actionText}
      </button>
    </Link>
  );
}
