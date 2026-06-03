type SavedJobHeaderProps = {
  savedCount: number;
};

const SavedJobHeader = ({ savedCount }: SavedJobHeaderProps) => (
  <header className="flex items-center justify-between -mt-6">
    <h1 className="text-[2rem] font-bold tracking-tight text-foreground">
      Saved Jobs
    </h1>
    <p className="text-base text-muted-foreground">
      You are saving{" "}
      <span className="font-bold text-primary">{savedCount}</span> jobs
    </p>
  </header>
);

export default SavedJobHeader;
