import React, { useState, useEffect } from 'react';
import { ReactComponent as Minus } from '../../assets/images/faq/minus.svg';
import { ReactComponent as Plus } from '../../assets/images/faq/plus.svg';

const Accordion = ({ title, content, id }) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    return () => {};
  }, [isActive]);

  return (
    <>
      <div className='card-accordion'>
        <div className='card-accordion-header' onClick={() => setIsActive(!isActive)}>
          <div className='number-collapse'>{id}.</div>
          <div className='title-accordion'>
            <p>{title}</p>
          </div>
          <div className='plusMinusAccordion'>{isActive ? <Minus /> : <Plus />}</div>
        </div>
        {isActive && <div className='card-accordion-body' dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </>
  );
};
export default Accordion;
