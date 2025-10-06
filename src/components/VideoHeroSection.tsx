import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PROJECTS = [
	{
		id: "93dXSj2pe9k",
		name: "Manu Cit - Ironman",
		thumbnail: "/images/projeto-4.jpg",
		gif: "/videos/bastidores/bastidores-alastro-manu-cit-ironman.mp4",
	},
	{
		id: "oZ0T3nDdUM0",
		name: "Vini Jr - Jantar 2024",
		thumbnail: "/images/capas/cover-vinijr.webp",
		gif: "/videos/trabalhos/instituto-vini-jr-jantar.mp4",
	},
	{
		id: "5CY-4ckG4pU",
		name: "7 anos Gracie Kore",
		thumbnail: "/images/projeto-3.jpg",
		gif: "/videos/trabalhos/7-anos-gracie-kore.mp4",
	},
	{
		id: "0XbzQkktOGw",
		name: "Tributo Sp - Guudrun",
		thumbnail: "/images/projeto-2.jpg",
		gif: "/videos/trabalhos/tributo-sp-guudrun.mp4",
	},
	{
		id: "A8jmn_VofMA",
		name: "Veigh RS",
		thumbnail: "/images/capas/cover-veigh.webp",
		// gif: "...", (não há vídeo correspondente)
	},
	{
		id: "wCE9eu8HzVo",
		name: "Xamã",
		thumbnail: "/images/capas/cover-xama.webp",
		// gif: "...", (não há vídeo correspondente)
	},
]

const VideoHeroSection = () => {
	const [hoveredProject, setHoveredProject] = useState<string | null>(null)

		return (
		<div id="cases" className="w-screen flex flex-col items-center justify-center bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24">
	<motion.h3
          className="w-full py-6 md:py-5 lg:pt-24 text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold tracking-tighter text-foreground text-center"
          {...useScrollAnimation({ direction: 'fade', once: true })}
				>
					Nossos trabalhos em ação
	</motion.h3>
	<motion.p
		className="w-full max-w-lg mx-auto text-foreground font-amplitude sm:text-lg md:text-xl leading-normal text-center mb-8"
		{...useScrollAnimation({ direction: 'fade', once: true })}
	>
		Confira a seleção de alguns projetos audiovisuais, desde eventos corporativos até produções cinematográficas que conectam e impactam.
	</motion.p>
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
					{/* Thumbnail image */}
					<img
						className={`w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 ${hoveredProject === project.id && project.gif ? 'opacity-0' : 'opacity-100'}`}
						src={project.thumbnail}
						alt={project.name}
						draggable={false}
					/>
					{/* Video "gif" on hover - only if gif exists */}
					{project.gif && (
						<video
							className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'}`}
							src={project.gif}
							autoPlay
							muted
							loop
							playsInline
						/>
					)}
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