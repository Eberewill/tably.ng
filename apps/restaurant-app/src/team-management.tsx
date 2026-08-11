import { FormEvent, useEffect, useMemo, useState } from "react";
import "./team-management.css";

type TeamTab = "members" | "roles" | "departments";
type MemberStatus = "Active" | "Away" | "Inactive" | "Pending";
type Permission = "view" | "create" | "edit" | "delete" | "export";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: MemberStatus;
  lastActive: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  system: boolean;
  tone: string;
  permissions: Record<string, Permission[]>;
};

type Department = { id: string; name: string; lead: string };

const permissionColumns: Permission[] = ["view", "create", "edit", "delete", "export"];
const modules = [
  { id: "dashboard", name: "Dashboard", description: "View dashboard and analytics", allowed: ["view", "export"] as Permission[] },
  { id: "orders", name: "Orders", description: "Manage orders and order history", allowed: ["view", "create", "edit", "export"] as Permission[] },
  { id: "menu", name: "Menu Management", description: "Manage menu items, categories and modifiers", allowed: permissionColumns },
  { id: "tables", name: "Tables & Floor Plan", description: "Manage tables and floor layout", allowed: permissionColumns },
  { id: "customers", name: "Customers", description: "View and manage customer information", allowed: ["view", "create", "edit", "export"] as Permission[] },
  { id: "staff", name: "Staff & Roles", description: "Manage team members and roles", allowed: ["view", "create", "edit", "export"] as Permission[] },
  { id: "reports", name: "Reports", description: "View and export reports", allowed: ["view", "export"] as Permission[] },
  { id: "settings", name: "Settings", description: "Manage restaurant settings", allowed: ["view", "create", "edit"] as Permission[] },
];

function permissionsFor(level: "all" | "operations" | "kitchen" | "cashier" | "waiter" | "basic") {
  return Object.fromEntries(modules.map((module) => [module.id, module.allowed.filter((permission) => {
    if (level === "all") return true;
    if (level === "operations") return permission !== "delete";
    if (level === "kitchen") return module.id === "orders" || module.id === "menu" ? permission !== "export" : permission === "view";
    if (level === "cashier") return module.id === "orders" || module.id === "customers" ? permission !== "delete" : permission === "view";
    if (level === "waiter") return module.id === "orders" || module.id === "tables" ? ["view", "create", "edit"].includes(permission) : permission === "view";
    return permission === "view" && ["dashboard", "orders"].includes(module.id);
  })])) as Record<string, Permission[]>;
}

const initialRoles: Role[] = [
  { id: "manager", name: "Manager", description: "Full access to manage restaurant operations and settings.", system: true, tone: "terracotta", permissions: permissionsFor("all") },
  { id: "supervisor", name: "Supervisor", description: "Oversee staff and daily operations.", system: true, tone: "gold", permissions: permissionsFor("operations") },
  { id: "chef", name: "Chef", description: "Manage kitchen orders and menu items.", system: true, tone: "violet", permissions: permissionsFor("kitchen") },
  { id: "cashier", name: "Cashier", description: "Process orders and payments.", system: true, tone: "blue", permissions: permissionsFor("cashier") },
  { id: "waiter", name: "Waiter", description: "Take orders and manage tables.", system: true, tone: "green", permissions: permissionsFor("waiter") },
  { id: "dishwasher", name: "Dishwasher", description: "Kitchen cleaning and maintenance.", system: true, tone: "neutral", permissions: permissionsFor("basic") },
];

