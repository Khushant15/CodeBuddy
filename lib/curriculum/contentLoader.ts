// lib/curriculum/contentLoader.ts
// Service for loading curriculum content from JSON files

import type { Curriculum, Lesson, Exercise, Track } from './types';

/**
 * Content Loader Service
 * 
 * Loads curriculum modules from JSON files.
 * In production, this could be extended to:
 * - Cache content in memory
 * - Fetch from a CDN
 * - Load from Firestore for dynamic content
 * - Support lazy loading of lessons
 */

class ContentLoader {
  private cache: Map<string, Curriculum> = new Map();
  
  /**
   * Load a specific module by ID
   * @param moduleId - The module identifier (e.g., "python-module-01-fundamentals")
   * @returns Promise<Curriculum>
   */
  async loadModule(moduleId: string, track?: string): Promise<Curriculum> {
    // Check cache first
    if (this.cache.has(moduleId)) {
      return this.cache.get(moduleId)!;
    }
    
    try {
      // In Next.js, place JSON files in /public/curriculum/
      // Use track prefix if provided
      const path = track ? `/curriculum/${track}/${moduleId}.json` : `/curriculum/${moduleId}.json`;
      const response = await fetch(path);
      
      if (!response.ok) {
        // Fallback to root just in case
        const rootResponse = await fetch(`/curriculum/${moduleId}.json`);
        if (!rootResponse.ok) {
          throw new Error(`Failed to load module: ${moduleId}`);
        }
        return await rootResponse.json();
      }
      
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error(`Module file is empty: ${moduleId}`);
      }

      let data: Curriculum;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Failed to parse module ${moduleId}: Invalid JSON`);
      }
      
      // Validate structure (basic check)
      if (!data.id || !data.lessons || !Array.isArray(data.lessons)) {
        throw new Error(`Invalid module structure: ${moduleId}`);
      }
      
      // Cache it
      this.cache.set(moduleId, data);
      
      return data;
    } catch (error) {
      console.error(`Error loading module ${moduleId}:`, error);
      throw error;
    }
  }
  
  /**
   * Load all modules for a specific track
   * @param track - The learning track (python, html, css, etc.)
   * @returns Promise<Curriculum[]>
   */
  async loadTrackModules(track: Track): Promise<Curriculum[]> {
    try {
      // First, load the track index
      const indexResponse = await fetch(`/curriculum/${track}/index.json`);
      
      if (!indexResponse.ok) {
        throw new Error(`Failed to load ${track} track index`);
      }
      
      const text = await indexResponse.text();
      if (!text || text.trim() === '') {
        throw new Error(`${track} track index is empty`);
      }

      let index: { modules: string[] };
      try {
        index = JSON.parse(text);
      } catch (e) {
        throw new Error(`Failed to parse ${track} track index: Invalid JSON`);
      }
      
      if (!index.modules || !Array.isArray(index.modules)) {
        throw new Error(`Invalid index format for ${track} track: missing modules array`);
      }
      
      // Load all modules in parallel
      const modulePromises = index.modules.map(moduleId => 
        this.loadModule(moduleId, track)
      );
      
      const modules = await Promise.all(modulePromises);
      
      // Sort by order
      return modules.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error(`Error loading track ${track}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a specific lesson from a module
   * @param moduleId - Module identifier
   * @param lessonId - Lesson identifier
   * @returns Promise<Lesson | null>
   */
  async getLesson(moduleId: string, lessonId: string): Promise<Lesson | null> {
    try {
      const module = await this.loadModule(moduleId);
      const lesson = module.lessons.find(l => l.id === lessonId);
      return lesson || null;
    } catch (error) {
      console.error(`Error getting lesson ${lessonId}:`, error);
      return null;
    }
  }
  
  /**
   * Get exercises for a specific lesson
   * @param moduleId - Module identifier
   * @param lessonId - Lesson identifier
   * @returns Promise<Exercise[]>
   */
  async getLessonExercises(moduleId: string, lessonId: string): Promise<Exercise[]> {
    try {
      const lesson = await this.getLesson(moduleId, lessonId);
      return lesson?.exercises || [];
    } catch (error) {
      console.error(`Error getting exercises for ${lessonId}:`, error);
      return [];
    }
  }
  
  /**
   * Search lessons by tag
   * @param track - The track to search in
   * @param tag - Tag to search for
   * @returns Promise<Lesson[]>
   */
  async searchByTag(track: Track, tag: string): Promise<Lesson[]> {
    try {
      const modules = await this.loadTrackModules(track);
      const allLessons = modules.flatMap(m => m.lessons);
      return allLessons.filter(lesson => 
        lesson.tags.includes(tag)
      );
    } catch (error) {
      console.error(`Error searching by tag ${tag}:`, error);
      return [];
    }
  }
  
  /**
   * Get lessons by difficulty
   * @param track - The track
   * @param difficulty - Difficulty level
   * @returns Promise<Lesson[]>
   */
  async getLessonsByDifficulty(
    track: Track, 
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Lesson[]> {
    try {
      const modules = await this.loadTrackModules(track);
      const allLessons = modules.flatMap(m => m.lessons);
      return allLessons.filter(lesson => lesson.difficulty === difficulty);
    } catch (error) {
      console.error(`Error getting ${difficulty} lessons:`, error);
      return [];
    }
  }
  
  /**
   * Clear the cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Preload all modules for a track (for offline/performance)
   * @param track - Track to preload
   */
  async preloadTrack(track: Track): Promise<void> {
    try {
      await this.loadTrackModules(track);
      console.log(`${track} track preloaded`);
    } catch (error) {
      console.error(`Error preloading ${track}:`, error);
    }
  }
}

// Singleton instance
export const contentLoader = new ContentLoader();

// Helper functions for easy imports
export async function getModule(moduleId: string, track?: string) {
  return contentLoader.loadModule(moduleId, track);
}

export async function getTrack(track: Track) {
  return contentLoader.loadTrackModules(track);
}

export async function getLesson(moduleId: string, lessonId: string) {
  return contentLoader.getLesson(moduleId, lessonId);
}

export async function searchLessons(track: Track, tag: string) {
  return contentLoader.searchByTag(track, tag);
}
