-- Vídeo curto exibido no lugar da capa quando o card do case recebe hover.
-- Dois formatos: o navegador usa o webm e cai para o mp4 (Safari antigo).
alter table public.cases
  add column if not exists hover_video_webm_url text,
  add column if not exists hover_video_mp4_url text;

-- Substitui a versão anterior, que guardava um GIF.
alter table public.cases drop column if exists hover_gif_url;
