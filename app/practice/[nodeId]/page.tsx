import QuizEngine from '@/features/assessment/components/QuizEngine';

interface Props {
  params: Promise<{ nodeId: string }>;
}

export default async function PracticePage({ params }: Props) {
  const { nodeId } = await params;
  return <QuizEngine nodeId={nodeId} />;
}