const initialMembers: Member[] = ([
  ["Chinedu Okafor", "chinedu@zumagrill.ng", "Manager", "Management", "Active", "Today, 09:15 AM"],
  ["Amaka Ibe", "amaka@zumagrill.ng", "Supervisor", "Floor Staff", "Active", "Today, 08:42 AM"],
  ["Ibrahim Bello", "ibrahim@zumagrill.ng", "Chef", "Kitchen", "Active", "Today, 07:30 AM"],
  ["Blessing Nwosu", "blessing@zumagrill.ng", "Cashier", "Operations", "Active", "Yesterday, 11:20 PM"],
  ["Tunde Lawal", "tunde@zumagrill.ng", "Waiter", "Floor Staff", "Active", "Yesterday, 10:05 PM"],
  ["Oluwakemi Adeyemi", "kemi@zumagrill.ng", "Waiter", "Bar", "Away", "Yesterday, 08:15 PM"],
  ["Samuel Eze", "samuel@zumagrill.ng", "Dishwasher", "Kitchen", "Inactive", "2 days ago"],
  ["Mercy Johnson", "mercy@zumagrill.ng", "Waiter", "Floor Staff", "Pending", "—"],
  ["Ayo Balogun", "ayo@zumagrill.ng", "Chef", "Kitchen", "Active", "Today, 06:55 AM"],
  ["Fatima Musa", "fatima@zumagrill.ng", "Cashier", "Operations", "Active", "Yesterday, 09:40 PM"],
  ["David Obi", "david@zumagrill.ng", "Waiter", "Floor Staff", "Active", "Yesterday, 07:10 PM"],
  ["Ngozi Umeh", "ngozi@zumagrill.ng", "Supervisor", "Floor Staff", "Active", "Yesterday, 06:45 PM"],
  ["Bola Akin", "bola@zumagrill.ng", "Waiter", "Bar", "Away", "Yesterday, 05:30 PM"],
  ["Esther James", "esther@zumagrill.ng", "Cashier", "Operations", "Active", "2 days ago"],
  ["Musa Garba", "musa@zumagrill.ng", "Chef", "Kitchen", "Active", "2 days ago"],
  ["Chioma Nnamdi", "chioma@zumagrill.ng", "Waiter", "Floor Staff", "Active", "3 days ago"],
  ["Kunle Ajayi", "kunle@zumagrill.ng", "Dishwasher", "Kitchen", "Inactive", "5 days ago"],
  ["Rita Emmanuel", "rita@zumagrill.ng", "Waiter", "Floor Staff", "Pending", "—"],
] satisfies Array<[string, string, string, string, MemberStatus, string]>).map(([name, email, role, department, status, lastActive], index) => ({ id: `member-${index + 1}`, name, email, role, department, status, lastActive }));

const initialDepartments: Department[] = [
  { id: "management", name: "Management", lead: "Chinedu Okafor" },
  { id: "floor", name: "Floor Staff", lead: "Amaka Ibe" },
  { id: "kitchen", name: "Kitchen", lead: "Ibrahim Bello" },
  { id: "operations", name: "Operations", lead: "Blessing Nwosu" },
  { id: "bar", name: "Bar", lead: "Oluwakemi Adeyemi" },
];

function Icon({ name }: { name: "search" | "filter" | "edit" | "more" | "mail" | "close" | "shield" }) {
  const path = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    edit: <><path d="m4 20 4.2-1 10.7-10.7-3.2-3.2L5 15.8 4 20Z" /><path d="m14.5 6.3 3.2 3.2" /></>,
    more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    shield: <path d="M12 3 5 6v5c0 5 3 8.3 7 10 4-1.7 7-5 7-10V6l-7-3Zm0 4v10M8.5 10l3.5 2 3.5-2" />,
  }[name];
  return <svg aria-hidden="true" viewBox="0 0 24 24">{path}</svg>;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function readStored<T>(key: string, fallback: T[]) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value as T[] : fallback;
  } catch {
    return fallback;
  }
}

