"use client";

import { useState } from "react";
import type { MovieItem } from "@/api-client";
import { MovieService } from "@/api-client";

type MovieFormProps = {
  movie?: MovieItem;
  onSubmit: (movie: MovieItem) => void;
  onCancel: () => void;
};

export function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [title, setTitle] = useState(movie?.title || "");
  const [director, setDirector] = useState(movie?.director || "");
  const [year, setYear] = useState(movie?.year?.toString() || "");
  const [description, setDescription] = useState(movie?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        director,
        year: year ? parseInt(year) : undefined,
        description,
      };

      let result;
      if (movie?.id) {
        // Update existing movie
        await MovieService.putApiMovie(movie.id, payload);
        result = { ...movie, ...payload };
      } else {
        // Create new movie
        result = await MovieService.postApiMovie(payload);
        onSubmit(result);
      }

      setTitle("");
      setDirector("");
      setYear("");
      setDescription("");
      onCancel(); // Close the form after successful submission
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save movie";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a211a] rounded-xl p-6 border border-[#8fcf3c]/20 mb-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Movie title"
            className="w-full px-4 py-2 bg-[#151a16] border border-[#8fcf3c]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            placeholder="Director name"
            className="w-full px-4 py-2 bg-[#151a16] border border-[#8fcf3c]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Release year"
            className="w-full px-4 py-2 bg-[#151a16] border border-[#8fcf3c]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Movie description"
            rows={4}
            className="w-full px-4 py-2 bg-[#151a16] border border-[#8fcf3c]/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-[#8fcf3c] text-[#151a16] rounded-lg font-semibold hover:bg-[#a6ff4d] transition disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
