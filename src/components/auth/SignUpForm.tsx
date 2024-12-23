import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '../ui/use-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signUp(email, password, username);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "注册失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
          placeholder="邮箱地址"
          required
        />
      </div>
      <div className="space-y-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
          placeholder="用户名"
          required
        />
      </div>
      <div className="space-y-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky"
          placeholder="密码"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-mars-sky hover:bg-mars-sky/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? '注册中...' : '注册'}
      </Button>
    </form>
  );
}