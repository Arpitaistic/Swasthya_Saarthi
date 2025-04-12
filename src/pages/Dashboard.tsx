
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Calendar, 
  FileText, 
  Heart, 
  Shield, 
  Stethoscope, 
  Loader2,
  Bell,
  Landmark
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-swasthya-primary animate-spin" />
        <p className="mt-4 text-swasthya-dark">Loading your dashboard...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-swasthya-dark">
              Welcome, <span className="text-swasthya-primary">{user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your health records, access emergency services, and explore available welfare schemes.
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="animate-fade-in">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Health
              </TabsTrigger>
              <TabsTrigger value="emergency" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Emergency
              </TabsTrigger>
              <TabsTrigger value="welfare" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
                <Landmark className="h-4 w-4 mr-2" />
                Welfare
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Heart className="h-5 w-5 mr-2 text-swasthya-primary" />
                      Health Statistics
                    </CardTitle>
                    <CardDescription>Your recent health metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Last Checkup</span>
                        <span className="font-medium">2 weeks ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Records</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Next Followup</span>
                        <span className="font-medium">May 15, 2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Bell className="h-5 w-5 mr-2 text-swasthya-primary" />
                      Recent Notifications
                    </CardTitle>
                    <CardDescription>Updates and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-swasthya-primary mr-2"></div>
                        <div>
                          <p className="font-medium">Health checkup reminder</p>
                          <p className="text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-swasthya-primary mr-2"></div>
                        <div>
                          <p className="font-medium">New welfare scheme available</p>
                          <p className="text-gray-500">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Calendar className="h-5 w-5 mr-2 text-swasthya-primary" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Scheduled activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Doctor Appointment</span>
                        <span className="font-medium">May 15, 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Medicine Refill</span>
                        <span className="font-medium">April 20, 2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Activity Overview</CardTitle>
                  <CardDescription>Summary of your recent activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Stethoscope className="h-8 w-8 text-swasthya-primary mr-4" />
                      <div>
                        <h4 className="font-medium">Health Assessment Completed</h4>
                        <p className="text-sm text-gray-500">You completed a health assessment on April 05, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-8 w-8 text-swasthya-primary mr-4" />
                      <div>
                        <h4 className="font-medium">Health Record Updated</h4>
                        <p className="text-sm text-gray-500">Your health record was updated on April 02, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-8 w-8 text-swasthya-primary mr-4" />
                      <div>
                        <h4 className="font-medium">Emergency Contact Added</h4>
                        <p className="text-sm text-gray-500">You added a new emergency contact on March 28, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="health">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Your Health Records</CardTitle>
                  <CardDescription>View and manage your health information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6">Health records section coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emergency">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Emergency Services</CardTitle>
                  <CardDescription>Access emergency features and contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6">Emergency services section coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="welfare">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Welfare Schemes</CardTitle>
                  <CardDescription>View eligible welfare schemes and benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6">Welfare schemes section coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
