"use client";

const WHATSAPP_NUMBER = "5521966235882";

interface FloatingWhatsAppProps {
  message: string;
}

const FloatingWhatsApp = ({ message }: FloatingWhatsAppProps) => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-500 ease-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.463 3.485 1.343 5.003l-1.428 5.216 5.339-1.401a9.958 9.958 0 004.743 1.208h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.181-2.929-7.07a9.93 9.93 0 00-7.072-2.956zm0 18.164h-.003a8.13 8.13 0 01-4.144-1.135l-.297-.176-3.167.831.845-3.088-.194-.317a8.14 8.14 0 01-1.24-4.297c0-4.514 3.674-8.188 8.194-8.188a8.14 8.14 0 015.795 2.404 8.135 8.135 0 012.399 5.79c0 4.514-3.674 8.176-8.188 8.176z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
