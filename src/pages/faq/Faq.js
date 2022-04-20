import React from 'react';
import Accordion from '../../components/Accordion/Accordion';
import { accordionData } from '../../utils/contentFAQ';

export default function Faq() {
  return (
    <>
      <div>
        <div className='accordion'>
          {accordionData.map(({ title, content, id }) => (
            <Accordion key={id} title={title} content={content} id={id} />
          ))}
        </div>
      </div>
    </>
  );
}
