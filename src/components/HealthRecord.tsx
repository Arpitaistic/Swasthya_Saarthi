
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, FileText, PlusCircle, FilePlus2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockHealthRecords } from '@/utils/healthData';
import type { HealthRecord as HealthRecordType } from '@/utils/healthData';
import { commonSymptoms } from '@/utils/healthData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';

const HealthRecord = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<HealthRecordType[]>([]);
  const [activeRecord, setActiveRecord] = useState<HealthRecordType | null>(null);
  
  // New record form state
  const [newSymptoms, setNewSymptoms] = useState<string[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('healthRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      // Use mock data only if no saved records exist
      setRecords(mockHealthRecords);
    }
  }, []);
  
  // Save records to localStorage whenever records change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('healthRecords', JSON.stringify(records));
    }
  }, [records]);
  
  const getSymptomName = (id: string) => {
    const symptom = commonSymptoms.find(s => s.id === id);
    return symptom ? symptom.name : id;
  };
  
  const handleSymptomChange = (id: string, checked: CheckedState) => {
    if (checked) {
      setNewSymptoms(prev => [...prev, id]);
    } else {
      setNewSymptoms(prev => prev.filter(s => s !== id));
    }
  };
  
  const addNewRecord = () => {
    if (newSymptoms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one symptom",
        variant: "destructive",
      });
      return;
    }
    
    const newRecord: HealthRecordType = {
      id: `record-${Date.now()}`,
      date: new Date().toISOString(),
      symptoms: newSymptoms,
      diagnosis: newDiagnosis || undefined,
      notes: newNotes || undefined,
      followUp: newFollowUp || undefined,
    };
    
    setRecords(prev => [newRecord, ...prev]);
    
    // Reset form
    setNewSymptoms([]);
    setNewDiagnosis('');
    setNewNotes('');
    setNewFollowUp('');
    setDialogOpen(false);
    
    toast({
      title: "Health Record Added",
      description: "Your health record has been saved successfully",
    });
  };
  
  return (
    <section id="record" className="py-16 bg-gradient-soft">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-swasthya-dark mb-4">Your Health Record</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Keep track of your health journey and maintain a comprehensive record of your symptoms,
            diagnoses, and care plans.
          </p>
        </div>
        
        <Tabs defaultValue="timeline" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-swasthya-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-0">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-swasthya-primary/20"></div>
              
              <div className="relative z-10">
                {records.length > 0 ? (
                  records.map((record, index) => (
                    <div key={record.id} className={cn(
                      "flex items-start mb-8",
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    )}>
                      <div className={cn(
                        "w-1/2 flex",
                        index % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8"
                      )}>
                        <Card 
                          className={cn(
                            "max-w-md w-full shadow-lg border-0 health-card",
                            index % 2 === 0 ? "animate-fade-in-left" : "animate-fade-in-right"
                          )}
                          style={{ animationDelay: `${0.1 * index}s` }}
                          onClick={() => setActiveRecord(record)}
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                              {record.diagnosis || "Health Record"}
                            </CardTitle>
                            <CardDescription>
                              <time dateTime={record.date}>
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </time>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium mb-2">Symptoms:</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {record.symptoms.map(symptomId => (
                                <span 
                                  key={symptomId}
                                  className="inline-block px-2 py-0.5 bg-swasthya-primary/10 text-swasthya-secondary rounded-full text-xs"
                                >
                                  {getSymptomName(symptomId)}
                                </span>
                              ))}
                            </div>
                            
                            {record.notes && (
                              <p className="text-sm text-gray-600 mb-2">{record.notes}</p>
                            )}
                            
                            {record.followUp && (
                              <div className="mt-2 text-xs text-gray-500">
                                Follow-up: {new Date(record.followUp).toLocaleDateString()}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-swasthya-primary border-4 border-white"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">No health records found. Add your first record to start tracking your health.</p>
                  </div>
                )}
                
                {/* Add Record Button */}
                <div className="flex justify-center mt-8">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-swasthya-primary hover:bg-swasthya-primary/90">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Health Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Add New Health Record</DialogTitle>
                        <DialogDescription>
                          Record your symptoms, diagnosis, and notes to keep track of your health
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                          <Label htmlFor="symptoms">Select your symptoms</Label>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            {commonSymptoms.map(symptom => (
                              <div key={symptom.id} className="flex items-start space-x-2">
                                <Checkbox 
                                  id={`symptom-${symptom.id}`} 
                                  checked={newSymptoms.includes(symptom.id)} 
                                  onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked)}
                                />
                                <Label
                                  htmlFor={`symptom-${symptom.id}`}
                                  className="font-normal text-sm leading-tight cursor-pointer"
                                >
                                  {symptom.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="diagnosis">Diagnosis (if known)</Label>
                          <Input
                            id="diagnosis"
                            value={newDiagnosis}
                            onChange={(e) => setNewDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis if you know it"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={newNotes}
                            onChange={(e) => setNewNotes(e.target.value)}
                            placeholder="Add any additional details about your symptoms or condition"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="followUp">Follow-up Date (optional)</Label>
                          <Input
                            id="followUp"
                            type="date"
                            value={newFollowUp}
                            onChange={(e) => setNewFollowUp(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-swasthya-primary hover:bg-swasthya-primary/90"
                          onClick={addNewRecord}
                        >
                          Save Record
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card className="shadow-lg border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-swasthya-primary" />
                  Health Records
                </CardTitle>
                <CardDescription>
                  Complete history of your health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-swasthya-primary hover:bg-swasthya-primary/90">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Add New Record
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Follow-up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length > 0 ? (
                        records.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {record.symptoms.map(symptomId => (
                                  <span 
                                    key={symptomId}
                                    className="inline-block px-2 py-0.5 bg-swasthya-primary/10 text-swasthya-secondary rounded-full text-xs"
                                  >
                                    {getSymptomName(symptomId)}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{record.diagnosis || "-"}</TableCell>
                            <TableCell>{record.notes || "-"}</TableCell>
                            <TableCell>
                              {record.followUp 
                                ? new Date(record.followUp).toLocaleDateString() 
                                : "-"
                              }
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No health records available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HealthRecord;
