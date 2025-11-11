import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Play } from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PROJECTS = [
	{
		id: "93dXSj2pe9k",
		name: "Manu Cit - Ironman",
		thumbnail: "/images/capas/cover-manu-cit.webp",
		gif: "/videos/trabalhos/documentario-manu-cit-ironman.mp4",
	},
	{
		id: "oZ0T3nDdUM0",
		name: "Instituto Vini Jr - Jantar Beneficente",
		thumbnail: "/images/capas/cover-vinijr.webp",
		gif: "/videos/trabalhos/instituto-vini-jr-jantar.mp4",
	},
	{
		id: "5CY-4ckG4pU",
		name: "7 anos Gracie Kore",
		thumbnail: "/images/capas/cover-gracie-kore.webp",
		gif: "/videos/trabalhos/7-anos-gracie-kore.mp4",
	},
	{
		id: "0XbzQkktOGw",
		name: "Guudrun SP",
		thumbnail: "/images/capas/cover-guudrun-sp.webp",
		gif: "/videos/trabalhos/tributo-sp-guudrun.mp4",
	},
	{
		id: "A8jmn_VofMA",
		name: "Documentário Veigh",
		thumbnail: "/images/capas/cover-veigh.webp",
		gif: "/videos/trabalhos/documentario-veigh.mp4",
	},
	{
		id: "wCE9eu8HzVo",
		name: "Documentário Xamã",
		thumbnail: "/images/capas/cover-xama.webp",
		gif: "/videos/trabalhos/documentario-xama.mp4",
	},
]

const VideoHeroSection = () => {
	const [hoveredProject, setHoveredProject] = useState<string | null>(null)
	useScrollAnimation()

	return (
		<section 
			id="portfolio" 
			className="relative w-screen bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24 z-10 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.2)]"
		>
			{/* Section Header */}
			<div className="container mx-auto px-4 mb-8 md:mb-12 space-y-1.5">
				<h3 className="fade-in text-3xl md:text-4xl font-amplitude font-bold tracking-tighter text-foreground text-center">
					Nossos trabalhos em ação
				</h3>
				<p className="fade-in max-w-3xl mx-auto text-foreground font-amplitude text-base sm:text-xl leading-normal text-center">
					Confira a seleção de alguns projetos audiovisuais, desde eventos corporativos até produções cinematográficas que conectam e impactam.
				</p>
			</div>

			{/* Projects Grid */}
			<div className="w-screen max-w-full overflow-hidden">
				<div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 w-full">
					{PROJECTS.map((project, index) => (
						<Dialog key={index}>
							<DialogTrigger asChild>
								<div 
									className={`relative w-full h-full flex items-center justify-center ${index % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
								>
									<div 
										className="group relative w-full aspect-[3/2] cursor-pointer overflow-hidden"
										onMouseEnter={() => setHoveredProject(project.id)}
										onMouseLeave={() => setHoveredProject(null)}
									>
										{/* Responsive thumbnail otimizada automaticamente */}
										<OptimizedImage
											className={`w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 ${hoveredProject === project.id && project.gif ? 'opacity-0' : 'opacity-100'}`}
											src={project.thumbnail}
											sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
											alt={project.name}
											draggable={false}
										/>
										{/* Video "gif" on hover - lazy load */}
										{project.gif && (
											<video
												className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'}`}
												src={project.gif}
												autoPlay
												muted
												loop
												playsInline
												preload="none"
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

export default VideoHeroSection