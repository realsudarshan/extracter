"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ReciptList() {
  const router = useRouter()
  const { user } = useUser();
  const reciepts = useQuery(api.recipts.getRecipts, {
    userId: user?.id || ""
  })
  if (!user) {
    return (
      <div className='w-full p-8 text-center'>
        <p className="text-gray-400">Please sign in to continue</p>
      </div>
    )
  }
  if (!reciepts) {
    return (
      <div className='w-full p-8 text-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
        <p>Loading reciepts---</p>

      </div>
    )
  }
  return (
    <div className='w-full'>
      <h2 className='text-xl font-semibold mb-4'>Your reciepts</h2>
      <div className='bg-white-border border-gray-200 rounded-lg overflow-hidden'>
        {/* render table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40px]'></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[40px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* <TableRow>
              
            </TableRow> */}
            {reciepts.map((receipt: Doc<"recipts">) => (
              <TableRow
                key={receipt._id}
                className='cursor-pointer hover:bg-gray-50'
                onClick={
                  () => router.push(`/receipt/${receipt._id}`)
                }
              >
                <TableCell className='py-2'>
                  <FileText className='h-6 w-6 text-red-400' />
                </TableCell>
                <TableCell className='py-2'>
                  <p className='text-gray-600'>{receipt.fileName}</p>
                </TableCell>
                <TableCell className='py-2'>
                  <p className='text-gray-600'>{new Date(receipt.uploadedAt).toLocaleDateString()}</p>
                </TableCell>
                <TableCell className='py-2'>
                  <p className='text-gray-600'>{formatBytes(receipt.size)}</p>
                </TableCell>
                <TableCell className='py-2'>
                  <p className='text-gray-600'>
                    {receipt.transactionAmount ? `${receipt.transactionAmount} ${receipt.currency}` : "-"}
                  </p>
                </TableCell>
                <TableCell className='py-2'>
                  <span className={`px-2 py-1 rounded-full text-xs ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-600" : receipt.status === "processed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-800"}`}>
                    {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <ChevronRight className='h-5 w-5 text-gray-400 ml-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ReciptList
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const converted = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${converted} ${sizes[i]}`;
}
