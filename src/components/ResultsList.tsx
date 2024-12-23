import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { ChatBubbleLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const ResultsList = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-lg">火星土壤肥力提升研究报告</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            通过引入特定微生物和有机物质，我们成功提高了火星土壤的养分含量...
          </p>
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>32 评论</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpIcon className="w-4 h-4" />
            <span>128 赞同</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsList;