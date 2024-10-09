import React from 'react'

type PreviewAreaProps = {
  files: File[]
  removeFile: (index: number) => void
}

export const PreviewArea = ({ files, removeFile }: PreviewAreaProps) => (
  <>
    {files && files.length > 0 && (
      <div className="flex flex-wrap gap-4 border-2 border-dashed border-green-300 p-4">
        {files.map((file, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)
