import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Instagram, Linkedin, Facebook } from "lucide-react";

interface AppInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  register?: any;
  error?: string;
  className?: string;
}

const AppInput = ({ label, placeholder, type = "text", register, error, className = "" }: AppInputProps) => {
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
        <label className="block mb-2 text-sm text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={type}
          className={`peer relative z-10 border-2 border-[var(--color-border)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] ${className}`}
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
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

const AppTextarea = ({ label, placeholder, register, error, rows = 4 }: any) => {
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
        <label className="block mb-2 text-sm text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          rows={rows}
          className="peer relative z-10 border-2 border-[var(--color-border)] w-full rounded-md bg-[var(--color-surface)] px-4 py-3 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] resize-none"
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
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    reset();
    setIsSubmitting(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const socialIcons = [
    {
      icon: <Instagram className="w-5 h-5" />,
      href: '#',
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: '#',
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: '#',
    }
  ];

  return (
    <section id="contato" className="min-h-screen flex">
      {/* Left side - Form */}
      <div 
        className="flex-1 bg-[var(--color-bg)] flex items-center justify-center p-8 lg:p-16 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-full blur-3xl transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-heading)]">
              Vamos construir algo incrível juntos?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm lg:text-base leading-relaxed">
              Toda grande história começa com uma conversa. Estamos ansiosos para conhecer seus
              sonhos e descobrir como podemos fazer parte da sua jornada.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-12 h-12 bg-[var(--color-surface)] rounded-full flex justify-center items-center relative z-[1] border-2 border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent-green)] transition-colors duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-[var(--color-accent-green)]/10 scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100" />
                <span className="text-[var(--color-text-primary)] transition-all duration-500 ease-in-out z-[2] group-hover:text-[var(--color-accent-green)]">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          <div className="text-center text-sm text-[var(--color-text-secondary)]">
            ou use nosso formulário
          </div>

          {/* Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[var(--color-heading)] text-center">
              Conte-nos sobre seu projeto
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AppInput
                label="Nome"
                placeholder="Seu nome"
                register={register("name", { required: "Nome é obrigatório" })}
                error={errors.name?.message}
              />

              <AppInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                register={register("email", { 
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                error={errors.email?.message}
              />

              <AppInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                register={register("phone")}
              />

              <AppInput
                label="Empresa/Projeto"
                placeholder="Nome da empresa ou projeto"
                register={register("company")}
              />

              <div className="space-y-2">
                <label className="block text-sm text-[var(--color-text-primary)]">Tipo de serviço</label>
                <Select onValueChange={(value) => setValue("service", value)}>
                  <SelectTrigger className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--color-surface)] border-[var(--color-border)]">
                    <SelectItem value="website" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">Website</SelectItem>
                    <SelectItem value="ecommerce" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">E-commerce</SelectItem>
                    <SelectItem value="app" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">Aplicativo</SelectItem>
                    <SelectItem value="branding" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">Branding</SelectItem>
                    <SelectItem value="consultoria" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">Consultoria</SelectItem>
                    <SelectItem value="outro" className="text-[var(--color-text-primary)] hover:bg-[var(--color-muted-surface)]">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AppTextarea
                label="Conte-nos mais sobre sua ideia"
                placeholder="Descreva seu projeto, objetivos e qualquer detalhe que considere importante..."
                rows={4}
                register={register("message", { required: "Mensagem é obrigatória" })}
                error={errors.message?.message}
              />

              <button 
                type="submit"
                disabled={isSubmitting}
                className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-accent-green)] px-6 py-3 w-full text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-accent-green)]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm px-2 py-1">
                  {isSubmitting ? "Enviando..." : "Iniciar conversa"}
                </span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white space-y-4 max-w-md">
            <h3 className="text-2xl font-bold">Prontos para inovar?</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Cada pixel, cada linha de código, cada decisão de design é pensada 
              para criar experiências que conectam pessoas e transformam negócios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;