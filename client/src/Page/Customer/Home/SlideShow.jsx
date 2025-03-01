import  { useState, useEffect } from 'react';
import './slideshow.css';
import image1 from '../../../assets/statistic.png';
import image2 from '../../../assets/vip.png';
import image3 from '../../../assets/history.png';
import image4 from '../../../assets/rating.png';
import image5 from '../../../assets/adminHome.png';
import image6 from '../../../assets/movieAdm.png';
import image7 from '../../../assets/userSub.png';


const images = [
  image1,image2,image3,image4,image5,image6,image7
];

const SlideShow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (<div className='container'>
            <div className='container-box'>
            <h1 style={{margin:'10px 0', textAlign:'center'}}>Introduce Our Website</h1>
              <div className="slideshow-container">
                <div className="slides">
                  {images.map((image, index) => (
                    <div
                      className={`slide ${index === currentIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="dots">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
  );
};

export default SlideShow;
