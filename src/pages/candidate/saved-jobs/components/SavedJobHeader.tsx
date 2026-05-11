type SavedJobHeaderProps = {
  savedCount: number;
};

const SavedJobHeader = ({ savedCount }: SavedJobHeaderProps) => (
  <header className="flex flex-col gap-2">
    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
      Saved Jobs
    </h1>
    <p className="text-base text-muted-foreground">
      You are saving{" "}
      <span className="font-bold text-primary">{savedCount}</span> jobs
    </p>
  </header>
);

export default SavedJobHeader;
