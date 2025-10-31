import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
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
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";

interface AppInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  register?: any;
  error?: string;
  className?: string;
  touched?: boolean;
}

const AppInput = ({
  label, placeholder, type = "text", register, error, className = "", value, onChange, onBlur, ...rest
}: AppInputProps & { value?: string, onChange?: any, onBlur?: any }) => {
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
      <label className="block mb-1 text-xs font-bold text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={type}
          className={`relative z-10 border-2 border-[var(--color-border-form)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-normal text-sm lg:text-base font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)] ${className}`}
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
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

const AppTextarea = ({ label, placeholder, register, error, rows = 4, touched }: any) => {
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
        <label className="block mb-1 text-xs font-bold text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          rows={rows}
          className="relative z-10 border-2 border-[var(--color-border-form)] w-full rounded-md bg-[var(--color-surface)] px-4 py-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-normal text-sm lg:text-base font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)] resize-none"
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
      {error && touched && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  portfolio: string;
  message: string;
}

const TrabalheConoscoPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const { register, handleSubmit, reset, setValue, control, formState: { errors, touchedFields } } = useForm<CandidateFormData>({
    mode: "onTouched",
    defaultValues: { phone: "" }
  });

  const navItems = [
    { name: "SOBRE NÓS", link: "/#sobre" },
    { name: "PORTFÓLIO", link: "/#portfolio" },
    { name: "CONTATO", link: "/#contato" },
  ];

  const { toast } = useToast();
  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Candidate data:", data);
    reset();
    setPhoneValue("");
    setIsSubmitting(false);
    toast({
      title: "Candidatura enviada com sucesso!",
      description: (
        <span className="flex items-center gap-2">
          <span>Analisaremos seu perfil e entraremos em contato em breve</span>
          <CheckCircle2 className="text-green-500 w-5 h-5 ml-2" />
        </span>
      ),
      variant: "default",
      className: "border border-green-400 bg-green-50"
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const section = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - section.left,
      y: e.clientY - section.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  function formatPhone(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length <= 10) {
      // (99) 9999-9999
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
      // (99) 99999-9999
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
    <div className="min-h-screen bg-background">
      <FloatingNav navItems={navItems} />
      
      <section
        className="min-h-screen flex flex-col md:flex-row-reverse relative overflow-hidden pt-16"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image - Top on mobile, Right on desktop */}
        <div className="w-full h-[400px] md:w-1/2 md:h-auto relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/time-alastro.jpg')`
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Form - Bottom on mobile, Left on desktop */}
        <div 
          className="w-full md:w-1/2 bg-[var(--color-bg)] flex items-center justify-center px-4 py-16 lg:px-4 lg:py-16 relative overflow-hidden"
        >
          {/* Gradiente só no form */}
          <div
            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 236, 142, 0.20) 0%, transparent 90%)`,
              transition: 'opacity 0.2s'
            }}
          />
          <div className="w-full max-w-md space-y-8 relative z-20">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl lg:text-4xl font-amplitude font-bold text-[var(--color-heading)]">
                Trabalhe Conosco
              </h1>
              <p className="text-[var(--color-text-primary)] font-amplitude sm:text-lg md:text-xl leading-normal">
                Faça parte do nosso time! Estamos sempre em busca de talentos criativos e 
                apaixonados por audiovisual para criar histórias incríveis juntos.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 font-amplitude"
              >
                <AppInput
                  label="Nome completo *"
                  placeholder="Digite seu nome completo"
                  register={register("name", { required: "Nome é obrigatório" })}
                  error={errors.name?.message}
                  touched={touchedFields.name}
                />

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
                      touched={fieldState.isTouched}
                    />
                  )}
                />

                <Controller
                  name="position"
                  control={control}
                  rules={{ required: "Posição é obrigatória" }}
                  render={({ field, fieldState }) => (
                    <div className="w-full min-w-[200px] relative">
                      <label className="block mb-1 text-xs font-bold text-[var(--color-text-primary)]">
                        Área de interesse *
                      </label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-12 border-2 border-[var(--color-border-form)] bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                          <SelectValue placeholder="Selecione a área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diretor">Direção</SelectItem>
                          <SelectItem value="cinematografia">Cinematografia</SelectItem>
                          <SelectItem value="edicao">Edição</SelectItem>
                          <SelectItem value="som">Som/Áudio</SelectItem>
                          <SelectItem value="producao">Produção</SelectItem>
                          <SelectItem value="pos-producao">Pós-produção</SelectItem>
                          <SelectItem value="motion">Motion Graphics</SelectItem>
                          <SelectItem value="fotografia">Fotografia</SelectItem>
                          <SelectItem value="assistente">Assistente</SelectItem>
                          <SelectItem value="estagio">Estágio</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-red-400 mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                <AppInput
                  label="Experiência (anos)"
                  placeholder="Ex: 2 anos, Iniciante, etc."
                  register={register("experience")}
                  error={errors.experience?.message}
                  touched={touchedFields.experience}
                />

                <AppInput
                  label="Portfolio/Website/Reel"
                  placeholder="Link para seu portfolio ou trabalhos"
                  register={register("portfolio")}
                  error={errors.portfolio?.message}
                  touched={touchedFields.portfolio}
                />

                <AppTextarea
                  label="Conte sobre você e sua paixão pelo audiovisual *"
                  placeholder="Fale sobre sua experiência, objetivos e por que gostaria de trabalhar conosco..."
                  rows={4}
                  register={register("message", { required: "Mensagem é obrigatória" })}
                  error={errors.message?.message}
                  touched={touchedFields.message}
                />

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-accent-green)] px-6 py-3 w-full text-sm font-bold text-[var(--color-text-secondary)] uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-accent-green)]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm px-2 py-1">
                    {isSubmitting ? "ENVIANDO CANDIDATURA..." : "ENVIAR CANDIDATURA"}
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

      <Footer />
    </div>
  );
};

export default TrabalheConoscoPage;
