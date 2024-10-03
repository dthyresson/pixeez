import React, { useCallback } from 'react'

import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'

import { toast } from '@redwoodjs/web/toast'

type UploadFileComponentProps = {
  onFileAccepted: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: Record<string, string[]>
  children?: React.ReactNode
  onDropEvent?: (event: DropEvent) => void
  onDropRejected?: (rejectedFiles: FileRejection[]) => void
  dropzoneContent?: React.ReactNode
  dropActiveContent?: React.ReactNode
  uploadButtonContent?: React.ReactNode
  className?: string // Add this new prop
}

const UploadFileComponent = ({
  onFileAccepted,
  maxFiles = 20,
  acceptedFileTypes = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  children,
  dropzoneContent = <p>Drag n drop some files here</p>,
  dropActiveContent = <p>Drop the files here ...</p>,
  uploadButtonContent = <span>Click to upload</span>,
  className = 'm-4 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center',
}: UploadFileComponentProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: File[]) => {
      if (rejectedFiles.length > 0) {
        if (rejectedFiles.length > maxFiles) {
          toast.error(`You can only upload up to ${maxFiles} files at a time`)
        } else {
          const nonAcceptedFiles = rejectedFiles.filter(
            (file) =>
              !Object.keys(acceptedFileTypes).some((type) =>
                file.type.startsWith(type)
              )
          )
          if (nonAcceptedFiles.length > 0) {
            toast.error('Some files are not of the accepted type')
          }
        }
        return
      }

      onFileAccepted(acceptedFiles)
    },
    [maxFiles, acceptedFileTypes, onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      const rejectedFiles = fileRejections.map((rejection) => rejection.file)
      onDrop(acceptedFiles, rejectedFiles)

      // Handle the event if needed
      if (event.type === 'drop') {
        console.log('Files were dropped')
        // You can access event properties like event.target, event.preventDefault(), etc.
      }
    },
    accept: acceptedFileTypes,
    maxFiles,
    noClick: true,
  })

  return (
    <div {...getRootProps()} className={`${className}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        dropActiveContent
      ) : (
        <>
          {dropzoneContent}
          {children}
        </>
      )}
      <button className="font-inherit cursor-pointer" onClick={open}>
        {uploadButtonContent}
      </button>
    </div>
  )
}

export default UploadFileComponent
