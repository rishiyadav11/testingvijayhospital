'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { deleteDoctor } from '@/lib/actions/doctor-actions'
import { toast } from 'sonner'

interface Doctor {
  id: string
  name: string
  photo: string | null
  department: string
  experience: string
  status: 'DRAFT' | 'PUBLISHED'
  updatedAt: Date
}

interface DoctorsListProps {
  doctors: Doctor[]
}

export function DoctorsList({ doctors: initialDoctors }: DoctorsListProps) {
  const router = useRouter()
  const [data] = useState<Doctor[]>(initialDoctors)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const columns: ColumnDef<Doctor>[] = useMemo(
    () => [
      {
        accessorKey: 'photo',
        header: 'Photo',
        cell: (info) => {
          const photo = info.getValue() as string | null
          return photo ? (
            <img
              src={photo}
              alt="Doctor"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
              No photo
            </div>
          )
        },
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'experience',
        header: 'Experience',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status}
            </span>
          )
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: (info) => {
          const date = info.getValue() as Date
          return new Date(date).toLocaleDateString()
        },
        sortingFn: 'datetime',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const doctor = info.row.original
          return (
            <div className="flex gap-2">
              <Link href={`/admin/doctors/${doctor.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(doctor.id, doctor.name)}
                isLoading={isDeleting === doctor.id}
                disabled={isDeleting !== null}
              >
                Delete
              </Button>
            </div>
          )
        },
        size: 150,
      },
    ],
    [isDeleting]
  )

  const filteredData = useMemo(() => {
    return data.filter((doctor) => {
      const matchesGlobal =
        !globalFilter ||
        doctor.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        doctor.department.toLowerCase().includes(globalFilter.toLowerCase())

      const matchesDepartment =
        !departmentFilter || doctor.department === departmentFilter

      const matchesStatus = !statusFilter || doctor.status === statusFilter

      return matchesGlobal && matchesDepartment && matchesStatus
    })
  }, [data, globalFilter, departmentFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return
    }

    setIsDeleting(id)
    try {
      const result = await deleteDoctor(id)
      if (result.success) {
        toast.success('Doctor deleted successfully')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete doctor')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('An error occurred while deleting')
    } finally {
      setIsDeleting(null)
    }
  }

  // Get unique departments for filter
  const departments = Array.from(new Set(data.map((d) => d.department)))

  const rows = table.getRowModel().rows

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search by name
            </label>
            <Input
              placeholder="Search doctors..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setGlobalFilter('')
                setDepartmentFilter('')
                setStatusFilter('')
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600 mb-4">No doctors found</p>
            <Link href="/admin/doctors/new">
              <Button>Create First Doctor</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-100"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span className="text-xs">
                                {header.column.getIsSorted() === 'desc'
                                  ? '↓'
                                  : '↑'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()} ({rows.length} results)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{data.length}</div>
            <div className="text-sm text-slate-600">Total Doctors</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.filter((d) => d.status === 'PUBLISHED').length}
            </div>
            <div className="text-sm text-slate-600">Published</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {data.filter((d) => d.status === 'DRAFT').length}
            </div>
            <div className="text-sm text-slate-600">Draft</div>
          </div>
        </div>
      )}
    </div>
  )
}
