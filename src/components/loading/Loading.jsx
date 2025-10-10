/* eslint-disable react/prop-types */
export default function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-white text-center">
      <div className="flex justify-center items-center h-30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
      <p className="text-xl text-gray-500 whitespace-pre-line">{text}</p>
    </div>
  );
}
