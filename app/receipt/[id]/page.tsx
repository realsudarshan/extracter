"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Download,
  Trash2,
  FileText,
  Calendar,
  MapPin,
  Phone,
  DollarSign,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { getFileDownloadUrl } from '@/app/actions/getFileDownloadUrl'
import { formatBytes } from '@/hooks/use-file-upload'
import AISummary from '@/components/Receipt/AISummary'

function Receipt() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const receiptId = params.id as Id<"recipts">
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const receipt = useQuery(api.recipts.getReceiptById, {
    id: receiptId,
  })

  const deleteReceipt = useMutation(api.recipts.deleteReciept)

  // Get download URL when receipt is loaded
  useEffect(() => {
    if (receipt?.fileId) {
      getFileDownloadUrl(receipt.fileId).then((result) => {
        if (result.success && result.downloadUrl) {
          setDownloadUrl(result.downloadUrl)
        }
      })
    }
  }, [receipt?.fileId])

  const handleDelete = async () => {
    if (!receipt || !confirm('Are you sure you want to delete this receipt?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteReceipt({ id: receiptId })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting receipt:', error)
      alert('Failed to delete receipt. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  const handleViewPDF = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  if (!receipt) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading receipt...</p>
          </div>
        </div>
      </div>
    )
  }

  const displayName = receipt.fileDisplayName || receipt.fileName
  const isProcessed = receipt.status === 'proceed'

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Receipt Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-400" />
              <div>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>
                  Uploaded on {new Date(receipt.uploadedAt).toLocaleString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleViewPDF}
                disabled={!downloadUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!downloadUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">File Size:</span>
              <span className="ml-2 font-medium">{formatBytes(receipt.size)}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${receipt.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : receipt.status === 'proceed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-800'
                }`}>
                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Data - Only show if processed */}
      {isProcessed && (
        <>
          {/* Merchant Information */}
          {receipt.merchantName && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Merchant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {receipt.merchantName && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{receipt.merchantName}</p>
                    </div>
                  </div>
                )}
                {receipt.merchantAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{receipt.merchantAddress}</p>
                    </div>
                  </div>
                )}
                {receipt.merchantContact && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{receipt.merchantContact}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Transaction Details */}
          {(receipt.transactionDate || receipt.transactionAmount) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {receipt.transactionDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{receipt.transactionDate}</p>
                    </div>
                  </div>
                )}
                {receipt.transactionAmount && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg">
                        {receipt.transactionAmount} {receipt.currency || ''}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          {receipt.items && receipt.items.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {receipt.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {item.unitPrice.toFixed(2)} {receipt.currency || ''}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {item.totalPrice.toFixed(2)} {receipt.currency || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Summary - Pro tier feature */}
          {receipt.reciptSummary && (
            <div className="mb-6">
              <AISummary summary={receipt.reciptSummary} />
            </div>
          )}
        </>
      )}

      {/* Pending State */}
      {!isProcessed && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">Processing receipt...</p>
            <p className="text-sm text-gray-500">
              The receipt is being analyzed. Please check back in a few moments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Receipt
