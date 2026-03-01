'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Star, Clock, FileText } from 'lucide-react';
import { mockJobs, formatPrice, formatLocation, getTimeAgo, type JobPosting } from '@/data/mockJobs';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Find the project from mockJobs
  const project = mockJobs.find(job => job.id === projectId);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold">Project Not Found</h2>
              <p className="mb-4 text-muted-foreground">
                The project you're looking for doesn't exist.
              </p>
              <Button onClick={() => router.push('/explore')}>
                Back to Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/explore')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Button>

          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {project.title}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {project.category}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge
                variant={project.status === 'open' ? 'default' : 'secondary'}
                className="rounded-full px-3 py-1"
              >
                {project.status === 'open' ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Category
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {project.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {formatLocation(project.location)}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        City: {project.location.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        State: {project.location.state}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ZIP Code: {project.location.zipCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Budget Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(project.price)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total project budget
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Posted
                    </p>
                    <p className="text-foreground">
                      {getTimeAgo(project.postedAt)}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Deadline
                    </p>
                    <p className="text-foreground">
                      {project.deadline.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Homeowner Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Homeowner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Name
                    </p>
                    <p className="text-foreground">{project.homeowner.name}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Rating
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-foreground font-semibold">
                        {project.homeowner.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / 5.0
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  // TODO: Add bid/apply functionality
                  console.log('Apply/Bid clicked');
                }}
              >
                Submit Bid
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

