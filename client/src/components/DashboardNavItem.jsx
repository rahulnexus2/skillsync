import { Link } from "react-router-dom";

export function DashboardNavItem({ to, icon: Icon, label, isActive, mobile = false, onClick }) {
  const base =
    "flex items-center gap-3 rounded-lg transition-colors duration-150 active:scale-[0.98]";
  const pad = mobile ? "px-4 py-3 justify-center sm:justify-start" : "px-3 py-2";
  const active =
    "bg-primary/10 text-primary font-medium border border-primary/20";
  const inactive =
    "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${base} ${pad} ${isActive ? active : inactive}`}
    >
      <Icon className={mobile ? "h-5 w-5 shrink-0" : "h-4 w-4 shrink-0"} />
      <span className={`${mobile ? "text-sm font-medium" : "text-sm"}`}>{label}</span>
    </Link>
  );
}
