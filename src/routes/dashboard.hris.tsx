import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Calendar, IndianRupee, Trash2, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/hris")({
  component: HrisPage,
});

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  department: string | null;
  date_of_joining: string;
  basic_salary: number;
  hra: number;
  allowances: number;
  pf_number: string | null;
  esic_number: string | null;
  pan: string | null;
  bank_account: string | null;
  ifsc: string | null;
  status: string;
}

interface AttendanceRow {
  id: string;
  employee_id: string;
  att_date: string;
  status: string;
}

interface Payroll {
  id: string;
  employee_id: string;
  period_month: number;
  period_year: number;
  days_present: number;
  gross_pay: number;
  pf_deduction: number;
  esic_deduction: number;
  tds_deduction: number;
  other_deductions: number;
  net_pay: number;
  status: string;
}

const sb = supabase as any;
const today = () => new Date().toISOString().slice(0, 10);

function HrisPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [attDate, setAttDate] = useState(today());
  const [openEmp, setOpenEmp] = useState(false);
  const [emp, setEmp] = useState<Partial<Employee>>({ status: "active" });
  const [saving, setSaving] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = useCallback(async () => {
    if (!user) return;
    const [e, a, p] = await Promise.all([
      sb.from("employees").select("*").order("created_at", { ascending: false }),
      sb.from("attendance").select("*").eq("att_date", attDate),
      sb.from("payroll_runs").select("*").eq("period_month", month).eq("period_year", year),
    ]);
    if (e.error) toast.error(e.error.message); else setEmployees(e.data ?? []);
    if (!a.error) setAttendance(a.data ?? []);
    if (!p.error) setPayrolls(p.data ?? []);
  }, [user, attDate, month, year]);

  useEffect(() => { load(); }, [load]);

  const monthlyPayout = useMemo(
    () => payrolls.reduce((s, p) => s + Number(p.net_pay), 0),
    [payrolls],
  );
  const presentToday = useMemo(
    () => attendance.filter((a) => a.status === "present" || a.status === "half").length,
    [attendance],
  );

  const saveEmployee = async () => {
    if (!user) return toast.error("Login required");
    if (!emp.full_name || !emp.employee_code) return toast.error("Code & Name required");
    setSaving(true);
    const { error } = await sb.from("employees").insert({
      owner_id: user.id,
      employee_code: emp.employee_code,
      full_name: emp.full_name,
      email: emp.email ?? null,
      phone: emp.phone ?? null,
      designation: emp.designation ?? null,
      department: emp.department ?? null,
      date_of_joining: emp.date_of_joining ?? today(),
      basic_salary: emp.basic_salary ?? 0,
      hra: emp.hra ?? 0,
      allowances: emp.allowances ?? 0,
      pf_number: emp.pf_number ?? null,
      esic_number: emp.esic_number ?? null,
      pan: emp.pan ?? null,
      bank_account: emp.bank_account ?? null,
      ifsc: emp.ifsc ?? null,
      status: emp.status ?? "active",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Employee added");
    setOpenEmp(false);
    setEmp({ status: "active" });
    load();
  };

  const removeEmp = async (id: string) => {
    if (!confirm("Delete employee?")) return;
    const { error } = await sb.from("employees").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  const markAttendance = async (employee_id: string, status: string) => {
    if (!user) return;
    const existing = attendance.find((a) => a.employee_id === employee_id);
    if (existing) {
      const { error } = await sb.from("attendance").update({ status }).eq("id", existing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await sb.from("attendance").insert({
        owner_id: user.id, employee_id, att_date: attDate, status,
      });
      if (error) return toast.error(error.message);
    }
    load();
  };

  const runPayroll = async () => {
    if (!user) return;
    if (!employees.length) return toast.error("Add employees first");
    const rows = employees.filter((e) => e.status === "active").map((e) => {
      const gross = Number(e.basic_salary) + Number(e.hra) + Number(e.allowances);
      const pf = Number(e.basic_salary) * 0.12;
      const esic = gross < 21000 ? gross * 0.0075 : 0;
      const net = gross - pf - esic;
      return {
        owner_id: user.id,
        employee_id: e.id,
        period_month: month,
        period_year: year,
        days_present: 30,
        gross_pay: gross,
        pf_deduction: pf,
        esic_deduction: esic,
        tds_deduction: 0,
        other_deductions: 0,
        net_pay: net,
        status: "processed",
      };
    });
    const { error } = await sb.from("payroll_runs").upsert(rows, {
      onConflict: "employee_id,period_month,period_year",
    });
    if (error) return toast.error(error.message);
    toast.success(`Payroll processed for ${rows.length} employees`);
    load();
  };

  return (
    <ModulePage
      title="HRIS & Payroll"
      description="Employee master, daily attendance, salary structure & 1-click payroll (PF, ESIC, TDS)."
      icon={<Users className="h-5 w-5" />}
      premium
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><Users className="h-4 w-4 text-muted-foreground" /><div className="mt-2 text-2xl font-bold text-navy-deep">{employees.length}</div><div className="text-sm text-muted-foreground">Employees</div></Card>
        <Card className="p-5"><Calendar className="h-4 w-4 text-muted-foreground" /><div className="mt-2 text-2xl font-bold text-navy-deep">{presentToday}</div><div className="text-sm text-muted-foreground">Present on {attDate}</div></Card>
        <Card className="p-5"><IndianRupee className="h-4 w-4 text-muted-foreground" /><div className="mt-2 text-2xl font-bold text-navy-deep">₹{monthlyPayout.toFixed(0)}</div><div className="text-sm text-muted-foreground">Payroll {month}/{year}</div></Card>
      </div>

      <Tabs defaultValue="employees" className="mt-2">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Employees</h3>
                <p className="text-sm text-muted-foreground">Add employees with salary structure & statutory IDs.</p>
              </div>
              <Dialog open={openEmp} onOpenChange={setOpenEmp}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-hero text-white"><UserPlus className="mr-2 h-4 w-4" />Add Employee</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                  <DialogHeader><DialogTitle>New Employee</DialogTitle></DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label>Employee Code *</Label><Input value={emp.employee_code ?? ""} onChange={(e) => setEmp({ ...emp, employee_code: e.target.value })} /></div>
                    <div><Label>Full Name *</Label><Input value={emp.full_name ?? ""} onChange={(e) => setEmp({ ...emp, full_name: e.target.value })} /></div>
                    <div><Label>Email</Label><Input type="email" value={emp.email ?? ""} onChange={(e) => setEmp({ ...emp, email: e.target.value })} /></div>
                    <div><Label>Phone</Label><Input value={emp.phone ?? ""} onChange={(e) => setEmp({ ...emp, phone: e.target.value })} /></div>
                    <div><Label>Designation</Label><Input value={emp.designation ?? ""} onChange={(e) => setEmp({ ...emp, designation: e.target.value })} /></div>
                    <div><Label>Department</Label><Input value={emp.department ?? ""} onChange={(e) => setEmp({ ...emp, department: e.target.value })} /></div>
                    <div><Label>Date of Joining</Label><Input type="date" value={emp.date_of_joining ?? today()} onChange={(e) => setEmp({ ...emp, date_of_joining: e.target.value })} /></div>
                    <div><Label>Status</Label>
                      <Select value={emp.status} onValueChange={(v) => setEmp({ ...emp, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Basic Salary</Label><Input type="number" value={emp.basic_salary ?? 0} onChange={(e) => setEmp({ ...emp, basic_salary: parseFloat(e.target.value) || 0 })} /></div>
                    <div><Label>HRA</Label><Input type="number" value={emp.hra ?? 0} onChange={(e) => setEmp({ ...emp, hra: parseFloat(e.target.value) || 0 })} /></div>
                    <div><Label>Allowances</Label><Input type="number" value={emp.allowances ?? 0} onChange={(e) => setEmp({ ...emp, allowances: parseFloat(e.target.value) || 0 })} /></div>
                    <div><Label>PAN</Label><Input value={emp.pan ?? ""} onChange={(e) => setEmp({ ...emp, pan: e.target.value.toUpperCase() })} /></div>
                    <div><Label>PF Number</Label><Input value={emp.pf_number ?? ""} onChange={(e) => setEmp({ ...emp, pf_number: e.target.value })} /></div>
                    <div><Label>ESIC Number</Label><Input value={emp.esic_number ?? ""} onChange={(e) => setEmp({ ...emp, esic_number: e.target.value })} /></div>
                    <div><Label>Bank Account</Label><Input value={emp.bank_account ?? ""} onChange={(e) => setEmp({ ...emp, bank_account: e.target.value })} /></div>
                    <div><Label>IFSC</Label><Input value={emp.ifsc ?? ""} onChange={(e) => setEmp({ ...emp, ifsc: e.target.value.toUpperCase() })} /></div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenEmp(false)}>Cancel</Button>
                    <Button onClick={saveEmployee} disabled={saving} className="bg-gradient-hero text-white">{saving ? "Saving..." : "Save"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-6 overflow-x-auto">
              {employees.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No employees yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Designation</TableHead>
                      <TableHead>Dept</TableHead><TableHead className="text-right">Basic</TableHead>
                      <TableHead className="text-right">Gross</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((e) => {
                      const gross = Number(e.basic_salary) + Number(e.hra) + Number(e.allowances);
                      return (
                        <TableRow key={e.id}>
                          <TableCell className="font-mono text-xs">{e.employee_code}</TableCell>
                          <TableCell className="font-medium">{e.full_name}</TableCell>
                          <TableCell>{e.designation ?? "—"}</TableCell>
                          <TableCell>{e.department ?? "—"}</TableCell>
                          <TableCell className="text-right">₹{Number(e.basic_salary).toFixed(0)}</TableCell>
                          <TableCell className="text-right font-semibold">₹{gross.toFixed(0)}</TableCell>
                          <TableCell><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{e.status}</span></TableCell>
                          <TableCell><Button size="icon" variant="ghost" onClick={() => removeEmp(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-display text-lg font-bold">Daily Attendance</h3><p className="text-sm text-muted-foreground">Mark each employee's status for the selected date.</p></div>
              <div className="flex items-center gap-2"><Label>Date</Label><Input type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} className="w-44" /></div>
            </div>
            <div className="mt-6 overflow-x-auto">
              {employees.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Add employees to mark attendance.</div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {employees.map((e) => {
                      const a = attendance.find((x) => x.employee_id === e.id);
                      return (
                        <TableRow key={e.id}>
                          <TableCell><div className="font-medium">{e.full_name}</div><div className="text-xs text-muted-foreground">{e.employee_code}</div></TableCell>
                          <TableCell>{a ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold capitalize text-primary">{a.status}</span> : <span className="text-xs text-muted-foreground">Not marked</span>}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {["present", "absent", "half", "leave", "holiday"].map((s) => (
                                <Button key={s} size="sm" variant={a?.status === s ? "default" : "outline"} onClick={() => markAttendance(e.id, s)} className="h-7 capitalize">{s}</Button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-display text-lg font-bold">Monthly Payroll</h3><p className="text-sm text-muted-foreground">Auto-calculates PF (12% of basic) + ESIC (0.75% if gross &lt; 21k).</p></div>
              <div className="flex items-center gap-2">
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from({ length: 12 }).map((_, i) => <SelectItem key={i} value={String(i + 1)}>{new Date(0, i).toLocaleString("en", { month: "long" })}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-24" />
                <Button onClick={runPayroll} className="bg-gradient-gold text-gold-foreground"><Play className="mr-2 h-4 w-4" />Run Payroll</Button>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              {payrolls.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No payroll processed for {month}/{year}. Click "Run Payroll".</div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">PF</TableHead><TableHead className="text-right">ESIC</TableHead><TableHead className="text-right">TDS</TableHead><TableHead className="text-right">Net Pay</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {payrolls.map((p) => {
                      const e = employees.find((x) => x.id === p.employee_id);
                      return (
                        <TableRow key={p.id}>
                          <TableCell>{e?.full_name ?? "—"}</TableCell>
                          <TableCell className="text-right">₹{Number(p.gross_pay).toFixed(0)}</TableCell>
                          <TableCell className="text-right text-rose-600">₹{Number(p.pf_deduction).toFixed(0)}</TableCell>
                          <TableCell className="text-right text-rose-600">₹{Number(p.esic_deduction).toFixed(0)}</TableCell>
                          <TableCell className="text-right text-rose-600">₹{Number(p.tds_deduction).toFixed(0)}</TableCell>
                          <TableCell className="text-right font-bold text-navy-deep">₹{Number(p.net_pay).toFixed(0)}</TableCell>
                          <TableCell><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold capitalize text-emerald-700">{p.status}</span></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </ModulePage>
  );
}
