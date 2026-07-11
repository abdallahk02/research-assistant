const papers = [
  "Attention Is All You Need",
  "CLIP",
  "SAM 2",
];

export default function PaperSidebar() {
  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-3">
        Papers
      </h2>

      {papers.map((paper) => (
        <div
          key={paper}
          className="p-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          {paper}
        </div>
      ))}
    </div>
  );
}