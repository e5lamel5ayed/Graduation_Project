import { Adventure } from '@/src/types/adventure';

export const DUMMY_ADVENTURES: Adventure[] = [
  {
    id: '1',
    title: 'Space Explorer Challenge',
    description: 'A 7-day journey through the solar system with daily space-themed tasks.',
    days: 7,
    taskCount: 7,
    goal: 'Learn about planets and stars',
    createdAt: '2024-02-01',
    category: 'Science',
  },
  {
    id: '2',
    title: 'Daily Kindness Marathon',
    description: 'Encourage kids to perform one act of kindness every day for a week.',
    days: 7,
    taskCount: 5,
    goal: 'Build empathy and social skills',
    createdAt: '2024-02-02',
    category: 'Social',
  },
  {
    id: '3',
    title: 'Math Master Adventure',
    description: 'Sharpen mental math skills with fun daily challenges and rewards.',
    days: 7,
    taskCount: 7,
    goal: 'Improve mental calculation speed',
    createdAt: '2024-01-28',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Healthy Habits Quest',
    description: 'Learn about nutrition and exercise through interactive daily goals.',
    days: 7,
    taskCount: 4,
    goal: 'Establish healthy eating routines',
    createdAt: '2024-02-03',
    category: 'Health',
  },
];
