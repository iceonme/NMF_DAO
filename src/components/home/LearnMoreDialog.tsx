import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentTextIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export function LearnMoreDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">了解更多</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>了解更多</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          >
            <DocumentTextIcon className="w-6 h-6 text-mars-sky" />
            <div>
              <h3 className="font-medium">火星殖民地 DAO 白皮书</h3>
              <p className="text-sm text-muted-foreground">
                下载完整的项目白皮书，了解详细规划
              </p>
            </div>
          </a>

          <a
            href="https://metatron.feishu.cn/wiki/W9FZwnbMNi5DlLk4rcMcHAGanjd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          >
            <BookOpenIcon className="w-6 h-6 text-mars-sky" />
            <div>
              <h3 className="font-medium">在线文档</h3>
              <p className="text-sm text-muted-foreground">
                查看详细的技术文档和使用指南
              </p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}