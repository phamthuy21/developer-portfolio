'use client';

import React from 'react';
import { useDashboardStats } from '../api/dashboard.queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderGit2, FileText, Code2, Briefcase, Award, MessageSquare } from 'lucide-react';

export function DashboardStats() {
  const { data, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const statCards = [
    { title: 'Total Projects', value: data?.totalProjects, icon: FolderGit2, color: 'text-blue-500' },
    { title: 'Total Blogs', value: data?.totalBlogs, icon: FileText, color: 'text-purple-500' },
    { title: 'Total Skills', value: data?.totalSkills, icon: Code2, color: 'text-green-500' },
    { title: 'Total Experiences', value: data?.totalExperiences, icon: Briefcase, color: 'text-orange-500' },
    { title: 'Total Certificates', value: data?.totalCertificates, icon: Award, color: 'text-yellow-500' },
    { title: 'Unread Messages', value: data?.unreadMessages, icon: MessageSquare, color: 'text-red-500' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
