import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PROJECTS = [
  {
	id: "oHzDwA0vzMA",
	name: "Projeto 1",
	thumbnail: "/images/projeto-1.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vuw9m5wXviFIQ/giphy.gif",
  },
  {
	id: "oHzDwA0vzMA",
	name: "Projeto 2",
	thumbnail: "/images/projeto-2.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYryZTmQgvHI5TG/giphy.gif",
  },
  {
	id: "1TKv2k29d6s",
	name: "Projeto 3",
	thumbnail: "/images/projeto-3.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NwenH3O/giphy.gif",
  },
  {
	id: "RjcHNswMzrk",
	name: "Projeto 4",
	thumbnail: "/images/projeto-4.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif",
  },
  {
	id: "RjcHNswMzrk",
	name: "Projeto 5",
	thumbnail: "/images/projeto-5.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5GoVLqeAOo6PK/giphy.gif",
  },
  {
	id: "hT_nvWreIhg",
	name: "Projeto 6",
	thumbnail: "/images/projeto-6.jpg",
	gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXB2dGp4Z2ozMnc4Zm1qMzl1dGpkaTE2MmV6Ym4xcXh3ZHd0dmlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif",
  },
]

const VideoHeroSection = () => {
	const [hoveredProject, setHoveredProject] = useState<string | null>(null)

	return (
  <div className="w-screen flex flex-col items-center justify-center bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24">
	<motion.h3
          className="w-full py-8 md:py-12 lg:pt-24 text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold tracking-tighter text-foreground mb-8 text-center"
          {...useScrollAnimation({ direction: 'fade', once: true })}
        >
          Galeria de Vídeos Animada
        </motion.h3>
	<div className="w-screen max-w-full" style={{overflow: 'hidden'}}>
	  <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 w-full">
		{PROJECTS.map((project, index) => (
		  <Dialog key={index}>
			<DialogTrigger asChild>
			  <motion.div 
                className="relative w-full h-full flex items-center justify-center"
                {...useScrollAnimation({ 
                  direction: index % 2 === 0 ? 'left' : 'right',
                  amount: 0.2,
                  once: true
                })}
              >
                <div className="group relative w-full aspect-[3/2] cursor-pointer overflow-hidden"
				  onMouseEnter={() => setHoveredProject(project.id)}
				  onMouseLeave={() => setHoveredProject(null)}>
				  <img
					className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
					src={hoveredProject === project.id ? project.gif : project.thumbnail}
					alt={project.name}
					draggable={false}
				  />
				  {/* Hover overlay */}
				  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60" />
				  {/* Play button and project name */}
				  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
					  <Play className="h-8 w-8 fill-white text-white" />
					</div>
					<h3 className="text-base font-amplitude font-semibold text-white leading-normal">
					  {project.name}
					</h3>
				  </div>
				</div>
			  </motion.div>
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
	  </div>
	</div>
  </div>
	)
}

export default VideoHeroSection