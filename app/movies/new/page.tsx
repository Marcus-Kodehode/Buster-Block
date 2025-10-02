import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MovieForm from "@/components/MovieForm";
import { Film, Sparkles } from "lucide-react";

export default async function NewMoviePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 relative">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#6c47ff]/10 rounded-full blur-3xl" />
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent pb-2 flex items-center gap-3">
            <Film className="w-10 h-10 text-[#6c47ff]" />
            Legg til ny film
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2 mt-2">
            <Sparkles className="w-5 h-5 text-[#06b6d4]" />
            Del en film du vil at andre skal oppdage
          </p>
        </div>
      </div>

      <MovieForm />
    </div>
  );
}
