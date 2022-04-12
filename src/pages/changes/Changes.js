import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import img1 from '../../assets/images/transformaciones/t-caso1.jpg';
import img2 from '../../assets/images/transformaciones/t-caso2.jpg';
import img3 from '../../assets/images/transformaciones/t-caso3.jpg';

export default function Changes() {
  return (
    <>
      <div className='container-changes'>
        <Carousel>
          <div>
            <img src={img1} />
          </div>
          <div>
            <img src={img2} />
          </div>
          <div>
            <img src={img3} />
          </div>
        </Carousel>
      </div>
    </>
  );
}
