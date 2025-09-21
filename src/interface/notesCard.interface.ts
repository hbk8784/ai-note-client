export interface NoteCardProps {
  id: string;
  date: string;
  truncatedContent: string;
  color: string;
  title: string;
  content: string;
  handleSummeryBtn: (content: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  setEditInfo: (info: { id: string; notes: string; title: string }) => void;
}
