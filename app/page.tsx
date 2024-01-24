'use client'
import Image from "next/image";
import ThreeCard from "../components/ThreeCard";
import IntroSlide from "../components/IntroSlide";
import TimeLine from "../components/TimeLine";
import Slider from "react-slick";
import { fetchData } from '../lib/fetchData';
import React, { useState, useEffect, useRef } from 'react';


interface Action {
  type: string;
  content: any;
}

interface SlideContent {
  template_id: string;
  [key: string]: any;
}

export default function Home() {
  return (
    <>
      <SlideShowComponent />
    </>
  );
}


const SlideShowComponent = () => {
  const [actions, setActions] = useState([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [slideContents, setSlideContents] = useState<SlideContent[]>([]);
  const [visibleElements, setVisibleElements] = useState<{[key: string]: boolean}>({});
  const [updateCount, setUpdateCount] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  
  const audioRef = useRef(new Audio());

  useEffect(() => {
    fetch('/test.json')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data); // Add this line to log the fetched data
        setActions(data);
      });
  }, []);
  
  useEffect(() => {
    sliderRef.current?.slickGoTo(slideContents.length - 1);
  }, [slideContents])


  const executeAction = (action: Action) => {
    console.log("Executing action:", action);
    switch (action.type) {
      case 'show_slide':
        setSlideContents(prev => [...prev, action.content]);
        
        break;

      case 'display_element':
        const newVisibility: { [key: string]: boolean } = {};
        console.log(action.content.ids)
        action.content.ids.forEach((id: string) => {
          newVisibility[id] = true;
        });

        setVisibleElements(prev => ({ ...prev, ...newVisibility }));

        break;

      case 'play_audio':
        if (audioRef.current) {
          audioRef.current.src = action.content.url;
          audioRef.current.play()
            .catch(error => console.error('Error playing audio:', error));
        }
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  };


  useEffect(() => {
    if (actions?.length > 0 && currentActionIndex < actions.length) {
      const currentAction: Action = actions[currentActionIndex];
      executeAction(currentAction);

      if (currentAction.type !== 'play_audio') {
        setTimeout(() => {
          setCurrentActionIndex(currentActionIndex + 1);
        }, 500); // For example, wait for 3 seconds
      } else {
        const handleAudioEnd = () => {
          setCurrentActionIndex(currentActionIndex + 1);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        };

        audioRef.current.addEventListener('ended', handleAudioEnd);
      }
    }
  }, [currentActionIndex, actions]);
  
  const carouselItems = slideContents.map((slideContent, index) => {
    return (
      <div key={index}>
        {slideContent && slideContent.template_id === 'first_slide' && visibleElements && (
          <IntroSlide
            imageURL={visibleElements.image ? slideContent.image : null}
            title={visibleElements.title ? slideContent.title : ''}
            description={visibleElements.sub_title ? slideContent.sub_title : ''}
          />
        )}
        {slideContent && slideContent.template_id === 'three_elements' && visibleElements && (
          <ThreeCard
            cardTitle={visibleElements.title ? slideContent.title : ''}
            cardOneTitle={visibleElements.element_1 && slideContent.elements[0].title}
            cardOneText={visibleElements.element_1 && slideContent.elements[0].details}
            cardTwoTitle={visibleElements.element_2 && slideContent.elements[1].title}
            cardTwoText={visibleElements.element_2 && slideContent.elements[1].details}
            cardThreeTitle={visibleElements.element_3 && slideContent.elements[2].title}
            cardThreeText={visibleElements.element_3 && slideContent.elements[2].details}
          />
        )}
        {slideContent && slideContent.template_id === 'timeline' && visibleElements && (<TimeLine
          title={visibleElements.title ? slideContent.title : ''}
          subtitle1={visibleElements.element_1 && slideContent.elements[0].title}
          des1={visibleElements.element_1 && slideContent.elements[0].details}
          time1={visibleElements.element_1 && slideContent.elements[0].time}
          subtitle2={visibleElements.element_2 && slideContent.elements[1].title}
          des2={visibleElements.element_2 && slideContent.elements[1].details}
          time2={visibleElements.element_2 && slideContent.elements[1].time}
          subtitle3={visibleElements.element_3 && slideContent.elements[2].title}
          des3={visibleElements.element_3 && slideContent.elements[2].details}
          time3={visibleElements.element_3 && slideContent.elements[2].time}
        />
        )}
      </div>
    );
  });
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: () => setUpdateCount(updateCount + 1),
    beforeChange: (current: number, next: number) => setSlideIndex(next)
  };
  return (
    <div>
      {/* <h2>Slick Go To</h2>
      <p>Total updates: {updateCount} </p>
      <input
        onChange={e => sliderRef.current?.slickGoTo(parseInt(e.target.value))}
        value={slideIndex}
        type="range"
        min={0}
        max={3}
      /> */}
      <Slider ref={sliderRef} {...settings}>
        {carouselItems}
      </Slider>
    </div>
  );


  // return (
  //   <>
  //     <div>
  //       {slideContent && slideContent.template_id === 'first_slide' && visibleElements && (
  //         <IntroSlide
  //           imageURL={visibleElements.image ? slideContent.image : null}
  //           title={visibleElements.title ? slideContent.title : ''}
  //           description={visibleElements.sub_title ? slideContent.sub_title : ''}
  //         />
  //       )}
  //       {slideContent && slideContent.template_id === 'three_elements' && visibleElements && (
  //         <ThreeCard
  //           cardTitle={visibleElements.title ? slideContent.title : ''}
  //           cardOneTitle={visibleElements.element_1 && slideContent.elements[0].title}
  //           cardOneText={visibleElements.element_1 && slideContent.elements[0].details}
  //           cardTwoTitle={visibleElements.element_2 && slideContent.elements[1].title}
  //           cardTwoText={visibleElements.element_2 && slideContent.elements[1].details}
  //           cardThreeTitle={visibleElements.element_3 && slideContent.elements[2].title}
  //           cardThreeText={visibleElements.element_3 && slideContent.elements[2].details}
  //         />
  //       )}
  //       {slideContent && slideContent.template_id === 'timeline' && visibleElements && (<TimeLine
  //         title={visibleElements.title ? slideContent.title : ''}
  //         subtitle1={visibleElements.element_1 && slideContent.elements[0].title}
  //         des1={visibleElements.element_1 && slideContent.elements[0].details}
  //         time1={visibleElements.element_1 && slideContent.elements[0].time}
  //         subtitle2={visibleElements.element_2 && slideContent.elements[1].title}
  //         des2={visibleElements.element_2 && slideContent.elements[1].details}
  //         time2={visibleElements.element_2 && slideContent.elements[1].time}
  //         subtitle3={visibleElements.element_3 && slideContent.elements[2].title}
  //         des3={visibleElements.element_3 && slideContent.elements[2].details}
  //         time3={visibleElements.element_3 && slideContent.elements[2].time}
  //       />
  //       )}
  //     </div>
  //   </>
  // );
};
