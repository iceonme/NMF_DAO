import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const VoteList = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-lg">火星基地选址方案投票</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>方案A: 火星赤道</span>
              <span>64%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-mars-sky h-2 rounded-full" style={{ width: '64%' }}></div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-4 h-4" />
            <span>156 已投票</span>
          </div>
          <span>剩余 2 天</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoteList;