import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserContact = {
  address: string;
  phone: string;
};

type UserContactCardProps = {
  contact: UserContact;
};

export default function UserContactCard({ contact }: UserContactCardProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-lg border  bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <MapPin className="size-4" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {t("managementUsers.detail.contact.title")}
        </h3>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {t("managementUsers.detail.contact.address")}
          </p>
          <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            {contact.address}
          </div>
        </div>
        <div className="space-y-5 text-sm text-slate-700">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {t("managementUsers.detail.contact.phone")}
            </p>
            <p className="mt-2 font-semibold text-slate-900">{contact.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
