import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface ResearchProposal {
  id: string;
  title: string;
  description: string;
  required_funding: number;
  current_funding: number;
  end_time: string;
}

// 模拟数据
const mockProposals: ResearchProposal[] = [
  {
    id: '1',
    title: '火星温室农业系统研发',
    description: '开发适应火星环境的智能温室系统，实现可持续食物生产。',
    required_funding: 5000,
    current_funding: 3200,
    end_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: '火星地下水资源勘探',
    description: '利用先进探测技术寻找和评估火星地下水资源。',
    required_funding: 8000,
    current_funding: 2500,
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function ResearchList() {
  const navigate = useNavigate();
  const proposals = mockProposals;
  
  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const progress = (proposal.current_funding / proposal.required_funding) * 100;
        
        return (
          <Card 
            key={proposal.id}
            className="cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => navigate(`/research/${proposal.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{proposal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground line-clamp-2">
                {proposal.description}
              </p>
              <div className="space-y-2">
                <Progress value={progress} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>已筹集: {proposal.current_funding} MARS</span>
                  <span>目标: {proposal.required_funding} MARS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}