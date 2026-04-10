import { TestTube, FileText, Clock, CheckCircle2, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLabTests } from "@/actions/laboratory";
import { getPatients } from "@/actions/patients";
import { NewTestModal } from "@/components/modals/new-test-modal";
import { RemoveLabTestModal } from "@/components/modals/remove-lab-test-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface LabTest {
  id: string;
  testName: string;
  status: string;
  date: Date;
  result?: string | null;
  patient: {
    name: string;
  };
}

export default async function LaboratoryPage() {
  const [tests, patients] = await Promise.all([
    getLabTests(),
    getPatients(),
  ]);

  const labTests = tests as unknown as LabTest[];

  const pendingCount = labTests.filter((t) => t.status === "PENDING").length;
  const completedCount = labTests.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Laboratory & Diagnostics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track incoming test requests and dispatch reports.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <RemoveLabTestModal labTests={labTests.map((t) => ({ id: t.id, testName: t.testName, patientName: t.patient.name }))} />
          <NewTestModal patients={patients.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-amber-500"/> Pending Tests
            </h3>
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {pendingCount} In Queue
            </span>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
             {labTests.filter((t) => t.status === "PENDING").length > 0 ? (
               <Table>
                 <TableBody>
                   {labTests.filter((t) => t.status === "PENDING").map((test) => (
                     <TableRow key={test.id} className="dark:border-slate-800">
                       <TableCell className="p-4">
                         <div className="flex flex-col">
                           <span className="font-semibold text-slate-900 dark:text-white">{test.testName}</span>
                           <span className="text-xs text-slate-500 flex items-center gap-1">
                             <User className="h-3 w-3" /> {test.patient.name}
                           </span>
                         </div>
                       </TableCell>
                       <TableCell className="text-right">
                         <span className="text-[10px] text-slate-400 font-mono">
                           {new Date(test.date).toLocaleDateString()}
                         </span>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
                <div className="p-12 flex flex-col items-center text-slate-400 dark:text-slate-500">
                    <TestTube className="h-10 w-10 text-slate-100 dark:text-slate-800 mb-2" />
                    <p className="text-sm italic">Diagnostic queue is empty</p>
                </div>
             )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> Completed & Resulted
            </h3>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-500 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {completedCount} Dispatched
            </span>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
            {labTests.filter((t) => t.status === "COMPLETED").length > 0 ? (
               <Table>
                 <TableBody>
                   {labTests.filter((t) => t.status === "COMPLETED").map((test) => (
                     <TableRow key={test.id} className="dark:border-slate-800">
                       <TableCell className="p-4">
                         <div className="flex flex-col">
                           <span className="font-semibold text-slate-900 dark:text-white">{test.testName}</span>
                           <span className="text-xs text-green-600 font-medium">Result: {test.result || "Normal"}</span>
                         </div>
                       </TableCell>
                       <TableCell className="text-right">
                         <Activity className="h-4 w-4 text-green-500 ml-auto" />
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
                <div className="p-12 flex flex-col items-center text-slate-400 dark:text-slate-500">
                    <FileText className="h-10 w-10 text-slate-100 dark:text-slate-800 mb-2" />
                    <p className="text-sm italic">No recent test results found</p>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors p-8 text-center border-dashed">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Diagnostic Data Connected</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto mb-6">
              Laboratory requests are now synchronized with your PostgreSQL database. All new test requests are instantly visible in pgAdmin.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="rounded-xl cursor-not-allowed opacity-50">Download Statistics</Button>
            <Button variant="outline" className="rounded-xl cursor-not-allowed opacity-50">Lab Settings</Button>
          </div>
      </div>
    </div>
  );
}
