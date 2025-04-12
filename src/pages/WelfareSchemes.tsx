
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Landmark, 
  Search, 
  FileCheck, 
  Calendar, 
  ArrowUpRight, 
  Bookmark,
  Download,
  Filter,
  Crown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

// Mock welfare schemes data
const welfareSchemes = [
  {
    id: 1,
    title: "PM-JAY Health Insurance",
    category: "Healthcare",
    eligibility: "BPL families, low-income households",
    benefits: "Free health insurance coverage up to ₹5 lakhs per family per year",
    deadline: "2025-12-31",
    ministry: "Ministry of Health and Family Welfare",
    documents: ["Aadhaar Card", "Income Certificate", "Ration Card"],
    url: "https://pmjay.gov.in"
  },
  {
    id: 2,
    title: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    eligibility: "Small and marginal farmers",
    benefits: "Income support of ₹6,000 per year to eligible farmer families",
    deadline: "2025-06-30",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    url: "https://pmkisan.gov.in"
  },
  {
    id: 3,
    title: "PM Awas Yojana",
    category: "Housing",
    eligibility: "Homeless individuals, BPL families",
    benefits: "Financial assistance for house construction",
    deadline: "2025-09-15",
    ministry: "Ministry of Housing and Urban Affairs",
    documents: ["Aadhaar Card", "Income Certificate", "Land Documents"],
    url: "https://pmaymis.gov.in"
  },
  {
    id: 4,
    title: "Sukanya Samriddhi Yojana",
    category: "Education",
    eligibility: "Parents/guardians of girl child below 10 years",
    benefits: "Tax-free investment with high interest rate for girl child education",
    deadline: "Ongoing",
    ministry: "Ministry of Finance",
    documents: ["Girl Child Birth Certificate", "Parent/Guardian ID Proof"],
    url: "https://www.india.gov.in/sukanya-samriddhi-account"
  },
  {
    id: 5,
    title: "National Pension Scheme",
    category: "Social Security",
    eligibility: "Indian citizens between 18-65 years",
    benefits: "Pension benefits after retirement",
    deadline: "Ongoing",
    ministry: "Ministry of Finance",
    documents: ["Aadhaar Card", "PAN Card", "Bank Account Details"],
    url: "https://www.npscra.nsdl.co.in"
  }
];

const WelfareSchemes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savedSchemes, setSavedSchemes] = useState<number[]>([]);

  const filteredSchemes = welfareSchemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.benefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || scheme.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const saveScheme = (id: number) => {
    if (savedSchemes.includes(id)) {
      setSavedSchemes(savedSchemes.filter(schemeId => schemeId !== id));
      toast({
        title: "Removed from Saved",
        description: "Scheme has been removed from your saved list",
      });
    } else {
      setSavedSchemes([...savedSchemes, id]);
      toast({
        title: "Saved Successfully",
        description: "Scheme has been saved to your profile",
      });
    }
  };

  const applyForScheme = (title: string) => {
    toast({
      title: "Application Started",
      description: `You've started the application process for ${title}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-swasthya-dark flex items-center">
              <Landmark className="h-7 w-7 mr-3 text-swasthya-primary" />
              Welfare Schemes
            </h1>
            <p className="text-gray-600 mt-2 ml-10">
              Discover government schemes and benefits you may be eligible for.
            </p>
          </div>
          
          <Card className="bg-white border-0 shadow-md mb-8 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Find Welfare Schemes</CardTitle>
              <CardDescription>Search and filter available welfare schemes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search by keyword..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Social Security">Social Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6 animate-fade-in">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map(scheme => (
                <Card 
                  key={scheme.id}
                  className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 bg-swasthya-primary/15 text-swasthya-primary hover:bg-swasthya-primary/20">
                          {scheme.category}
                        </Badge>
                        <CardTitle className="text-xl">{scheme.title}</CardTitle>
                        <CardDescription>{scheme.ministry}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => saveScheme(scheme.id)}
                        className={savedSchemes.includes(scheme.id) ? "text-swasthya-primary" : "text-gray-400"}
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Eligibility:</h3>
                        <p className="text-sm">{scheme.eligibility}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Benefits:</h3>
                        <p className="text-sm">{scheme.benefits}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">
                            Deadline: {scheme.deadline === "Ongoing" ? "Ongoing" : new Date(scheme.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">Required Documents: {scheme.documents.length}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Required Documents:</h3>
                        <div className="flex flex-wrap gap-2">
                          {scheme.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(scheme.url, '_blank')}
                    >
                      Visit Website
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      className="bg-swasthya-primary hover:bg-swasthya-primary/90"
                      onClick={() => applyForScheme(scheme.title)}
                    >
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No matching schemes found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card className="bg-white border-0 shadow-md mt-8 bg-gradient-to-r from-blue-50 to-purple-50 animate-fade-in">
            <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-swasthya-dark flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-swasthya-primary" />
                  Need help with applications?
                </h3>
                <p className="text-gray-600 mt-1">
                  We can guide you through the application process for any scheme.
                </p>
              </div>
              <Button className="bg-swasthya-primary hover:bg-swasthya-primary/90">
                Get Assistance
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WelfareSchemes;
