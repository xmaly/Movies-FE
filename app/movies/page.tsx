"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { MovieService } from "@/api-client";
import type { MovieItem } from "@/api-client";
import { MoviesTable } from "@/app/components/MoviesTable";
import { MovieForm } from "@/app/components/MovieForm";

export default function MoviesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<MovieItem | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MovieService.getApiMovie();
      setMovies(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load movies";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadMovies();
    }
  }, [status, loadMovies]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleAddMovie = async (movie: MovieItem) => {
    if (editingMovie) {
      // Update existing movie in the table
      setMovies(movies.map((m) => (m.id === movie.id ? movie : m)));
    } else {
      // Add new movie to the table
      setMovies([...movies, movie]);
    }
    setShowForm(false);
  };

  const handleDeleteMovie = async (id: number) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      setError(null);
      await MovieService.deleteApiMovie(id);
      setMovies(movies.filter((m) => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete movie";
      setError(message);
    }
  };

  const handleEditMovie = (movie: MovieItem) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMovie(undefined);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#8fcf3c] mb-2">Movies</h1>
        <p className="text-gray-400 mb-8">Manage your movie collection</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-6 py-2 bg-[#8fcf3c] text-[#151a16] rounded-lg font-semibold hover:bg-[#a6ff4d] transition"
          >
            + Add Movie
          </button>
        )}

        {showForm && (
          <MovieForm
            movie={editingMovie}
            onSubmit={handleAddMovie}
            onCancel={handleCancelForm}
          />
        )}

        <div className="bg-[#1a211a] rounded-xl border border-[#8fcf3c]/20 overflow-hidden">
          <MoviesTable
            movies={movies}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
