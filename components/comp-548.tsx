"use client"

import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react"

import {
  FileMetadata,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { RedirectToSignUp, SignUp, useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { getFileDownloadUrl } from "@/app/actions/getFileDownloadUrl"
import { inngest } from "@/inngest/client"
import events from "@/inngest/constants"
import { sendInngestEvent } from "@/lib/inngestEventSend"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useSchematicEntitlement } from "@schematichq/schematic-react"
// Create some dummy initial files


export default function CustomDropzone({ landingpage, dashboard = false }: any) {
  const [showSignup, setShowSignup] = useState(false)
  const { user } = useUser()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const maxSize = 10 * 1024 * 1024 // 10MB default
  const generateUploadUrl = useMutation(api.recipts.generateUploadUrl);
  const storeReciepts = useMutation(api.recipts.storeReciepts);
  //to upload file if file is uploaded
  const router = useRouter()
  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureAllocation,
    featureUsage,
  } = useSchematicEntitlement("scans") as any;
  console.log("The feature is enabled", isFeatureEnabled, "  featureUsageExceeded", featureUsageExceeded, "featureAllocation", featureAllocation);


  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,

  })

  const file = files[0]
  const handleUpload = async () => {
    if (!file || !user) return

    // Check if feature is enabled and not exceeded
    if (!isFeatureEnabled || featureUsageExceeded) {
      setUploadError("Scanning limit reached. Please upgrade your plan.");
      return;
    }

    setUploading(true)
    setUploadError("")
    try {
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.file.type },
        body: file.file,
      })

      if (!result.ok) {
        const err = await result.json()
        throw new Error(`Upload failed: ${JSON.stringify(err)}`)
      }

      const { storageId } = await result.json()
      const receiptId = await storeReciepts({
        userId: user.id,
        fileId: storageId,
        fileName: file.file.name,
        size: file.file.size,
        mimeType: file.file.type
      })
      setUploadSuccess(true)
      //generate file url
      const fileurl = await getFileDownloadUrl(storageId)
      console.log("The data is", fileurl.downloadUrl, receiptId)
      const response = await axios.post("/api/trigger-inngest", {
        url: fileurl.downloadUrl,
        receiptId,
      });
      // const resullt= await sendInngestEvent({ url: fileurl.downloadUrl, receiptId })
      console.log(result);
      removeFile(file)
    } catch (error: any) {
      setUploadError(error.message)
    } finally {
      if (dashboard) router.push("/dashboard")
      setUploading(false)
    }
  }
  useEffect(() => {
    if (file && !landingpage) {
      handleUpload()
    }
  }, [file])

  return (
    <div>
      <div className="flex flex-col gap-2">
        {/* Drop area */}
        <div
          role="button"
          onClick={landingpage ? () => setShowSignup(true) : openFileDialog}
          onDragEnter={landingpage ? () => setShowSignup(true) : handleDragEnter}
          onDragLeave={landingpage ? () => setShowSignup(true) : handleDragLeave}
          onDragOver={landingpage ? () => setShowSignup(true) : handleDragOver}
          onDrop={landingpage ? () => setShowSignup(true) : handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input  hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload file"
            disabled={Boolean(file) || !isFeatureEnabled || featureUsageExceeded}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <UploadIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload file</p>
            <p className="text-muted-foreground text-xs">
              Drag & drop or click to browse (max. {formatBytes(maxSize)})
            </p>
            {featureAllocation !== undefined && (
              <p className="text-muted-foreground text-xs mt-1">
                {featureUsageExceeded ? "Limit reached" : `${Math.max(0, featureAllocation - (featureUsage || 0))} scans remaining`}
              </p>
            )}
          </div>
        </div>
        {errors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}

        {/* File list */}
        {file && null
        }
        {showSignup ? <>
          <RedirectToSignUp />
        </> : null}
      </div>
      {(!landingpage && !dashboard) && (<div className="flex justify-center items-center mt-3">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>)}

    </div>

  )
}
