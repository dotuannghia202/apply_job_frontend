export default function ManageUserHeader() {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        {/* <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-4" />
          Toan bo he sinh thai nguoi dung
        </div> */}
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Quan ly nguoi dung
        </h1>
        <p className="text-sm text-slate-600">
          Theo doi tai khoan, trang thai xac minh va hoat dong gan day cua ung
          vien, nha tuyen dung va quan tri vien.
        </p>
      </div>

      {/* <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="gap-2 border-slate-200">
          <Download className="size-4" />
          Xuat danh sach
        </Button>
        <Button className="gap-2">
          <Plus className="size-4" />
          Tao nguoi dung moi
        </Button>
      </div> */}
    </section>
  );
}
