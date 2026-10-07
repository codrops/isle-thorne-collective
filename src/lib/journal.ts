/**
 * Reading the journal: stories, newest first.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'journal'>;

/** Every story, newest first. */
export async function getStories(): Promise<Story[]> {
  const stories = await getCollection('journal');
  return stories.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** The story's page. */
export const storyUrl = (story: Story) => `/journal/${story.id}/`;

/** The years with stories, newest first: "2024, 2023". */
export const storyYears = (stories: Story[]) =>
  [...new Set(stories.map((story) => story.data.date.getUTCFullYear()))].join(', ');
