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
      <h1 className="text-3xl font-bold mb-2">Legg til ny film</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Del en film du vil at andre skal oppdage
      </p>

      <MovieForm />
    </div>
  );
}
