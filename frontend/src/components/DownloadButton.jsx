function DownloadButton({ data, format, filename }) {
  const handleDownload = () => {
    const blob = new Blob([format === 'json' ? JSON.stringify(data, null, 2) : data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">
      Download as .{format}
    </button>
  );
}

export default DownloadButton;