import React from 'react';
import { Hero } from '../components/home/Hero';
import { RewardBanner } from '../components/home/RewardBanner';
import { QuestionList } from '../components/questions/QuestionList';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Reward Banner */}
        <RewardBanner />

        {/* <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">探索问题</h2>
        </div> */}

        {/* Question List */}
        <QuestionList />
      </div>
    </div>
  );
};

export default Home;