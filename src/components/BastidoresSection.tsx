import { OutlineButtonLink } from "@/components/ui/outline-button-link"
import { HomeCaseCard } from "@/components/HomeCaseCard"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import type { HomeCase } from "@/lib/cases-queries"

/**
 * "Por trás das câmeras": os cases em destaque da categoria bastidores
 * cadastrados no painel, na ordem da lista de lá. A seção continua existindo
 * sem cases para a âncora #bastidores seguir funcionando.
 */
const BastidoresSection = ({ dbCases = [] }: { dbCases?: HomeCase[] }) => {
	useScrollAnimation()

	return (
		<section 
			id="bastidores" 
			className="w-screen bg-[var(--color-bg-2)] overflow-x-hidden pt-12 md:pt-16 lg:pt-24"
		>
			{/* Section Header */}
			<div className="container mx-auto px-4 mb-8 md:mb-12 space-y-1.5">
				<h3 className="fade-in text-3xl md:text-4xl font-amplitude font-bold tracking-tighter text-foreground text-center" suppressHydrationWarning>
					Por trás das Câmeras
				</h3>
				<p className="fade-in max-w-3xl mx-auto text-foreground font-amplitude text-paragraph text-center" suppressHydrationWarning>
					Descubra como transformamos ideias em experiências audiovisuais memoráveis. Veja o processo criativo e a paixão da nossa equipe em cada projeto.
				</p>
			</div>

			{/* Bastidores em destaque do painel */}
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
				<OutlineButtonLink href="/cases">Ver todos os bastidores</OutlineButtonLink>
			</div>
		</section>
	)
}

export default BastidoresSection
