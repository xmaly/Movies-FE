"use client";

import { useState, useEffect } from "react";
import { MovieService } from "@/api-client";
import type { MovieItem } from "@/api-client";

type MoviesTableProps = {
  movies: MovieItem[];
  onEdit: (movie: MovieItem) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
};

export function MoviesTable({ movies, onEdit, onDelete, isLoading }: MoviesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-400">Loading movies...</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No movies found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#8fcf3c]/30 bg-[#0d1208]">
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Director</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Year</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Rating</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Description</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#8fcf3c]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr
              key={movie.id}
              className="border-b border-[#8fcf3c]/10 hover:bg-[#1a211a]/50 transition"
            >
              <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
              <td className="px-6 py-4 text-gray-300">{movie.director}</td>
              <td className="px-6 py-4 text-gray-300">{movie.year || "N/A"}</td>
              <td className="px-6 py-4 text-gray-300">
                {(movie as any).rating ? `${(movie as any).rating}/10` : "—"}
              </td>
              <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                {movie.description || "N/A"}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(movie)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(movie.id!)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
