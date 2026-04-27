'use client';

import { useState } from 'react';
import { SKILL_NODES } from '@/features/learning/data/nodes';
import { useLearningStore } from '@/features/learning/store/useLearningStore';
import { type SkillNode } from '@/features/shared/types';
import SkillNodeComponent from './SkillNode';
import NodeModal from './NodeModal';

/* Invisible spacer — preserves row spacing while SVG draws the path */
function Connector({ double = false }: { double?: boolean }) {
  return (
    <div
      aria-hidden
      style={{ height: double ? 39 : 25, margin: '6px 0' }}
    />
  );
}

/* Organic SVG path connecting all node centers (320×680 coordinate space) */
function OrganicPath() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      width="320"
      height="680"
      viewBox="0 0 320 680"
      aria-hidden
    >
      <path
        d="M 160 38
           C 160 95, 102 125, 102 171
           C 102 215, 218 130, 218 171
           C 218 235, 218 265, 218 304
           C 218 355, 102 265, 102 304
           C 102 375, 160 415, 160 451
           C 160 500, 160 545, 160 584"
        stroke="#E4E4E7"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function SkillMap() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const nodeProgress = useLearningStore((s) => s.nodeProgress);

  const getProgress = (node: SkillNode) => nodeProgress[node.id] ?? node.progress;

  /* "Current" = unlocked node with the lowest in-progress percentage */
  const incompleteUnlocked = SKILL_NODES.filter(
    (n) => n.unlocked && getProgress(n) < 1.0
  );
  const minProgress =
    incompleteUnlocked.length > 0
      ? Math.min(...incompleteUnlocked.map((n) => getProgress(n)))
      : -1;
  const currentNodeId =
    minProgress >= 0
      ? incompleteUnlocked.find((n) => getProgress(n) === minProgress)?.id
      : null;

  const n = Object.fromEntries(SKILL_NODES.map((node) => [node.id, node]));

  return (
    <>
      {/* Fixed-width container so SVG coordinates align with node positions */}
      <div className="relative w-80 mx-auto select-none pb-8" style={{ minHeight: 680 }}>
        <OrganicPath />

        <div className="relative z-10 flex flex-col items-center">

          {/* Row 1 — Listening (flagship, entry point) */}
          <SkillNodeComponent
            node={n['l1']}
            isCurrent={currentNodeId === 'l1'}
            onClick={setSelectedNode}
          />

          <Connector />

          {/* Row 2 — Speaking + Structure */}
          <div className="flex items-end justify-center gap-10">
            <SkillNodeComponent
              node={n['sp1']}
              isCurrent={currentNodeId === 'sp1'}
              onClick={setSelectedNode}
            />
            <SkillNodeComponent
              node={n['s1']}
              isCurrent={currentNodeId === 's1'}
              onClick={setSelectedNode}
            />
          </div>

          <Connector />

          {/* Row 3 — Reading + Writing */}
          <div className="flex items-end justify-center gap-10">
            <SkillNodeComponent
              node={n['r1']}
              isCurrent={currentNodeId === 'r1'}
              onClick={setSelectedNode}
            />
            <SkillNodeComponent
              node={n['w1']}
              isCurrent={currentNodeId === 'w1'}
              onClick={setSelectedNode}
            />
          </div>

          <Connector double />

          {/* Row 4 — Long Talks (locked) */}
          <SkillNodeComponent
            node={n['l2']}
            isCurrent={currentNodeId === 'l2'}
            onClick={setSelectedNode}
          />

          <Connector />

          {/* Row 5 — Full Drill (locked) */}
          <SkillNodeComponent
            node={n['m1']}
            isCurrent={currentNodeId === 'm1'}
            onClick={setSelectedNode}
          />

        </div>
      </div>

      <NodeModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </>
  );
}
