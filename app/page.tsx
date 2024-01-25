'use client'
import Image from "next/image";
import ThreeCard from "../components/ThreeCard";
import IntroSlide from "../components/IntroSlide";
import TimeLine from "../components/TimeLine";
import Slider from "react-slick";
import { fetchData } from '../lib/fetchData';
import React, { useState, useEffect, useRef } from 'react';

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



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
  const [visibleElements, setVisibleElements] = useState<{ [key: string]: boolean }>({});
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
    sliderRef.current?.slickGoTo(slideContents.length - 1); // this has to run after slideContents is updated since all of the slides has to be rendered first before we can go to the last slide
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
        }, 500); // For example, wait for 0.5 seconds
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
      <CarouselItem key={index} className="flex justify-center">
        <div className="w-full bg-white max-w-screen-lg shadow-2xl rounded-lg aspect-[16/9] m-12 mb-16">

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
      </CarouselItem>
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

      <div className="mx-auto h-full flex flex-col items-center justify-center gap-4 p-2">
      <Carousel className="w-full">
        <CarouselContent>
          {carouselItems}
        </CarouselContent>
      </Carousel>

      <div className="w-full max-w-lg flex justify-between items-center relative -top-12 gap-4 bg-black rounded-3xl p-2">
        <Label className="sr-only overflow:visible" htmlFor="input-field">
          Input Field
        </Label>
        <Input
          className="flex-grow text-white bg-black placeholder-white border-0 rounded-3xl focus:outline-none focus:ring-0"
          id="input-field"
          placeholder="Enter text here"
        />
        <Button className="bg-white text-black p-2 rounded-3xl">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </Button>
      </div>
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


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Component() {
  return (
    <div className="flex flex-row items-center justify-center p-6 w-full h-full">
      <div className="flex-grow basis-1/3 bg-black h-full">
        
      </div>
      <div className="flex-grow basis-2/3 bg-green-50 h-full">
        
      </div>
    </div>
  )
}
