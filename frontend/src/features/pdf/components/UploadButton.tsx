type Props = {
  onUpload: (url: string) => void;
};

export default function UploadButton({ onUpload }: Props) {
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    onUpload(URL.createObjectURL(file));  };

  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={handleUpload}
    />
  );
}