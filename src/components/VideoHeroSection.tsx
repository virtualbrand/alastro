import { OutlineButtonLink } from "@/components/ui/outline-button-link"
import { HomeCaseCard } from "@/components/HomeCaseCard"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import type { HomeCase } from "@/lib/cases-queries"

/**
 * "Nossos trabalhos em ação": os cases em destaque (categoria case) cadastrados
 * no painel, na ordem da lista de lá. A seção continua existindo sem cases para
 * a âncora #cases do menu seguir funcionando.
 */
const VideoHeroSection = ({ dbCases = [] }: { dbCases?: HomeCase[] }) => {
	useScrollAnimation()

	return (
		<section 
			id="cases" 
			className="relative w-screen bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24 z-10 shadow-section-top"
		>
			{/* Section Header */}
			<div className="container mx-auto px-4 mb-8 md:mb-12 space-y-1.5">
				<h3 className="fade-in text-3xl md:text-4xl font-amplitude font-bold tracking-tighter text-foreground text-center" suppressHydrationWarning>
					Nossos trabalhos em ação
				</h3>
				<p className="fade-in max-w-3xl mx-auto text-foreground font-amplitude text-paragraph text-center" suppressHydrationWarning>
					Confira a seleção de alguns projetos audiovisuais, desde eventos corporativos até produções cinematográficas que conectam e impactam.
				</p>
			</div>

			{/* Cases em destaque do painel */}
			{dbCases.length > 0 && (
				<div className="w-screen max-w-full overflow-hidden">
					<div className="grid w-full grid-cols-2 lg:grid-cols-3">
						{dbCases.map((item) => (
							<HomeCaseCard key={item.id} item={item} />
						))}
					</div>
				</div>
			)}

			<div className="py-10 text-center md:py-14">
				<OutlineButtonLink href="/cases">Ver todos os cases</OutlineButtonLink>
			</div>
		</section>
	)
}

export default VideoHeroSection
