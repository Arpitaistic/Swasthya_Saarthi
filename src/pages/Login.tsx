
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Success!",
        description: "You are now logged in",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-20 pb-20 px-4 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-10 w-10 text-swasthya-primary animate-pulse-subtle" />
            </div>
            <h1 className="text-2xl font-bold text-swasthya-dark">
              Welcome back to <span className="text-swasthya-primary">SwasthyaSaarthi</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your health records and services.
            </p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition duration-200 focus:ring-2 focus:ring-swasthya-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-swasthya-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition duration-200 focus:ring-2 focus:ring-swasthya-primary"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-swasthya-primary hover:bg-swasthya-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center w-full">
                <span className="text-gray-500 text-sm">Don't have an account?</span>{' '}
                <Link to="/register" className="text-swasthya-primary hover:underline text-sm">
                  Create an account
                </Link>
              </div>
              <div className="text-xs text-gray-500 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
