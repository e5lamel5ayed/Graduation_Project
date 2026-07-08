/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adventureService } from '@/src/services/adventureService';
import { AdventureStory } from '@/src/types/adventure';
import { ArrowLeft, Volume2, Loader, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const adventureId = params.adventureId as string;

  const [story, setStory] = useState<AdventureStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'days' | 'outro'>('intro');
  const [selectedDay, setSelectedDay] = useState(1);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      try {
        setIsLoading(true);
        const storyData = await adventureService.getStory(adventureId);
        setStory(storyData);
      } catch (error) {
        console.error('Failed to load story:', error);
        toast.error('Failed to load adventure story');
      } finally {
        setIsLoading(false);
      }
    };

    if (adventureId) {
      loadStory();
    }
  }, [adventureId]);

  const handleRegenerateStory = async () => {
    try {
      setIsRegenerating(true);
      await adventureService.generateStory(adventureId);
      toast.success('Story regenerated! Story voice is being generated...');
    } catch (error) {
      console.error('Failed to regenerate story:', error);
      toast.error('Failed to regenerate story');
    } finally {
      setIsRegenerating(false);
    }
  };

  const playVoice = (voiceUrl?: string, voiceId?: string) => {
    if (!voiceUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      audioRef.current = null;
      return;
    }

    const audio = new Audio(voiceUrl);
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      toast.error('Failed to play audio');
    });

    audioRef.current = audio;
    setPlayingVoiceId(voiceId || null);
    audio.onended = () => {
      setPlayingVoiceId(null);
      audioRef.current = null;
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading adventure story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Story not found</p>
          <Link href="/adventures" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Back to Adventures
          </Link>
        </div>
      </div>
    );
  }

  const currentDay = story.days.find(d => d.dayNumber === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1 text-center">{story.title}</h1>
          <button
            onClick={handleRegenerateStory}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            {['intro', 'days', 'outro'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  if (tab === 'days') setSelectedDay(1);
                }}
                className={`px-6 py-4 font-bold text-sm uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                {tab === 'intro' && 'Beginning'}
                {tab === 'days' && `Journey (${story.days.length} Days)`}
                {tab === 'outro' && 'Ending'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Intro Section */}
        {activeTab === 'intro' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
                <h2 className="text-4xl font-bold mb-2">{story.intro.title}</h2>
                <p className="text-purple-100">The beginning of the adventure</p>
              </div>
              <div className="p-8">
                <p className="text-lg leading-relaxed text-gray-700 mb-6 whitespace-pre-wrap">
                  {story.intro.story}
                </p>
                {story.intro.voiceUrl && (
                  <button
                    onClick={() => playVoice(story.intro.voiceUrl, 'intro')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all ${playingVoiceId === 'intro'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                  >
                    <Volume2 className="h-5 w-5" />
                    {playingVoiceId === 'intro' ? 'Playing...' : 'Listen to Story'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Days Section */}
        {activeTab === 'days' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wide">Select Day</h3>
                <div className="space-y-2">
                  {story.days.map(day => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setSelectedDay(day.dayNumber)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${selectedDay === day.dayNumber
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    >
                      Day {day.dayNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {currentDay && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-white">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                        {currentDay.dayNumber}
                      </div>
                      <h2 className="text-3xl font-bold">{currentDay.title}</h2>
                    </div>
                    <p className="text-blue-100">Day {currentDay.dayNumber} of the Adventure</p>
                  </div>
                  <div className="p-8">
                    <p className="text-lg leading-relaxed text-gray-700 mb-6 whitespace-pre-wrap">
                      {currentDay.story}
                    </p>
                    {currentDay.voiceUrl && (
                      <button
                        onClick={() => playVoice(currentDay.voiceUrl, `day-${currentDay.dayNumber}`)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all ${playingVoiceId === `day-${currentDay.dayNumber}`
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                      >
                        <Volume2 className="h-5 w-5" />
                        {playingVoiceId === `day-${currentDay.dayNumber}` ? 'Playing...' : 'Listen to Story'}
                      </button>
                    )}
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-blue-600">Task ID:</span> {currentDay.adventureTaskId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Outro Section */}
        {activeTab === 'outro' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
                <h2 className="text-4xl font-bold mb-2">{story.outro.title}</h2>
                <p className="text-emerald-100">The conclusion of the adventure</p>
              </div>
              <div className="p-8">
                <p className="text-lg leading-relaxed text-gray-700 mb-6 whitespace-pre-wrap">
                  {story.outro.story}
                </p>
                {story.outro.voiceUrl && (
                  <button
                    onClick={() => playVoice(story.outro.voiceUrl, 'outro')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all ${playingVoiceId === 'outro'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                  >
                    <Volume2 className="h-5 w-5" />
                    {playingVoiceId === 'outro' ? 'Playing...' : 'Listen to Story'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}