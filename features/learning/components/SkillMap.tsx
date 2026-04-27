'use client';

import { useState } from 'react';
import { SKILL_NODES } from '@/features/learning/data/nodes';
import { type SkillNode } from '@/features/shared/types';
import SkillNodeComponent from './SkillNode';
import NodeModal from './NodeModal';

/* Thin dashed connector between rows */
function Connector({ double = false }: { double?: boolean }) {
  return (
    <div className="flex items-center justify-center my-1.5" aria-hidden>
      <div className="flex flex-col items-center gap-[3px]">
        {Array.from({ length: double ? 6 : 4 }).map((_, i) => (
          <div key={i} className="w-[2px] h-[4px] rounded-full bg-[var(--border)]" />
        ))}
      </div>
    </div>
  );
}

export default function SkillMap() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const n = Object.fromEntries(SKILL_NODES.map((node) => [node.id, node]));

  return (
    <>
      <div className="flex flex-col items-center select-none pb-8">

        {/* Row 1 — Listening (flagship, entry point) */}
        <SkillNodeComponent node={n['l1']} onClick={setSelectedNode} />

        <Connector />

        {/* Row 2 — Speaking + Structure */}
        <div className="flex items-end justify-center gap-10">
          <SkillNodeComponent node={n['sp1']} onClick={setSelectedNode} />
          <SkillNodeComponent node={n['s1']}  onClick={setSelectedNode} />
        </div>

        <Connector />

        {/* Row 3 — Reading + Writing */}
        <div className="flex items-end justify-center gap-10">
          <SkillNodeComponent node={n['r1']} onClick={setSelectedNode} />
          <SkillNodeComponent node={n['w1']} onClick={setSelectedNode} />
        </div>

        <Connector double />

        {/* Row 4 — Long Talks (locked) */}
        <SkillNodeComponent node={n['l2']} onClick={setSelectedNode} />

        <Connector />

        {/* Row 5 — Full Drill (locked) */}
        <SkillNodeComponent node={n['m1']} onClick={setSelectedNode} />

      </div>

      <NodeModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </>
  );
}
