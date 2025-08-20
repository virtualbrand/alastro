import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation"
import { Button } from "@/components/ui/button"

const VIDEOS = [
  "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
  "kJQP7kiw5Fk", // Luis Fonsi - Despacito
  "JGwWNGJdvx8", // Ed Sheeran - Shape of You  
  "fJ9rUzIMcZQ", // Queen - Bohemian Rhapsody
]

const VideoHeroSection = () => {
  return (
    <ContainerScroll className="h-[350vh]">
      <BentoGrid
        variant="fourCells"
        className="sticky left-0 top-0 h-screen w-full p-4"
      >
        {VIDEOS.map((videoId, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-xl shadow-xl"
          >
            <iframe
              className="size-full"
              src={`https://www.youtube.com/embed/${videoId}?si=placeholder&rel=0&modestbranding=1`}
              title={`YouTube video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </BentoCell>
        ))}
      </BentoGrid>
      
      <ContainerScale className="relative z-10 text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-foreground">
          Galeria de Vídeos Animada
        </h1>
        <p className="my-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Uma seção hero com animações de scroll que apresenta vídeos do YouTube
          em uma grade responsiva com efeitos visuais.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button className="px-4 py-2 font-medium">
            Começar
          </Button>
          <Button
            variant="link"
            className="px-4 py-2 font-medium"
          >
            Saiba mais
          </Button>
        </div>
      </ContainerScale>
    </ContainerScroll>
  )
}

export default VideoHeroSection