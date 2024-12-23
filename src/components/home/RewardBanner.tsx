import React from 'react';
import { Card } from '../ui/card';
import { GiftIcon } from '@heroicons/react/24/outline';

export function RewardBanner() {
  return (
    <Card className="bg-gradient-to-r from-mars-surface/20 to-mars-sky/20 border-none">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GiftIcon className="h-8 w-8 text-mars-sky" />
          <div>
            <h3 className="text-lg font-semibold">提出问题即可获得奖励</h3>
            <p className="text-muted-foreground">
              每个问题可获得 10 MARS 代币奖励，参与讨论还可以赢取更多奖励！
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}