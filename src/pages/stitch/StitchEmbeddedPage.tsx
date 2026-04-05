type StitchEmbeddedPageProps = {
  src: string;
  title: string;
};

const StitchEmbeddedPage = ({ src, title }: StitchEmbeddedPageProps) => {
  return (
    <div className="h-screen w-full bg-slate-100">
      <iframe
        title={title}
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default StitchEmbeddedPage;
