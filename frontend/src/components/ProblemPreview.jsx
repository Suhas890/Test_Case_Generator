function ProblemPreview({ content }) {
  return (
    <div className="mt-8 p-4 border rounded bg-gray-100 dark:bg-gray-800">
      <h2 className="text-xl font-bold">Problem Preview</h2>
      <p>{content}</p>
    </div>
  );
}

export default ProblemPreview;