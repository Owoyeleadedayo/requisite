/*
 * ToS (Terms of Service) Service
 *
 * DEMO / DUMMY IMPLEMENTATION
 * All API calls are commented out. The service reads from a local sample
 * JSON file instead. To go live, uncomment the apiClient calls and remove
 * the sample-data imports and overrides below.
 */

/* import { apiClient } from "@/lib/apiClient"; */
import tosSamples from "@/data/tos-samples.json";

export interface ToS {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* In-memory store so create/update/delete feel real during the demo */
let demoStore: ToS[] = tosSamples.map((t) => ({ ...t }));

export const tosService = {
  fetchToSList: async (): Promise<ToS[]> => {
    /* Live implementation:
    const data = await apiClient.get<ToS[] | { success: boolean; data: ToS[] }>("/tos");
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).data)) return (data as any).data;
    return [];
    */
    return Promise.resolve([...demoStore]);
  },

  getToSById: async (id: string): Promise<ToS> => {
    /* Live: return apiClient.get<ToS>(`/tos/${id}`); */
    const found = demoStore.find((t) => (t._id || t.id) === id);
    if (!found) throw new Error(`ToS ${id} not found`);
    return Promise.resolve({ ...found });
  },

  createToS: async (body: { title: string; content: string }): Promise<ToS> => {
    /* Live: return apiClient.post<ToS>("/tos", body); */
    const created: ToS = {
      _id: `tos-demo-${Date.now()}`,
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
    };
    demoStore = [created, ...demoStore];
    return Promise.resolve({ ...created });
  },

  updateToS: async (
    id: string,
    body: { title?: string; content?: string },
  ): Promise<ToS> => {
    /* Live: return apiClient.put<ToS>(`/tos/${id}`, body); */
    demoStore = demoStore.map((t) =>
      (t._id || t.id) === id ? { ...t, ...body } : t,
    );
    const updated = demoStore.find((t) => (t._id || t.id) === id);
    if (!updated) throw new Error(`ToS ${id} not found`);
    return Promise.resolve({ ...updated });
  },

  deleteToS: async (id: string): Promise<{ message: string }> => {
    /* Live: return apiClient.delete<{ message: string }>(`/tos/${id}`); */
    demoStore = demoStore.filter((t) => (t._id || t.id) !== id);
    return Promise.resolve({ message: "Deleted successfully" });
  },
};
