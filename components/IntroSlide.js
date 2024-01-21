export default function IntroSlide({imageURL, title, description}) {
    return (
      <section className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            alt="Profile Picture"
            className="w-full h-auto rounded-full object-cover"
            height="500"
            src={imageURL}
            style={{
              aspectRatio: "500/500",
              objectFit: "cover",
            }}
            width="500"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200">{title}</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </section>
    )
  }
  
  