export function TeamManagement() {
  const [tab, setTab] = useState<TeamTab>("members");
  const [members, setMembers] = useState(() => readStored("tably.team-members", initialMembers));
  const [roles, setRoles] = useState(() => readStored("tably.team-roles", initialRoles));
  const [departments, setDepartments] = useState(() => readStored("tably.team-departments", initialDepartments));
  const [selectedRoleId, setSelectedRoleId] = useState("manager");
  const [roleSection, setRoleSection] = useState<"permissions" | "users" | "details">("permissions");
  const [query, setQuery] = useState("");
  const [memberStatus, setMemberStatus] = useState<MemberStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState<"member" | "role" | "department" | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string>();
  const [editingRoleId, setEditingRoleId] = useState<string>();
  const [form, setForm] = useState({ name: "", email: "", role: "Waiter", department: "Floor Staff", description: "", lead: "" });
  const [notice, setNotice] = useState("");

  const filteredMembers = useMemo(() => members.filter((member) => memberStatus === "All" || member.status === memberStatus)
    .filter((member) => `${member.name} ${member.email} ${member.role} ${member.department}`.toLowerCase().includes(query.trim().toLowerCase())), [memberStatus, members, query]);
  const filteredRoles = roles.filter((role) => `${role.name} ${role.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const filteredDepartments = departments.filter((department) => `${department.name} ${department.lead}`.toLowerCase().includes(query.trim().toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const visibleMembers = filteredMembers.slice(pageStart, pageStart + pageSize);
  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];
  const activeMembers = members.filter((member) => member.status === "Active").length;
  const pendingMembers = members.filter((member) => member.status === "Pending").length;

  useEffect(() => setPage(1), [memberStatus, pageSize, query]);
  useEffect(() => {
    // ponytail: local persistence keeps the prototype useful until the team API owns this state.
    localStorage.setItem("tably.team-members", JSON.stringify(members));
    localStorage.setItem("tably.team-roles", JSON.stringify(roles));
    localStorage.setItem("tably.team-departments", JSON.stringify(departments));
  }, [departments, members, roles]);

  function openMember(member?: Member) {
    setEditingMemberId(member?.id);
    setForm(member ? { ...form, name: member.name, email: member.email, role: member.role, department: member.department } : { ...form, name: "", email: "", role: roles.find((role) => role.name === "Waiter")?.name ?? roles[0]?.name ?? "Waiter", department: departments.find((department) => department.name === "Floor Staff")?.name ?? departments[0]?.name ?? "Floor Staff" });
    setModal("member");
  }

  function openRole(role?: Role) {
    setEditingRoleId(role?.id);
    setForm({ ...form, name: role?.name ?? "", description: role?.description ?? "" });
    setModal("role");
  }

  function submitModal(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;
    if (modal === "member") {
      if (!form.email.trim()) return;
      const member: Member = { id: editingMemberId ?? `member-${Date.now()}`, name: form.name.trim(), email: form.email.trim(), role: form.role, department: form.department, status: editingMemberId ? members.find((item) => item.id === editingMemberId)?.status ?? "Active" : "Pending", lastActive: editingMemberId ? members.find((item) => item.id === editingMemberId)?.lastActive ?? "—" : "—" };
      setMembers((current) => editingMemberId ? current.map((item) => item.id === editingMemberId ? member : item) : [member, ...current]);
      setNotice(editingMemberId ? `${member.name} was updated.` : `Invitation sent to ${member.email}.`);
    } else if (modal === "role") {
      if (editingRoleId) setRoles((current) => current.map((role) => role.id === editingRoleId ? { ...role, name: form.name.trim(), description: form.description.trim() } : role));
      else {
        const role: Role = { id: `role-${Date.now()}`, name: form.name.trim(), description: form.description.trim() || "Custom restaurant role.", system: false, tone: "terracotta", permissions: permissionsFor("basic") };
        setRoles((current) => [...current, role]);
        setSelectedRoleId(role.id);
      }
      setNotice(`${form.name.trim()} was saved.`);
    } else if (modal === "department") {
      setDepartments((current) => [...current, { id: `department-${Date.now()}`, name: form.name.trim(), lead: form.lead.trim() || "Unassigned" }]);
      setNotice(`${form.name.trim()} was created.`);
    }
    setModal(null);
  }

  function openPrimaryModal() {
    if (tab === "members") openMember();
    else if (tab === "roles") openRole();
    else {
      setForm({ ...form, name: "", lead: "" });
      setModal("department");
    }
  }

  function cycleMemberFilter() {
    setMemberStatus((current) => current === "All" ? "Active" : current === "Active" ? "Pending" : current === "Pending" ? "Inactive" : "All");
  }

  function togglePermission(moduleId: string, permission: Permission) {
    if (!selectedRole) return;
    setRoles((current) => current.map((role) => role.id !== selectedRole.id ? role : {
      ...role,
      permissions: { ...role.permissions, [moduleId]: role.permissions[moduleId]?.includes(permission) ? role.permissions[moduleId].filter((item) => item !== permission) : [...(role.permissions[moduleId] ?? []), permission] },
    }));
  }

  const header = tab === "members"
    ? { title: "Teams", description: "Manage your team members, roles and permissions.", search: "Search team members…", action: "Invite Team Member" }
    : tab === "roles"
      ? { title: "Roles & Permissions", description: "Create roles and control what team members can see and do.", search: "Search roles…", action: "Create Role" }
      : { title: "Departments", description: "Organise staff around the way your restaurant operates.", search: "Search departments…", action: "Create Department" };

  return (
    <section className="team-management">
      <header className="team-heading">
        <div><h1>{header.title}</h1><p>{header.description}</p></div>
        <div className="team-actions">
          <label><Icon name="search" /><span className="sr-only">{header.search}</span><input type="search" placeholder={header.search} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          {tab === "members" && <button className={memberStatus === "All" ? "" : "active"} type="button" aria-pressed={memberStatus !== "All"} onClick={cycleMemberFilter}><Icon name="filter" />{memberStatus === "All" ? "Filter" : memberStatus}</button>}
          <button className="primary" type="button" onClick={openPrimaryModal}>+ {header.action}</button>
        </div>
      </header>

      <nav className="team-tabs" aria-label="Team management sections">
        <button className={tab === "members" ? "active" : ""} type="button" onClick={() => { setTab("members"); setQuery(""); }}>All Members</button>
        <button className={tab === "roles" ? "active" : ""} type="button" onClick={() => { setTab("roles"); setQuery(""); }}>Roles & Permissions</button>
        <button className={tab === "departments" ? "active" : ""} type="button" onClick={() => { setTab("departments"); setQuery(""); }}>Departments</button>
      </nav>

      {notice && <p className="team-notice" aria-live="polite">{notice}</p>}

      {tab === "members" && <>
        <section className="team-metrics" aria-label="Team summary">
          <article><i className="terracotta">◎</i><span>Total members<strong>{members.length}</strong><small>Across all departments</small></span></article>
          <article><i className="green">●</i><span>Active members<strong>{activeMembers}</strong><small>{Math.round((activeMembers / members.length) * 100)}% of total</small></span></article>
          <article><i className="gold">◷</i><span>Pending invitations<strong>{pendingMembers}</strong><small>Awaiting response</small></span></article>
          <article><i className="violet">◇</i><span>Roles<strong>{roles.length}</strong><small>Restaurant roles</small></span></article>
          <article><i className="blue">⌘</i><span>Departments<strong>{departments.length}</strong><small>Active departments</small></span></article>
        </section>

        <div className="team-member-table">
          <div className="team-member-head"><span>Member</span><span>Role</span><span>Department</span><span>Status</span><span>Last active</span><span>Actions</span></div>
          {visibleMembers.map((member) => <article key={member.id}>
            <div className="team-member-identity"><i>{initials(member.name)}</i><span><strong>{member.name}</strong><small>{member.email}</small></span></div>
            <span className={`team-role-tag ${roles.find((role) => role.name === member.role)?.tone ?? "neutral"}`}>{member.role}</span>
            <span>{member.department}</span>
            <span className={`team-status ${member.status.toLowerCase()}`}><i />{member.status}</span>
            <time>{member.lastActive}</time>
            <div className="team-row-actions"><button type="button" aria-label={`Edit ${member.name}`} onClick={() => openMember(member)}><Icon name="edit" /></button><button type="button" aria-label={member.status === "Pending" ? `Resend invitation to ${member.name}` : `Change ${member.name} status`} onClick={() => member.status === "Pending" ? setNotice(`Invitation resent to ${member.email}.`) : setMembers((current) => current.map((item) => item.id === member.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item))}>{member.status === "Pending" ? <Icon name="mail" /> : <Icon name="more" />}</button></div>
          </article>)}
          {!visibleMembers.length && <p className="team-empty">No team members match this view.</p>}
        </div>

        {filteredMembers.length > 0 && <nav className="team-pagination" aria-label="Team pagination"><span>Showing {pageStart + 1} to {Math.min(pageStart + pageSize, filteredMembers.length)} of {filteredMembers.length} members</span><div><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} className={pageNumber === currentPage ? "active" : ""} type="button" aria-current={pageNumber === currentPage ? "page" : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>›</button></div><label><span>Items per page</span><select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value="8">8</option><option value="10">10</option><option value="20">20</option></select></label></nav>}
      </>}

      {tab === "roles" && selectedRole && <div className="roles-workspace">
        <aside className="roles-list"><header><strong>Roles</strong><span>{roles.length}</span><button type="button" onClick={() => openRole()} aria-label="Create role">+</button></header>{filteredRoles.map((role) => <button key={role.id} type="button" className={role.id === selectedRole.id ? "active" : ""} onClick={() => setSelectedRoleId(role.id)}><i className={role.tone}><Icon name="shield" /></i><span><strong>{role.name}</strong><small>{role.description}</small></span><em>{members.filter((member) => member.role === role.name).length} users</em></button>)}</aside>
        <section className="role-details">
          <header><div><i className={selectedRole.tone}><Icon name="shield" /></i><span><small>Role details</small><h2>{selectedRole.name}</h2><p>{selectedRole.description}</p></span></div><div><button type="button" onClick={() => openRole(selectedRole)}><Icon name="edit" />Edit Role</button><button className="danger" type="button" onClick={() => selectedRole.system ? setNotice("System roles cannot be deleted.") : setRoles((current) => current.filter((role) => role.id !== selectedRole.id))}>Delete Role</button></div></header>
          <nav className="role-tabs"><button className={roleSection === "permissions" ? "active" : ""} type="button" onClick={() => setRoleSection("permissions")}>Permissions</button><button className={roleSection === "users" ? "active" : ""} type="button" onClick={() => setRoleSection("users")}>Users ({members.filter((member) => member.role === selectedRole.name).length})</button><button className={roleSection === "details" ? "active" : ""} type="button" onClick={() => setRoleSection("details")}>Role Details</button></nav>
          {roleSection === "permissions" && <div className="permission-table"><header><div><strong>Module permissions</strong><small>Configure what this role can access and manage.</small></div></header><div className="permission-head"><span>Module</span>{permissionColumns.map((permission) => <span key={permission}>{permission}</span>)}</div>{modules.map((module) => <article key={module.id}><div><strong>{module.name}</strong><small>{module.description}</small></div>{permissionColumns.map((permission) => module.allowed.includes(permission) ? <label key={permission}><input type="checkbox" aria-label={`${selectedRole.name}: ${permission} ${module.name}`} checked={selectedRole.permissions[module.id]?.includes(permission) ?? false} onChange={() => togglePermission(module.id, permission)} /></label> : <span key={permission}>—</span>)}</article>)}</div>}
          {roleSection === "users" && <div className="role-users">{members.filter((member) => member.role === selectedRole.name).map((member) => <article key={member.id}><i>{initials(member.name)}</i><span><strong>{member.name}</strong><small>{member.email} · {member.department}</small></span><em>{member.status}</em></article>)}{!members.some((member) => member.role === selectedRole.name) && <p>No team members use this role yet.</p>}</div>}
          {roleSection === "details" && <dl className="role-metadata"><div><dt>Role type</dt><dd>{selectedRole.system ? "System role" : "Custom role"}</dd></div><div><dt>Assigned users</dt><dd>{members.filter((member) => member.role === selectedRole.name).length}</dd></div><div><dt>Access modules</dt><dd>{Object.values(selectedRole.permissions).filter((permissions) => permissions.length).length}</dd></div></dl>}
          <p className="permission-note">Changes to permissions are applied immediately to all users with this role.</p>
        </section>
      </div>}

      {tab === "departments" && <div className="department-list"><header><span>Department</span><span>Team lead</span><span>Members</span></header>{filteredDepartments.map((department) => <article key={department.id}><div><i>{initials(department.name)}</i><strong>{department.name}</strong></div><span>{department.lead}</span><strong>{members.filter((member) => member.department === department.name).length}</strong></article>)}{!filteredDepartments.length && <p className="team-empty">No departments match your search.</p>}</div>}

      {modal && <div className="team-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><form className="team-modal" onSubmit={submitModal}><header><div><h2>{modal === "member" ? editingMemberId ? "Edit Team Member" : "Invite Team Member" : modal === "role" ? editingRoleId ? "Edit Role" : "Create Role" : "Create Department"}</h2><p>{modal === "member" ? "Assign restaurant access and responsibilities." : modal === "role" ? "Name the role now; permissions can be refined next." : "Create a clear operational group for your team."}</p></div><button type="button" aria-label="Close dialog" onClick={() => setModal(null)}><Icon name="close" /></button></header><div>
        <label><span>{modal === "department" ? "Department name" : modal === "role" ? "Role name" : "Full name"}</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
        {modal === "member" && <><label><span>Email address</span><input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label><label><span>Role</span><select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>{roles.map((role) => <option key={role.id}>{role.name}</option>)}</select></label><label><span>Department</span><select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>{departments.map((department) => <option key={department.id}>{department.name}</option>)}</select></label></>}
        {modal === "role" && <label><span>Description</span><textarea required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label>}
        {modal === "department" && <label><span>Team lead</span><input value={form.lead} onChange={(event) => setForm((current) => ({ ...current, lead: event.target.value }))} placeholder="Optional" /></label>}
      </div><footer><button type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary" type="submit">{modal === "member" ? editingMemberId ? "Save Changes" : "Send Invitation" : modal === "role" ? "Save Role" : "Create Department"}</button></footer></form></div>}
    </section>
  );
}
