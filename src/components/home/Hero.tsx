import React from 'react';
import { RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { LearnMoreDialog } from './LearnMoreDialog';
import { AskQuestionButton } from './AskQuestionButton';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-mars-night py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mars-surface/20 via-transparent to-mars-sky/20" />
      
      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <RocketLaunchIcon className="mx-auto h-16 w-16 text-mars-sky" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          火星殖民地 DAO
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          共同探索火星殖民的未来，通过去中心化自治组织，
          让每个人都能参与火星开发的重大决策。
        </p>
        <div className="mt-4 flex items-center justify-center text-mars-sky">
          <SparklesIcon className="h-5 w-5 mr-2" />
          <span>提出问题即可获得 10 MARS 代币奖励！，成为正式问题，可获得1000MARS</span>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6">
          <AskQuestionButton />
          <LearnMoreDialog />
        </div>
      </div>
    </div>
  );
}