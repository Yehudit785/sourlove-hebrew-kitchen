import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, Reply, Link, Image, Smile, AtSign } from "lucide-react";

interface Comment {
  id: string;
  userName: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}

const initialComments: Comment[] = [
  {
    id: "1",
    userName: "Ziyech",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    timestamp: "1 hour ago",
    content: "This recipe brings back nostalgic family dinner vibes, but I'm a bit bothered by the amount of salt. It doesn't fit well compared to the more balanced flavors elsewhere.",
    likes: 12,
    dislikes: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: "2",
    userName: "Shakira",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    timestamp: "23 minutes ago",
    content: "Totally agree about the salt. If the amount were reduced or had slightly different seasonings, it'd taste much more natural.",
    likes: 8,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: "3",
    userName: "Ryan Timber",
    avatar: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    timestamp: "15 minutes ago",
    content: "About the salt, maybe it's intentional to stay consistent with traditional recipes. But yeah, a reduced amount would probably blend better with the natural flavors.",
    likes: 5,
    dislikes: 1,
    isLiked: false,
    isDisliked: false,
  },
];

interface CommentsSectionProps {
  recipeId?: string;
}

export function CommentsSection({ recipeId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        if (comment.isLiked) {
          return { ...comment, likes: comment.likes - 1, isLiked: false };
        } else {
          return {
            ...comment,
            likes: comment.likes + 1,
            isLiked: true,
            dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes,
            isDisliked: false,
          };
        }
      }
      return comment;
    }));
  };

  const handleDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        if (comment.isDisliked) {
          return { ...comment, dislikes: comment.dislikes - 1, isDisliked: false };
        } else {
          return {
            ...comment,
            dislikes: comment.dislikes + 1,
            isDisliked: true,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes,
            isLiked: false,
          };
        }
      }
      return comment;
    }));
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userName: "You",
        avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        timestamp: "now",
        content: newComment,
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false,
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">תגובות</h3>
            <Badge variant="secondary" className="rounded-full">
              {comments.length}
            </Badge>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Input Area */}
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" />
            <AvatarFallback>YU</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your mind..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none bg-muted/50 border-input"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AtSign className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                size="sm"
              >
                Post
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{comment.userName}</h4>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(comment.id)}
                    className={`h-8 gap-1.5 ${comment.isLiked ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span className="text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDislike(comment.id)}
                    className={`h-8 gap-1.5 ${comment.isDisliked ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span className="text-xs">{comment.dislikes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                    <Reply className="h-3.5 w-3.5" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}