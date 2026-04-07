"use client";

import { useEffect, lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Video, Camera, Users, Sparkles, Play, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/services/emailService";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Hero Section específica para casamentos
function WeddingHeroSection() {
  useScrollAnimation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fallback de imagem caso o vídeo não execute */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/wedding/hero-wedding.webp')" }}
      />
      {/* Vídeo de background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        style={{ willChange: "auto" }}
      >
        <source src="/videos/hero-wedding.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#d9d9d6] z-[2]" />
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="fade-in text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-cormorant mb-6 text-white leading-tight uppercase" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }} suppressHydrationWarning>
            O Seu Grande Dia
            <br />
            <span className="text-white">
              Eternizado em Imagens
            </span>
          </h1>
          
          <p className="fade-in text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-playfair" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }} suppressHydrationWarning>
            Transformamos momentos únicos em memórias inesquecíveis. 
            Cobertura audiovisual completa para o casamento dos seus sonhos.
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.1),transparent_50%)] pointer-events-none" />
    </section>
  );
}

// Seção de Manifesto para Casamentos
function WeddingManifestoSection() {
  useScrollAnimation();
  
  return (
    <section id="sobre" className="py-24 bg-[var(--color-bg-2)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Imagem à esquerda */}
          <div className="fade-in">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              <OptimizedImage
                src="/images/wedding/historias.webp"
                alt="Alastro Wedding"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Texto à direita */}
          <div className="fade-in space-y-6">
            <h2 className="text-3xl md:text-4xl font-cormorant text-[#3A2F28] leading-tight">
              HISTÓRIAS NÃO SE REGISTRAM,<br />SE CONSTROEM.
            </h2>
            
            <div className="space-y-4 text-black/80 font-playfair text-base md:text-lg leading-relaxed">
              <p>
                Nossa grande paixão sempre foi contar histórias reais.<br />
                Desde o início da Alastro, produzimos documentários que revelam<br />
                essência, trajetória e verdade.
              </p>
              
              <p>
                Trabalhamos ao lado de alguns dos maiores nomes do mercado,<br />
                construindo narrativas que atravessam tempo, marca e memória.
              </p>
              
              <p className="font-bold">
                No casamento, não é diferente.
              </p>
              
              <p>
                Não entregamos apenas um filme.<br />
                Entregamos um documentário que revela quem vocês são, de onde vieram e<br />
                o que estão construindo juntos.
              </p>
              
              <p>
                Porque se existe algo que dominamos, é a arte de transformar histórias<br />
                reais em cinema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Seção de Galeria
function WeddingGallerySection() {
  useScrollAnimation();
  
  return (
    <section className="py-24 bg-[var(--color-bg-2)]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 lg:items-stretch">
            {/* Imagem grande à esquerda */}
            <div className="lg:col-span-3 fade-in">
              <div className="relative aspect-[4/3] w-full h-full overflow-hidden rounded-lg">
                <OptimizedImage
                  src="/images/wedding/galeria-1.webp"
                  alt="Wedding Gallery - Main"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Coluna de 3 imagens à direita */}
            <div className="lg:col-span-1 flex flex-col gap-4 lg:gap-6 h-full" style={{minWidth:0}}>
              <div className="fade-in flex-1 min-h-0">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <OptimizedImage
                    src="/images/wedding/galeria-2.webp"
                    alt="Wedding Gallery - 2"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="fade-in flex-1 min-h-0">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <OptimizedImage
                    src="/images/wedding/galeria-3.webp"
                    alt="Wedding Gallery - 3"
                    width={600}
                    height={800}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="fade-in flex-1 min-h-0">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <OptimizedImage
                    src="/images/wedding/galeria-4.webp"
                    alt="Wedding Gallery - 4"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Seção Filme Documental
function WeddingDocumentarySection() {
  useScrollAnimation();
  
  return (
    <section className="py-24 bg-[var(--color-bg-2)]">
      <div className="container mx-auto px-4">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem à esquerda */}
            <div className="fade-in">
              <div className="relative aspect-[3/4] w-full max-w-lg mx-auto overflow-hidden">
                <OptimizedImage
                  src="/images/wedding/filme-documental.webp"
                  alt="Filme Documental"
                  width={800}
                  height={1066}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>

            {/* Texto à direita */}
            <div className="fade-in space-y-6">
              <h2 className="text-3xl md:text-4xl font-cormorant text-[#3A2F28] leading-tight uppercase tracking-wide">
                Filme Documental
              </h2>
              
              <div className="space-y-4 text-[#3A2F28]/90 font-playfair text-base md:text-lg leading-relaxed">
                <p>
                  O filme documental é para quem deseja sentir o dia como ele realmente foi. 
                  Com as pausas antes da entrada, as risadas espontâneas, os abraços demorados, 
                  as conversas baixas, o som do ambiente, o vento, a música ao fundo e tudo 
                  aquilo que normalmente passa despercebido.
                </p>
                
                <p>
                  <strong>Não se trata apenas de imagens bonitas.</strong><br />
                  Se trata de contexto. De construção. De narrativa.
                </p>
                
                <p>
                  A Alastro nasceu contando histórias reais.<br />
                  Foi no documentário que desenvolvemos nosso olhar, nossa escuta e nossa 
                  forma de organizar emoções em história.
                </p>
                
                <p>
                  Por isso, aqui a história já começa a ganhar forma enquanto ainda está 
                  sendo vivida.
                </p>
                
                <p>
                  Cada cena já é pensada como parte de um todo.<br />
                  Cada instante já carrega a intenção do desfecho.<br />
                  E em um dos momentos mais marcantes da noite,<br />
                  o documentário ganha sua primeira exibição.<br />
                  Diante de todos que fazem parte dessa história.
                </p>
                
                <p>
                  <strong>Não como surpresa.</strong><br />
                  Mas como memória viva.<br />
                  Um momento em que o casal, a família e os amigos revivem o que acabou de 
                  acontecer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Seção de Serviços para Casamentos
function WeddingServicesSection() {
  useScrollAnimation();
  
  const services = [
    {
      icon: Video,
      title: "Filme de Casamento",
      description: "Documentário cinematográfico completo do seu grande dia, com edição profissional, trilha sonora personalizada e narrativa emocionante."
    },
    {
      icon: Camera,
      title: "Fotografia Artística",
      description: "Cobertura fotográfica completa com olhar autoral, capturando cada detalhe e emoção em imagens de alta qualidade."
    },
    {
      icon: Sparkles,
      title: "Save the Date & Teaser",
      description: "Vídeos curtos e impactantes para divulgar seu casamento nas redes sociais ou convidar os padrinhos de forma especial."
    },
    {
      icon: Users,
      title: "Cobertura Completa",
      description: "Equipe completa para registrar todos os momentos: cerimônia, festa, making-of, ensaio e muito mais."
    }
  ];

  return (
    <section id="servicos" className="py-24 bg-[var(--color-bg-2)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="fade-in text-3xl md:text-4xl font-cormorant mb-6 text-foreground uppercase" suppressHydrationWarning>
            Nossos Serviços
          </h2>
          <p className="fade-in text-xl text-foreground max-w-3xl mx-auto font-playfair" suppressHydrationWarning>
            Pacotes completos e personalizados para tornar seu casamento inesquecível
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="fade-in bg-white/50 backdrop-blur-sm border border-gray-300 rounded-2xl p-8 hover:border-[#d4ec8e]/50 transition-all duration-300"
              suppressHydrationWarning
            >
              <service.icon className="w-10 h-10 text-[#9d9279] mb-4" />
              <h3 className="text-2xl font-cormorant text-foreground mb-3 uppercase">{service.title}</h3>
              <p className="text-foreground/80 leading-relaxed font-playfair">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Seção de Depoimentos
function WeddingTestimonialsSection() {
  useScrollAnimation();
  
  const testimonials = [
    {
      names: "Camila & André",
      date: "Casamento em Outubro/2025",
      text: "A equipe da Alastro superou todas as nossas expectativas! O vídeo ficou emocionante, capturaram cada momento especial. Revivemos nosso casamento a cada vez que assistimos.",
      rating: 5
    },
    {
      names: "Beatriz & Thiago",
      date: "Casamento em Junho/2025",
      text: "Profissionalismo impecável! Foram discretos durante a cerimônia mas não perderam nenhum detalhe. O filme ficou cinematográfico, parece um filme de Hollywood! Recomendamos demais.",
      rating: 5
    },
    {
      names: "Fernanda & Rodrigo",
      date: "Casamento em Março/2025",
      text: "Escolhemos a Alastro depois de ver o trabalho deles e não nos arrependemos nem um segundo. Sensíveis, criativos e extremamente profissionais. Nosso álbum e vídeo são obras de arte!",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[var(--color-bg-2)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="fade-in text-3xl md:text-4xl font-cormorant mb-6 text-foreground uppercase" suppressHydrationWarning>
            O Que Dizem os Noivos
          </h2>
          <p className="fade-in text-xl text-foreground max-w-3xl mx-auto font-playfair" suppressHydrationWarning>
            Depoimentos reais de casais que confiaram em nós
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="fade-in bg-white/50 backdrop-blur-sm border border-gray-300 rounded-2xl p-8"
              suppressHydrationWarning
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Heart key={i} className="w-4 h-4 fill-[#9d9279] text-[#9d9279]" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed italic font-playfair">
                "{testimonial.text}"
              </p>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-foreground font-playfair font-semibold">{testimonial.names}</p>
                <p className="text-foreground/60 text-sm font-playfair">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Componentes de Input customizados
interface AppInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  register?: Record<string, unknown>;
  error?: string;
  className?: string;
}

const AppInput = ({
  label, placeholder, type = "text", register, error, className = "", value, onChange, onBlur, ...rest
}: AppInputProps & { value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur?: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full min-w-[200px] relative">
      <label className="block mb-1 text-lg font-bold uppercase text-[var(--color-text-primary)] font-cormorant">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={type}
          className={`relative z-10 border-2 border-white/30 h-12 w-full rounded-md bg-[var(--color-surface)] px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-white/60 placeholder:font-normal text-sm lg:text-base font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)] ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...(value === undefined && register ? register : {})}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, rgba(255,255,255,0.9) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, rgba(255,255,255,0.9) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

const AppTextarea = ({ label, placeholder, register, error, rows = 4 }: {
  label?: string;
  placeholder?: string;
  register?: Record<string, unknown>;
  error?: string;
  rows?: number;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full min-w-[200px] relative">
      {label && (
        <label className="block mb-1 text-lg font-bold uppercase text-[var(--color-text-primary)] font-cormorant">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          rows={rows}
          className={`relative z-10 border-2 border-white/30 w-full rounded-md bg-[var(--color-surface)] px-4 py-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-white/60 placeholder:font-normal text-sm lg:text-base font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)] resize-none`}
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...register}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, rgba(255,255,255,0.9) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, rgba(255,255,255,0.9) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

// Seção de Contato para Casamentos
interface WeddingContactFormData {
  coupleName: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  message: string;
}

function WeddingContactSection() {
  useScrollAnimation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<WeddingContactFormData>({
    mode: "onTouched",
    defaultValues: { phone: "" }
  });

  const { toast } = useToast();
  
  const onSubmit = async (data: WeddingContactFormData) => {
    setIsSubmitting(true);
    
    try {
      await sendEmail({
        name: data.coupleName,
        email: data.email,
        phone: data.phone,
        company: `${data.location} - Data: ${data.date}`,
        message: data.message,
        formType: 'wedding'
      });
      
      reset();
      setPhoneValue("");
      
      toast({
        title: "Recebemos seu contato!",
        description: (
          <span className="flex items-center gap-2">
            <span>Responderemos sua mensagem o mais breve possível</span>
            <CheckCircle2 className="text-green-500 w-5 h-5 ml-2" />
          </span>
        ),
        variant: "default",
        className: "border border-green-400 bg-green-50"
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: (
          <span className="flex items-center gap-2">
            <span>Por favor, tente novamente ou entre em contato diretamente</span>
            <AlertCircle className="text-red-500 w-5 h-5 ml-2" />
          </span>
        ),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const section = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - section.left,
      y: e.clientY - section.top
    });
  };

  function formatPhone(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length <= 10) {
      return value.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, function (_, a, b, c) {
        let out = "";
        if (a) out += `(${a}`;
        if (a && a.length === 2) out += ") ";
        if (b) out += b;
        if (b && b.length === 4 && c) out += "-";
        if (c) out += c;
        return out;
      });
    } else {
      return value.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, function (_, a, b, c) {
        let out = "";
        if (a) out += `(${a}`;
        if (a && a.length === 2) out += ") ";
        if (b) out += b;
        if (b && b.length === 5 && c) out += "-";
        if (c) out += c;
        return out;
      });
    }
  }

  return (
    <section
      id="contato"
      className="min-h-screen flex flex-col md:flex-row-reverse relative overflow-hidden"
    >
      {/* Image - Top on mobile, Right on desktop */}
      <div className="w-full h-[400px] md:w-1/2 md:h-auto relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/wedding/cta-wedding.webp')`
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      {/* Form - Bottom on mobile, Left on desktop */}
      <div 
        className="w-full md:w-1/2 bg-[var(--color-bg)] flex items-center justify-center px-6 py-16 lg:px-10 lg:py-16 relative overflow-hidden"
      >
        <div className="w-full max-w-2xl space-y-8 relative z-20">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="fade-in font-cormorant text-[var(--color-heading)] uppercase leading-tight text-3xl md:text-4xl text-pretty" suppressHydrationWarning>
              <span className="block">Vamos Eternizar</span>
              <span className="block">Sua História de Amor?</span>
            </h2>
            <p className="fade-in text-[var(--color-text-primary)] font-playfair sm:text-lg md:text-xl leading-normal" suppressHydrationWarning>
              Conte-nos sobre seu grande dia. Queremos conhecer cada detalhe, cada sonho, 
              cada emoção que torna seu casamento único e inesquecível.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 font-playfair"
            >
              {/* Row 1: Nome dos Noivos */}
              <AppInput
                label="Nome dos Noivos *"
                placeholder="Ana & João"
                register={register("coupleName", { required: "Nome dos noivos é obrigatório" })}
                error={errors.coupleName?.message}
              />

              {/* Row 2: E-mail + Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput
                  label="E-mail *"
                  placeholder="seu@email.com"
                  type="email"
                  register={register("email", { 
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "E-mail inválido"
                    }
                  })}
                  error={errors.email?.message}
                />

                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Telefone é obrigatório" }}
                  render={({ field, fieldState }) => (
                    <AppInput
                      label="Telefone *"
                      placeholder="(21) 99999-9999"
                      value={phoneValue}
                      onChange={e => {
                        const formatted = formatPhone(e.target.value);
                        setPhoneValue(formatted);
                        field.onChange(formatted);
                      }}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Row 3: Local + Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput
                  label="Local da Cerimônia *"
                  placeholder="Igreja, fazenda, praia..."
                  register={register("location", { required: "Local da cerimônia é obrigatório" })}
                  error={errors.location?.message}
                />

                <AppInput
                  label="Data da Cerimônia *"
                  placeholder="DD/MM/AAAA"
                  type="date"
                  register={register("date", { required: "Data da cerimônia é obrigatória" })}
                  error={errors.date?.message}
                />
              </div>

              {/* Row 4: Mensagem */}

              <AppTextarea
                label="Conte mais sobre seu casamento"
                placeholder="Descreva sua ideia, objetivos e qualquer detalhe que considere importante..."
                rows={4}
                register={register("message", { required: "Mensagem é obrigatória" })}
                error={errors.message?.message}
              />

              <button 
                type="submit"
                disabled={isSubmitting}
                className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-white px-6 py-3 w-full text-sm font-bold text-black uppercase transition-all duration-300 ease-in-out hover:bg-white/90 hover:scale-105 hover:shadow-lg hover:shadow-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm px-2 py-1">
                  {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingPage() {
  // Scroll para a seção quando há hash na URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <WeddingHeroSection />
      <WeddingManifestoSection />
      <WeddingGallerySection />
      <WeddingDocumentarySection />
      <Suspense fallback={<div className="min-h-screen" />}>
        <WeddingServicesSection />
        <WeddingTestimonialsSection />
        <WeddingContactSection />
      </Suspense>
    </div>
  );
}
