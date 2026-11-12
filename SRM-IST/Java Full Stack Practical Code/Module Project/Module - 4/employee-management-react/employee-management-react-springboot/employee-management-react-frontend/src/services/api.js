const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(body?.message || body?.error || (typeof body === "string" && body) || `Request failed (${response.status})`);
  }
  return body;
}

const normalizeEmployee = (employee) => ({
  ...employee,
  departmentId: employee.department?.id ?? employee.departmentId ?? ""
});

export const api = {
  login: (username, password) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
  employees: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const result = await request(`/employees${query ? `?${query}` : ""}`);
    return { ...result, content: (result.content || []).map(normalizeEmployee) };
  },
  employee: async (id) => normalizeEmployee(await request(`/employees/${id}`)),
  createEmployee: async (employee) => normalizeEmployee(await request("/employees", {
    method: "POST",
    body: JSON.stringify({
      name: employee.name,
      email: employee.email,
      salary: Number(employee.salary),
      departmentId: Number(employee.departmentId)
    })
  })),
  updateEmployee: async (id, employee) => normalizeEmployee(await request(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: employee.name,
      email: employee.email,
      salary: Number(employee.salary),
      departmentId: Number(employee.departmentId)
    })
  })),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),
  departments: () => request("/departments"),
  createDepartment: (name) => request("/departments", {
    method: "POST",
    body: JSON.stringify({ name })
  })
};
