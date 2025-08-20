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
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    reset();
    setIsSubmitting(false);
  };

  return (
    <section id="contato" className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-background flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Vamos construir algo incrível juntos?
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Toda grande história começa com uma conversa. Estamos ansiosos para conhecer seus
              sonhos e descobrir como podemos fazer parte da sua jornada.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
              <Instagram className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
              <Linkedin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
              <Facebook className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            ou use nosso formulário
          </div>

          {/* Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground text-center">
              Conte-nos sobre seu projeto
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  {...register("name", { required: "Nome é obrigatório" })}
                  className="bg-muted/30 border-border"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email", { 
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                  className="bg-muted/30 border-border"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  {...register("phone")}
                  className="bg-muted/30 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa/Projeto</Label>
                <Input
                  id="company"
                  placeholder="Nome da empresa ou projeto"
                  {...register("company")}
                  className="bg-muted/30 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Tipo de serviço</Label>
                <Select onValueChange={(value) => setValue("service", value)}>
                  <SelectTrigger className="bg-muted/30 border-border">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="app">Aplicativo</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Conte-nos mais sobre sua ideia</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva seu projeto, objetivos e qualquer detalhe que considere importante..."
                  rows={4}
                  {...register("message", { required: "Mensagem é obrigatória" })}
                  className="bg-muted/30 border-border resize-none"
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Iniciar conversa"}
              </Button>
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