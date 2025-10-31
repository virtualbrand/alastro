import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PROJECTS = [
	{
		id: "YBikDJ05mvM",
		name: "Alastro & Manu Cit",
		thumbnail: "/images/capas/bastidores-ironman-manu-cit.webp",
		gif: "/videos/bastidores/bastidores-alastro-manu-cit-ironman.mp4",
	},
	{
		id: "YBikDJ05mvM",
		name: "Alastro & Instituto Vini Jr",
		thumbnail: "/images/capas/bastidores-vinijr.webp",
		// gif: "...",
	},
	{
		id: "YBikDJ05mvM",
		name: "Alastro & Gracie Kore",
		thumbnail: "/images/capas/bastidores-gracie-kore.webp",
		gif: "/videos/bastidores/bastidores-alastro-gracie-kore.mp4",
	},
	{
		id: "XtZJCqIBz4o",
		name: "Alastro & Guudrun SP",
		thumbnail: "/images/capas/bastidores-guudrun.webp",
		gif: "/videos/bastidores/bastidores-alastro-guudrun.mp4",
	},
]

const BastidoresSection = () => {
	const [hoveredProject, setHoveredProject] = useState<string | null>(null)
	useScrollAnimation()

		return (
		<section 
			id="cases" 
			className="w-screen bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24"
		>
			{/* Section Header */}
			<div className="container mx-auto px-4 mb-8 md:mb-12 space-y-1.5">
				<h3 className="fade-in text-3xl md:text-4xl font-amplitude font-bold tracking-tighter text-foreground text-center">
					Por trás das Câmeras
				</h3>
				<p className="fade-in max-w-3xl mx-auto text-foreground font-amplitude text-base sm:text-lg md:text-xl leading-normal text-center">
					Descubra como transformamos ideias em experiências audiovisuais memoráveis. Veja o processo criativo e a paixão da nossa equipe em cada projeto.
				</p>
			</div>

			{/* Projects Grid */}
			<div className="w-screen max-w-full overflow-hidden">
				<div className="grid grid-cols-2 grid-rows-2 w-full">
		{PROJECTS.map((project, index) => (
		  <Dialog key={index}>
			<DialogTrigger asChild>
			  <div 
                className="fade-in relative w-full h-full flex items-center justify-center"
              >
				<div className="group relative w-full aspect-[3/2] cursor-pointer overflow-hidden transition-transform duration-500 ease-in-out"
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
			  </div>
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
  </section>
	)
}

export default BastidoresSection