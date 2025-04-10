// src/components/XPCard.tsx
import React from 'react';

interface XPCardProps {
  xp: number;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
}

const XPCard: React.FC<XPCardProps> = ({ xp, approved, rejected, pending, total }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">🧠 Task Summary</h2>
      <p className="text-lg mb-2">✨ Total XP: <span className="font-semibold">{xp}</span></p>
      <div className="grid grid-cols-2 gap-4">
        <p>✅ Approved: {approved}</p>
        <p>❌ Rejected: {rejected}</p>
        <p>⏳ Pending: {pending}</p>
        <p>📦 Total Submissions: {total}</p>
      </div>
    </div>
  );
};

export default XPCard;
