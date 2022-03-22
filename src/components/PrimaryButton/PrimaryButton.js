import React from 'react';
import { Link } from 'react-router-dom';

export default function PrimaryButton({ actionText, href }) {
  return (
    <Link to={href} className='primary-button'>
      {actionText}
    </Link>
  );
}
