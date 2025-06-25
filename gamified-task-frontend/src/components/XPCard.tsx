// src/components/XPCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

interface XPCardProps {
  xp: number;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
}

const XPCard: React.FC<XPCardProps> = ({ xp, approved, rejected, pending, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card gradient className="mb-6">
        <CardContent className="p-6">
          {/* XP Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Experience Points</h2>
                <p className="text-gray-600">Your learning progress</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {xp}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total XP</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{approved}</p>
              <p className="text-sm text-green-600">Approved</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{rejected}</p>
              <p className="text-sm text-red-600">Rejected</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{pending}</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{total}</p>
              <p className="text-sm text-blue-600">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default XPCard;
