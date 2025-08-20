import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { useState } from "react"

const PROJECTS = [
  { 
    id: "dQw4w9WgXcQ", 
    name: "Projeto 1",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vuw9m5wXviFIQ/giphy.gif"
  },
  { 
    id: "kJQP7kiw5Fk", 
    name: "Projeto 2",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYryZTmQgvHI5TG/giphy.gif"
  },
  { 
    id: "JGwWNGJdvx8", 
    name: "Projeto 3",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NwenH3O/giphy.gif"
  },
  { 
    id: "fJ9rUzIMcZQ", 
    name: "Projeto 4",
    thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif"
  }
]

const VideoHeroSection = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  return (
    <ContainerScroll className="h-[350vh] relative z-0">
      <BentoGrid
        variant="fourCells"
        className="sticky left-0 top-0 h-screen w-full p-4 z-0"
      >
        {PROJECTS.map((project, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <BentoCell
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-xl"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <img
                  className="size-full object-cover transition-all duration-300 group-hover:scale-105"
                  src={hoveredProject === project.id ? project.gif : project.thumbnail}
                  alt={project.name}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60" />
                
                {/* Play button and project name */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                </div>
              </BentoCell>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl p-0">
              <div className="aspect-video w-full">
                <iframe
                  className="size-full rounded-lg"
                  src={`https://www.youtube.com/embed/${project.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={project.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </BentoGrid>
      
      <ContainerScale className="relative z-5 text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-foreground">
          Galeria de Vídeos Animada
        </h1>
        <p className="my-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Uma seção hero com animações de scroll que apresenta vídeos do YouTube
          em uma grade responsiva com efeitos visuais.
        </p>
      </ContainerScale>
    </ContainerScroll>
  )
}

export default VideoHeroSection