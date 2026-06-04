import { useTranslation } from "react-i18next";

import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";

type UserPrimaryAssociation = {
  name: string;
  subtitle: string;
  logoUrl?: string;
};

type UserPrimaryAssociationCardProps = {
  association: UserPrimaryAssociation;
};

export default function UserPrimaryAssociationCard({
  association,
}: UserPrimaryAssociationCardProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-100/70 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-emerald-900">
        {t("managementUsers.detail.association.title")}
      </h3>
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/80 p-4">
        <img
          src={association.logoUrl || avatarPlaceholder}
          alt={association.name}
          className="h-12 w-12 rounded-xl object-cover"
          onError={(event) => {
            event.currentTarget.src = avatarPlaceholder;
          }}
        />
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            {association.name}
          </p>
          {association.subtitle ? (
            <p className="text-xs text-emerald-700">{association.subtitle}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
