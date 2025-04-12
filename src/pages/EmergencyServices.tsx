
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  MapPin, 
  UserPlus, 
  Navigation, 
  Send,
  Mic,
  Bell,
  Volume2,
  X,
  Map,
  Loader2,
  Heart,
  Stethoscope,
  Info,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for emergency contacts
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const EmergencyServices = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [recording, setRecording] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isRouteCalculating, setIsRouteCalculating] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [mapLoading, setMapLoading] = useState(true);

  // Load emergency contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
    
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Save emergency contacts to localStorage whenever contacts change
  useEffect(() => {
    if (emergencyContacts.length > 0) {
      localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    }
  }, [emergencyContacts]);

  const triggerSOS = () => {
    // Get current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        // Activate SOS mode
        setSosActive(true);
        
        // Notify all emergency contacts (in a real app)
        emergencyContacts.forEach(contact => {
          console.log(`Notifying ${contact.name} at ${contact.phone} about emergency`);
        });
        
        toast({
          title: "SOS Activated",
          description: `Emergency contacts ${emergencyContacts.length > 0 ? 'are being notified' : 'would be notified if you had added any'}`,
          variant: "destructive",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  const cancelSOS = () => {
    setSosActive(false);
    setRecording(false);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled",
    });
  };

  const toggleRecording = () => {
    setRecording(!recording);
    toast({
      title: recording ? "Recording Stopped" : "Recording Started",
      description: recording ? "Voice recording has stopped" : "Voice recording has started",
    });
  };

  const addEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactPhone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: contactName,
      phone: contactPhone,
    };
    
    setEmergencyContacts(prev => [...prev, newContact]);
    
    toast({
      title: "Contact Added",
      description: `${contactName} has been added as an emergency contact`,
    });
    
    // Reset form
    setContactName('');
    setContactPhone('');
  };

  const removeContact = (contactId: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== contactId));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed",
    });
  };

  const callEmergency = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const findSafeRoute = () => {
    setIsRouteCalculating(true);
    
    // Simulate route calculation (would be a real API call in production)
    setTimeout(() => {
      setIsRouteCalculating(false);
      toast({
        title: "Safe Route Found",
        description: `Safe route from "${fromLocation}" to "${toLocation}" has been calculated`,
      });
      setRouteDialogOpen(false);
      
      // Reset form
      setFromLocation('');
      setToLocation('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-soft">
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-swasthya-primary animate-pulse" />
              <h1 className="text-3xl font-bold text-swasthya-dark dark:text-white">
                Emergency Services
              </h1>
              <Badge variant="outline" className="bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" /> Active
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1 ml-11 max-w-2xl">
              Access emergency features, contact helplines, and set up safety protocols for health emergencies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`emergency-card card-3d ${sosActive ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 animate-glow' : 'glass-card'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg font-bold dark:text-white">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${sosActive ? 'text-red-500 animate-pulse' : 'text-swasthya-primary'}`} />
                    SOS Emergency Alert
                  </CardTitle>
                  {sosActive && (
                    <span className="inline-flex h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </div>
                <CardDescription className="dark:text-gray-300">Quickly alert your emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                {sosActive ? (
                  <div className="space-y-4">
                    <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-pulse">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">SOS Alert Active</span>
                      </div>
                      <p>Your emergency contacts are being notified with your location</p>
                    </div>
                    
                    {location && (
                      <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm dark:text-gray-300">
                        <p className="font-medium flex items-center mb-1">
                          <MapPin className="h-4 w-4 mr-1 text-swasthya-primary" />
                          Your location is being shared:
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                          <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400">Latitude</span>
                            <span className="font-medium">{location.lat.toFixed(6)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400">Longitude</span>
                            <span className="font-medium">{location.lng.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={toggleRecording} 
                        variant="outline" 
                        className={`flex-1 ${recording ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse' : 'dark:text-white dark:border-gray-600'}`}
                      >
                        {recording ? (
                          <>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Record Audio
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={cancelSOS} 
                        variant="destructive" 
                        className="flex-1 emergency-button"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel SOS
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        In case of emergency, press the SOS button to alert your emergency contacts with your current location.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={triggerSOS} 
                      className="w-full btn-emergency emergency-button"
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Trigger SOS Alert
                    </Button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {emergencyContacts.length > 0 ? 
                        `This will alert ${emergencyContacts.length} emergency contact${emergencyContacts.length === 1 ? '' : 's'} with your location` : 
                        'Add emergency contacts below to enable alerts'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="emergency-card glass-card card-3d">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-bold dark:text-white">
                  <Phone className="h-5 w-5 mr-2 text-swasthya-primary" />
                  Emergency Helplines
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Important contact numbers for emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <Badge variant="outline" className="badge-emergency mb-1">National</Badge>
                      <span className="block font-medium dark:text-white">Emergency Helpline</span>
                    </div>
                    <Button size="sm" className="bg-swasthya-primary hover:bg-swasthya-primary/90" onClick={() => callEmergency('112')}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call 112
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <Badge variant="outline" className="badge-emergency mb-1">Medical</Badge>
                      <span className="block font-medium dark:text-white">Ambulance Services</span>
                    </div>
                    <Button size="sm" className="bg-swasthya-primary hover:bg-swasthya-primary/90" onClick={() => callEmergency('108')}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call 108
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <Badge variant="outline" className="badge-emergency mb-1">Security</Badge>
                      <span className="block font-medium dark:text-white">Police Helpline</span>
                    </div>
                    <Button size="sm" className="bg-swasthya-primary hover:bg-swasthya-primary/90" onClick={() => callEmergency('100')}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call 100
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <Badge variant="outline" className="badge-emergency mb-1">Women</Badge>
                      <span className="block font-medium dark:text-white">Women Helpline</span>
                    </div>
                    <Button size="sm" className="bg-swasthya-primary hover:bg-swasthya-primary/90" onClick={() => callEmergency('1098')}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call 1098
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="emergency-card glass-card card-3d">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-bold dark:text-white">
                  <MapPin className="h-5 w-5 mr-2 text-swasthya-primary" />
                  Nearby Facilities
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Find healthcare facilities near you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    <AspectRatio ratio={16 / 9}>
                      {mapLoading ? (
                        <Skeleton className="h-full w-full" />
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 h-full w-full flex items-center justify-center">
                          <Map className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="card-hover-effect bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            toast({
                              title: "Finding Hospitals",
                              description: "Locating hospitals near your current location",
                            });
                            // In a real app, this would call a maps API
                            window.open(`https://www.google.com/maps/search/hospitals/@${position.coords.latitude},${position.coords.longitude},14z`, '_blank');
                          },
                          (error) => {
                            toast({
                              title: "Location Error",
                              description: "Unable to get your location. Please allow location access.",
                              variant: "destructive",
                            });
                          }
                        );
                      }}
                    >
                      <Stethoscope className="h-4 w-4 mr-2 text-swasthya-primary" />
                      Hospitals
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="card-hover-effect bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            toast({
                              title: "Finding Pharmacies",
                              description: "Locating pharmacies near your current location",
                            });
                            // In a real app, this would call a maps API
                            window.open(`https://www.google.com/maps/search/pharmacy/@${position.coords.latitude},${position.coords.longitude},14z`, '_blank');
                          },
                          (error) => {
                            toast({
                              title: "Location Error",
                              description: "Unable to get your location. Please allow location access.",
                              variant: "destructive",
                            });
                          }
                        );
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2 text-swasthya-primary" />
                      Pharmacies
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="contacts" className="animate-fade-in">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 p-1 bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-xl">
              <TabsTrigger value="contacts" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-swasthya-primary data-[state=active]:to-swasthya-secondary data-[state=active]:text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Emergency Contacts
              </TabsTrigger>
              <TabsTrigger value="safe-routes" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-swasthya-primary data-[state=active]:to-swasthya-secondary data-[state=active]:text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Safe Routes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts">
              <Card className="glass-card card-3d border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-bold dark:text-white">
                    <UserPlus className="h-5 w-5 mr-2 text-swasthya-primary" />
                    Manage Emergency Contacts
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    These contacts will be notified in case of emergency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addEmergencyContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName" className="dark:text-white">Contact Name</Label>
                        <Input 
                          id="contactName" 
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="dark:text-white">Phone Number</Label>
                        <Input 
                          id="contactPhone" 
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="btn-primary-gradient">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 dark:text-white">Your Emergency Contacts</h3>
                      <Badge variant="outline" className="badge-primary">
                        {emergencyContacts.length} Contacts
                      </Badge>
                    </div>
                    {emergencyContacts.length > 0 ? (
                      <div className="space-y-2">
                        {emergencyContacts.map(contact => (
                          <div 
                            key={contact.id} 
                            className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 card-hover-effect"
                          >
                            <div className="flex items-center">
                              <div className="bg-swasthya-primary/10 dark:bg-swasthya-primary/20 p-2 rounded-full mr-3">
                                <User className="h-5 w-5 text-swasthya-primary" />
                              </div>
                              <div>
                                <p className="font-medium dark:text-white">{contact.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => callEmergency(contact.phone)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-swasthya-primary dark:text-gray-400"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeContact(contact.id)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
                            <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 mb-1">No emergency contacts added yet</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Add contacts above to enable SOS alerts</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="safe-routes">
              <Card className="glass-card card-3d border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-bold dark:text-white">
                    <Navigation className="h-5 w-5 mr-2 text-swasthya-primary" />
                    Safe Route Navigation
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Find the safest route to your destination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                      <AspectRatio ratio={16 / 9}>
                        {mapLoading ? (
                          <Skeleton className="h-full w-full" />
                        ) : (
                          <div className="bg-gray-100 dark:bg-gray-800 h-full w-full flex items-center justify-center">
                            <div className="text-center">
                              <Navigation className="h-10 w-10 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">Route map will appear here</p>
                            </div>
                          </div>
                        )}
                      </AspectRatio>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentLocation" className="dark:text-white">Current Location</Label>
                        <div className="relative">
                          <Input 
                            id="currentLocation" 
                            placeholder="Your current location" 
                            className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 pl-10"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                          />
                          <MapPin className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination" className="dark:text-white">Destination</Label>
                        <div className="relative">
                          <Input 
                            id="destination" 
                            placeholder="Where are you going?" 
                            className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 pl-10"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                          />
                          <MapPin className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-primary-gradient"
                      onClick={() => {
                        if (!fromLocation || !toLocation) {
                          toast({
                            title: "Missing Information",
                            description: "Please enter both your current location and destination",
                            variant: "destructive",
                          });
                          return;
                        }
                        setRouteDialogOpen(true);
                        findSafeRoute();
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Find Safe Route
                    </Button>
                    
                    <div 
                      className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors cursor-pointer card-hover-effect"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude } = position.coords;
                            // In a real app, this would initialize a map
                            toast({
                              title: "Location Found",
                              description: "Your current location has been detected. Enter your destination to find a safe route.",
                            });
                            // Auto-fill the current location field
                            setFromLocation("Current Location");
                          },
                          (error) => {
                            toast({
                              title: "Location Error",
                              description: "Unable to get your location. Please allow location access or enter it manually.",
                              variant: "destructive",
                            });
                          }
                        );
                      }}
                    >
                      <div className="p-4 text-center">
                        <div className="bg-swasthya-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="h-6 w-6 text-swasthya-primary" />
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">Use Current Location</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Click to automatically detect your location</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center space-x-3 text-sm">
                      <Info className="h-5 w-5 text-swasthya-primary flex-shrink-0" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Our safe route algorithm considers factors like lighting, crowd density, and safety history to provide the safest path.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Route Dialog */}
          <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
            <DialogContent className="sm:max-w-md glass-card">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold dark:text-white flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-swasthya-primary" />
                  Safe Route Navigation
                </DialogTitle>
                <DialogDescription className="dark:text-gray-300">
                  Finding the safest route to your destination
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 flex flex-col items-center justify-center">
                {isRouteCalculating ? (
                  <>
                    <div className="relative mb-4">
                      <Loader2 className="h-12 w-12 text-swasthya-primary animate-spin" />
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-swasthya-primary/20 animate-ping"></div>
                      </div>
                    </div>
                    <p className="text-center font-medium dark:text-white mb-1">Calculating the safest route...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Analyzing street lighting, crowd density and safety data
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                      <Navigation className="h-10 w-10 text-green-500" />
                    </div>
                    <p className="text-center font-bold text-lg dark:text-white mb-1">Safe route found!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                      Route from <span className="font-medium">{fromLocation}</span> to{" "}
                      <span className="font-medium">{toLocation}</span> ready.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        Well-lit areas
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        Safer roads
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRouteDialogOpen(false)}
                  className="dark:border-gray-600 dark:text-white"
                >
                  Close
                </Button>
                <Button
                  disabled={isRouteCalculating}
                  onClick={() => {
                    // In a real app, this would open the map with directions
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                        fromLocation
                      )}&destination=${encodeURIComponent(toLocation)}`,
                      "_blank"
                    );
                    setRouteDialogOpen(false);
                  }}
                  className="btn-primary-gradient"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Open Directions
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyServices;
