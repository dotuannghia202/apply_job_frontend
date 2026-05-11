import ApplicationCard from "@/pages/candidate/my-applycations/components/ApplicationCard";
import ApplicationsTabs from "@/pages/candidate/my-applycations/components/ApplicationsTabs";
import type { ApplicationItem } from "@/pages/candidate/my-applycations/components/types";

const applications: ApplicationItem[] = [
  {
    id: "app-1",
    title: "Senior Backend Engineer",
    company: "TechNova Systems",
    location: "San Francisco, CA",
    appliedOn: "12 May, 2026",
    resumeName: "My_Backend_CV.pdf",
    fitScore: 85,
    status: "Pending",
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIJ6s7oHQN3-Ui2bQZTVrAAVxY8-0YNdAuML3XqxXxlzdoej_fJqUHv5c_d-QUQsNN2uzCHwxmf7n2Om5DjqtIvCityvFobwolRf9-xvxZxK7JDMT3Tg27ynyPXvZBJP6wPhroGa0k7yXxKtnGZh-lXYyeR4uR5Fc7W1fb8slY87-lmMEPbrLNipC3No5FFMYxMsKrJn2wFBP5DaixqAzX3YEyQFSHCU0WQuywgZwgCTpGFBMPbMYMAPw8jMiju6sPodvaEYNYUwyV",
  },
  {
    id: "app-2",
    title: "Lead Product Designer",
    company: "Elevate Studios",
    location: "Remote",
    appliedOn: "05 May, 2026",
    resumeName: "Design_Portfolio_2026.pdf",
    fitScore: 92,
    status: "Interview",
    statusTone: "accent",
    logoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXSB9Zx3Fpw5vSAWNMJwoovaD20ZkTlmoC0jb2Ud6WNGnSl13CUUYYkfjX-SphI7wi027cCjoIr8Ble_X4XjDPUjzbTtsdZX-qUX8X4u7wF6-3WisiYE8EKIP11yO_UcwkrAAgXvMDYkI1lDmPELifJbP11gW2rjRcmIL5OHZb3kgeWH7nCPZIjeXnovxzTAZOnZ9WG3ZdwUneuY_6AYrb2e1sUQUgK4N56_sqUUpQHDTwc-cZ_A9jfkjYVdOjlBed6-Q_6WzHm0oq",
  },
];

const MyApplycationsList = () => {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12">
      <section>
        <h1 className="mb-2 text-[2.75rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          My Applications
        </h1>
        <p className="text-base text-muted-foreground">
          Track and manage your job applications
        </p>
      </section>

      <ApplicationsTabs />

      <section className="flex flex-col gap-6">
        {applications.map((item) => (
          <ApplicationCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
};

export default MyApplycationsList;
