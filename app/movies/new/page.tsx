import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MovieForm from "@/components/MovieForm";

export default async function NewMoviePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
          Legg til ny film
        </h1>
        <p className="text-gray-400 text-lg">
          Del en film du vil at andre skal oppdage
        </p>
      </div>

      <MovieForm />
    </div>
  );
}
