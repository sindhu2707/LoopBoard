"use client";

import { Task, Project } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  todo: "#94a3b8",
  "in-progress": "#3b82f6",
  review: "#f59e0b",
  done: "#22c55e",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "In Review",
  done: "Done",
};

export function TaskStatusChart({ tasks }: { tasks: Task[] }) {
  const data = Object.entries(STATUS_LABELS).map(([status, label]) => ({
    status,
    label,
    count: tasks.filter((t) => t.status === status).length,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-ink mb-4">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-ink-muted">{value}</span>}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-surface-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ProjectProgressChart({ projects }: { projects: Project[] }) {
  const data = projects.map((p) => ({ name: p.name, progress: p.progress }));

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-ink mb-4">Project Progress</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-surface-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="progress" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}