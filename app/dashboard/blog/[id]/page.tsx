import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/dashboard/PostForm";
import { POST_WITH_RELATIONS_SELECT, withRelations } from "@/types/blog";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return <PostForm record={withRelations(data)} />;
}
