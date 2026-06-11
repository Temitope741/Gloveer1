import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClass, getClasses, updateClass, type ClassItem } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120),
  description: z.string().trim().min(10, "Add a brief description").max(500),
  category: z.enum(["Web Development", "Cybersecurity", "Data Analytics"]),
  trainer: z.string().trim().min(2).max(80),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  zoomLink: z.string().trim().url("Enter a valid URL").max(500),
});

export default function AddClass() {
  const nav = useNavigate();
  const { id } = useParams();
  const editing = id ? getClasses().find((c) => c.id === id) : undefined;

  const init = editing
    ? {
        title: editing.title,
        description: editing.description,
        category: editing.category,
        trainer: editing.trainer,
        date: new Date(editing.date).toISOString().slice(0, 10),
        time: new Date(editing.date).toISOString().slice(11, 16),
        zoomLink: editing.zoomLink,
      }
    : { title: "", description: "", category: "Web Development" as ClassItem["category"], trainer: "", date: "", time: "", zoomLink: "" };

  const [form, setForm] = useState(init);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    const iso = new Date(`${form.date}T${form.time}`).toISOString();
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      trainer: form.trainer,
      date: iso,
      zoomLink: form.zoomLink,
    };
    if (editing) {
      updateClass(editing.id, payload);
      toast({ title: "Class updated" });
    } else {
      createClass(payload);
      toast({ title: "Class created" });
    }
    nav("/admin/manage");
  }

  return (
    <AppShell variant="admin">
      <h1 className="font-display text-3xl font-bold">{editing ? "Edit class" : "Add a new class"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fill in the class details and share the Zoom link.</p>

      <form onSubmit={submit} className="mt-8 grid max-w-2xl gap-5">
        <div className="space-y-2">
          <Label htmlFor="title">Class Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Intro to Web Development" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What students will learn…" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ClassItem["category"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="Data Analytics">Data Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainer">Trainer</Label>
            <Input id="trainer" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} placeholder="Trainer name" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zoom">Zoom Link</Label>
          <Input id="zoom" value={form.zoomLink} onChange={(e) => setForm({ ...form, zoomLink: e.target.value })} placeholder="https://zoom.us/j/…" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">{editing ? "Save changes" : "Create Class"}</Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/manage")}>Cancel</Button>
        </div>
      </form>
    </AppShell>
  );
}