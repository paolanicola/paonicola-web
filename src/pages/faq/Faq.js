import React, { useEffect } from 'react';
import Accordion from '../../components/Accordion/Accordion';
import { accordionData } from '../../utils/contentFAQ';

import { useDispatch } from 'react-redux';
import { getTotals } from '../../features/cart/cartSlice';

export default function Faq() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotals());
  }, [dispatch]);
  return (
    <>
      <div>
        <div className='accordion'>
          {accordionData.map(({ title, content, id }) => (
            <Accordion title={title} content={content} id={id} />
          ))}
        </div>
      </div>
    </>
  );
}
