  import API_BASE_URL from "../config/api";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import {
    PieChart, Pie, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer
  } from "recharts";
  import GradientText from "../components/GradientText";
  import AnimatedContent from "../components/AnimatedContent";
  import "../styles/theme.css";

  export default function Dashboard() {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");

    useEffect(() => {
      axios.get(`${API_BASE_URL}/issues`).then(r => setData(r.data));
    }, []);

    const filtered = data.filter(d => {
      if (status !== "All" && d.Status !== status) return false;
      if (priority !== "All" && d.Priority !== priority) return false;
      return true;
    });

    const countBy = key =>
      Object.entries(filtered.reduce((a,d)=>{a[d[key]]=(a[d[key]]||0)+1;return a;},{}))
        .map(([name,value])=>({name,value}));

    const extractScreen = n => n?.split("->")?.[2]?.trim() || "Unknown";

    const topScreens = Object.entries(filtered.reduce((a,d)=>{
      const s = extractScreen(d.Name); a[s]=(a[s]||0)+1; return a;
    },{})).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,5);

    return (
      <div style={{padding:24}}>
        <GradientText>QA Testing Dashboard</GradientText>

        <div className="filters">
          <select onChange={e=>setStatus(e.target.value)}>
            <option>All</option><option>Moved to Testing</option><option>Not Started</option>
          </select>
          <select onChange={e=>setPriority(e.target.value)}>
            <option>All</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>

        <div className="dashboard-grid">
          <AnimatedContent>
            <div className="gradient-border"><div className="inner card">Total Issues: {filtered.length}</div></div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="card">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart><Pie data={countBy("Status")} dataKey="value"/><Tooltip/></PieChart>
              </ResponsiveContainer>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="card">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={countBy("Priority")}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="card">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topScreens}><XAxis dataKey="name" angle={-30} textAnchor="end"/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="card">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={countBy("Start Date")}><XAxis dataKey="name"/><YAxis/><Tooltip/><Line dataKey="value"/></LineChart>
              </ResponsiveContainer>
            </div>
          </AnimatedContent>
        </div>
      </div>
    );
  }
