import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdminPage } from "@/lib/admin-auth";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdminPage("/admin");
  if (!user) {
    return (
      <main className="admin-access-denied">
        <div>
          <span>403</span>
          <h1>Akun ini bukan administrator.</h1>
          <p>Pastikan ADMIN_EMAILS sudah diisi dan gunakan akun yang tercantum pada allowlist tersebut.</p>
          <a href="/signout?return_to=/admin">Masuk dengan akun lain</a>
        </div>
      </main>
    );
  }
  return <AdminDashboard user={user} />;
}
