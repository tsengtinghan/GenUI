
export default function IntroSlide({imageURL, title, description}) {
  return (
    <div className="flex flex-row items-center justify-center p-6 w-full h-full">
      <div className="flex-grow basis-1/2 bg-black h-full flex items-center justify-center">
      <img
            alt="Circular Image"
            className="inset-0 h-1/2 rounded-full object-cover shadow-lg"
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
            style={{
              aspectRatio: "256/256",
              objectFit: "cover",
            }}
          />
      </div>
      <div className="flex-grow basis-1/2 flex-shrink-0 bg-green-50 h-full">
        
      </div>
    </div>
  )
}

// export default function IntroSlide({imageURL, title, description}) {
//   return (
//     <div className="flex items-center justify-center p-6 w-full h-full">
//       <div className="flex-1 w-30">
          // <img
          //   alt="Circular Image"
          //   className="inset-0 h-full rounded-full object-cover shadow-lg"
          //   src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
          //   style={{
          //     aspectRatio: "256/256",
          //     objectFit: "cover",
          //   }}
          //   width="256"
          // />
//       </div>
//       <div className="flex-1 space-y-4">
//         <h1 className="text-4xl font-bold">Title Goes Here</h1>
//         <p className="text-lg">Subtitle goes here</p>
//       </div>
//     </div>
//   )
// }

// export default function IntroSlide({imageURL, title, description}) {
//     return (
//       <section className="w-full h-full flex items-center justify-center">
//         <div className="w-1/2 h-full flex items-center justify-center">
//           <img
//             alt="Profile Picture"
//             className="w-full h-auto rounded-full object-cover"
//             height="500"
//             src={imageURL}
//             style={{
//               aspectRatio: "500/500",
//               objectFit: "cover",
//             }}
//             width="500"
//           />
//         </div>
//         <div className="w-1/2 h-full flex flex-col items-center justify-center space-y-4">
//           <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200">{title}</h1>
//           <p className="text-xl text-center text-gray-600 dark:text-gray-400">{description}</p>
//         </div>
//       </section>
//     )
//   }
  
  