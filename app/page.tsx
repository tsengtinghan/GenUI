'use client'
import Image from "next/image";
import ThreeCard from "../components/ThreeCard";
import IntroSlide from "../components/IntroSlide";
import Timeline from "../components/Timeline";
import { fetchData } from '../lib/fetchData';
import React, { useState, useEffect, useRef } from 'react';


export default function Home({data}) {
  return (
    <>
      <SlideShowComponent /> 
    </>

  );
}



const SlideShowComponent = () => {
  const [actions, setActions] = useState([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [slideContent, setSlideContent] = useState(null);
  const audioRef = useRef(new Audio());

  // Fetch actions from the backend
  useEffect(() => {
    fetch('/test.json')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data); // Add this line to log the fetched data
        setActions(data);
      });
  }, []);
  


  const [showSlide, setShowSlide] = useState(false);
  const [visibleElements, setVisibleElements] = useState({});
  

const executeAction = (action) => {
  console.log("Executing action:", action);
  switch(action.type) {
    case 'show_slide':
      setSlideContent(action.content);
      setVisibleElements({})
      break;

    case 'display_element':
      const ids = action.content.ids.flatMap(id => id.split(',').map(item => item.trim()));
      const newVisibility = {};
      ids.forEach(id => {
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
      // Handle unknown action
  }
};


  // Effect to run actions sequentially
  useEffect(() => {
    if (actions?.length > 0 && currentActionIndex < actions.length) {
      const currentAction = actions[currentActionIndex];
      executeAction(currentAction);
  
      if (currentAction.type !== 'play_audio') {
        setTimeout(() => {
          setCurrentActionIndex(currentActionIndex + 1);
        }, 3000); // For example, wait for 3 seconds
      } else {
        const handleAudioEnd = () => {
          setCurrentActionIndex(currentActionIndex + 1);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        };
  
        audioRef.current.addEventListener('ended', handleAudioEnd);
      }
    }
  }, [currentActionIndex, actions]);
  

  return (
    <>
      <div>
        {slideContent && slideContent.template_id === 'intro_slide' && visibleElements && (
          <IntroSlide
            imageURL={visibleElements.image ? slideContent.image : null}
            title={visibleElements.title ? slideContent.title : ''}
            description={visibleElements.sub_title ? slideContent.sub_title : ''}
          />
        )}
        {slideContent && slideContent.template_id === 'three_elements' && visibleElements && (
          <ThreeCard
            cardTitle={visibleElements.title ? slideContent.title : ''}
            cardOneTitle={visibleElements.elements && slideContent.elements[0].title}
            cardOneText={visibleElements.elements && slideContent.elements[0].details}
            cardTwoTitle={visibleElements.elements && slideContent.elements[1].title}
            cardTwoText={visibleElements.elements && slideContent.elements[1].details}
            cardThreeTitle={visibleElements.elements && slideContent.elements[2].title}
            cardThreeText={visibleElements.elements && slideContent.elements[2].details}
          />
        )}
        {slideContent && slideContent.template_id === 'timeline' && visibleElements && (<Timeline
          title={visibleElements.title ? slideContent.title : ''}
          subtitle1={visibleElements.elements && slideContent.elements[0].title}
          des1={visibleElements.elements && slideContent.elements[0].details}
          time1={visibleElements.elements && slideContent.elements[0].time}
          subtitle2={visibleElements.elements && slideContent.elements[1].title}
          des2={visibleElements.elements && slideContent.elements[1].details}
          time2={visibleElements.elements && slideContent.elements[1].time}
          subtitle3={visibleElements.elements && slideContent.elements[2].title}
          des3={visibleElements.elements && slideContent.elements[2].details}
          time3={visibleElements.elements && slideContent.elements[2].time}
        />
        )}
      </div>
    </>
  );
};






