export function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-line py-10 text-sm text-olive-deep md:flex-row md:justify-between">
      <div>Mapii Infantil © {new Date().getFullYear()}</div>
      <div>mapii.cl · Instagram</div>
    </footer>
  );
}
