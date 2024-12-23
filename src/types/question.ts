export type QuestionStatus = 'pending' | 'claimed' | 'researching' | 'voting' | 'closed';

export interface Question {
  id: string;
  title: string;
  content: string;
  author_id: string;
  status: QuestionStatus;
  is_quality: boolean;
  discussion_count: number;
  researcher_count: number;
  vote_count: number;
  share_count: number;
  created_at: string;
  is_pending: boolean;
}

export const QuestionStatusConfig = {
  pending: {
    label: '认领中',
    color: 'text-yellow-500',
  },
  claimed: {
    label: '已认领',
    color: 'text-blue-500',
  },
  researching: {
    label: '研究中',
    color: 'text-mars-sky',
  },
  voting: {
    label: '答案投票中',
    color: 'text-green-500',
  },
  closed: {
    label: '已解决',
    color: 'text-gray-500',
  },
} as const;