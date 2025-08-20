import { 
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer 
} from "@/components/ui/animated-gallery"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

// Using placeholder image for all gallery items
const PLACEHOLDER_IMAGE = "/lovable-uploads/eeab632a-6132-4c98-b778-bad4098d0323.png"

const IMAGES_1 = Array(4).fill(PLACEHOLDER_IMAGE)
const IMAGES_2 = Array(4).fill(PLACEHOLDER_IMAGE)
const IMAGES_3 = Array(4).fill(PLACEHOLDER_IMAGE)

const WorksGallerySection = () => {
  return (
    <div className="relative bg-background">
      <ContainerStagger className="relative z-[9999] -mb-12 place-self-center px-6 pt-12 text-center">
        <ContainerAnimated>
          <h1 className="font-amplitude text-4xl font-bold text-foreground md:text-5xl uppercase">
            NOSSOS{" "}
            <span className="font-amplitude font-bold text-primary">
              TRABALHOS
            </span>
          </h1>
        </ContainerAnimated>
        <ContainerAnimated>
          <h2 className="font-amplitude text-4xl font-bold text-foreground md:text-5xl uppercase">
            EM DESTAQUE
          </h2>
        </ContainerAnimated>

        <ContainerAnimated className="my-4">
          <p className="leading-normal tracking-tight text-muted-foreground">
            Conheça alguns dos nossos projetos mais marcantes
            <br /> 
            e descubra como transformamos ideias em realidade audiovisual.
          </p>
        </ContainerAnimated>

        <ContainerAnimated>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            VER PORTFÓLIO COMPLETO <Play className="size-4" />
          </Button>
        </ContainerAnimated>
      </ContainerStagger>

      <div 
        className="pointer-events-none absolute z-10 h-[70vh] w-full opacity-20"
        style={{
          background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))",
          filter: "blur(84px)",
          mixBlendMode: "screen",
        }}
      />

      <ContainerScroll className="relative h-[350vh]">
        <ContainerSticky className="h-svh">
          <GalleryContainer className="">
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_1.map((imageUrl, index) => (
                <img
                  key={index}
                  className="block h-auto max-h-full w-full rounded-md object-cover shadow-lg"
                  src={imageUrl}
                  alt={`Trabalho audiovisual ${index + 1}`}
                />
              ))}
            </GalleryCol>
            <GalleryCol className="mt-[-50%]" yRange={["15%", "5%"]}>
              {IMAGES_2.map((imageUrl, index) => (
                <img
                  key={index}
                  className="block h-auto max-h-full w-full rounded-md object-cover shadow-lg"
                  src={imageUrl}
                  alt={`Trabalho audiovisual ${index + 5}`}
                />
              ))}
            </GalleryCol>
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_3.map((imageUrl, index) => (
                <img
                  key={index}
                  className="block h-auto max-h-full w-full rounded-md object-cover shadow-lg"
                  src={imageUrl}
                  alt={`Trabalho audiovisual ${index + 9}`}
                />
              ))}
            </GalleryCol>
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>
    </div>
  )
}

export default WorksGallerySection